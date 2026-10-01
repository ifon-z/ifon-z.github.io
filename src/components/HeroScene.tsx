import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ---------------------------------------------------------------------------
   HEAVY MODULE — reached only through a dynamic import() in ./Hero3D.tsx.
   Never import this file statically from App.tsx, or three.js (~150 kB gzip)
   lands in the initial chunk and delays the hero copy's first paint.

   The object is one instanced icosahedron whose vertices are pushed along
   their normals by 3D simplex noise, plus a fibonacci point shell.
   No drei, no postprocessing, no transmission material, no HDR environment —
   each of those is a measurable first-paint or battery regression here.
--------------------------------------------------------------------------- */

const GLSL_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vView;

${GLSL_NOISE}

void main() {
  vec3 p = position;
  float d = snoise(normal * 1.35 + vec3(0.0, 0.0, uTime * 0.24));
  float ripple = snoise(normal * 3.1 + vec3(uTime * 0.16, uTime * 0.11, 0.0));
  float disp = d * uAmp + ripple * uAmp * 0.32;

  vDisp = disp;
  vNormalW = normalize(normalMatrix * normal);
  p += normal * disp;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

/* The page is light, so the object has to be a DARK mass with a bright rim —
   a pale object simply disappears into the warm white background. */
const FRAGMENT = /* glsl */ `
uniform vec3 uDark;
uniform vec3 uEdge;
uniform vec3 uRim;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vView;

void main() {
  float t = smoothstep(-0.22, 0.34, vDisp);

  vec3 n = normalize(vNormalW);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);
  float key = clamp(dot(n, normalize(vec3(-0.55, 0.8, 0.55))), 0.0, 1.0);

  // Ridges lighten toward the olive edge colour, valleys stay near-ink.
  vec3 base = mix(uDark, uEdge, t * 0.55);
  vec3 color = base * (0.6 + key * 0.75) + uRim * fres * 0.9;

  gl_FragColor = vec4(color, 1.0);
}
`

const DARK = '#16200f'
const EDGE = '#5f7d2a'
const RIM = '#a9c46a'

// Point shell: a radial falloff in the fragment shader gives round dots with a
// soft edge. Additive blending is wrong here — on a light page it washes out.
const POINT_VERTEX = /* glsl */ `
uniform float uSize;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize / max(-mv.z, 0.001);
  gl_Position = projectionMatrix * mv;
}
`

const POINT_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = smoothstep(0.5, 0.12, d) * uOpacity;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`

const LOW = '#16200f'

function Orb() {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: 0.19 },
    uDark: { value: new THREE.Color(DARK) },
    uEdge: { value: new THREE.Color(EDGE) },
    uRim: { value: new THREE.Color(RIM) },
  })

  // One geometry instance for the wireframe cage, disposed with the scene.
  const cage = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.4, 3)), [])
  useEffect(() => () => cage.dispose(), [cage])

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05)
    uniforms.current.uTime.value += step
    if (mesh.current) {
      mesh.current.rotation.y += step * 0.16
      mesh.current.rotation.x = Math.sin(uniforms.current.uTime.value * 0.18) * 0.22
    }
  })

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.32, 24]} />
        <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms.current} />
      </mesh>
      <lineSegments geometry={cage}>
        <lineBasicMaterial color="#7d9a3e" transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

/** Fibonacci-sphere point shell: cheap "data at scale" texture, 1500 points.
    Pushed out past the orb, drawn small and semi-transparent, so it reads as a
    field around the object instead of swallowing it. */
function PointShell() {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 1500
    const array = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const scale = 2.15 + (i % 5) * 0.06
      array[i * 3] = Math.cos(theta) * radius * scale
      array[i * 3 + 1] = y * scale
      array[i * 3 + 2] = Math.sin(theta) * radius * scale
    }
    return array
  }, [])

  const uniforms = useMemo(
    () => ({
      // multiplied by the renderer's pixel ratio on every frame
      uSize: { value: 40 },
      uColor: { value: new THREE.Color('#3f5620') },
      uOpacity: { value: 0.55 },
    }),
    [],
  )

  useEffect(() => {
    const geometry = points.current?.geometry
    return () => geometry?.dispose()
  }, [])

  useFrame(({ gl }, delta) => {
    uniforms.uSize.value = 40 * gl.getPixelRatio()
    if (points.current) points.current.rotation.y -= Math.min(delta, 0.05) * 0.06
  })

  return (
    <points ref={points} rotation={[0.4, 0, 0.15]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={POINT_VERTEX}
        fragmentShader={POINT_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

function Rig({ scrollRef }: { scrollRef: RefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth - 0.5) * 0.55
      target.current.y = (event.clientY / window.innerHeight - 0.5) * 0.45
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame(() => {
    // Damped follow, so the object lags the cursor instead of snapping to it.
    pointer.current.x += (target.current.x - pointer.current.x) * 0.06
    pointer.current.y += (target.current.y - pointer.current.y) * 0.06
    if (!group.current) return
    const scroll = scrollRef.current ?? 0
    group.current.position.y = pointer.current.y * -0.4 - scroll * 1.5
    group.current.rotation.x = pointer.current.y * 0.5
    group.current.rotation.z = pointer.current.x * 0.25 + scroll * 0.7
    group.current.scale.setScalar(Math.max(0.45, 1 - scroll * 0.25))
  })

  return (
    <group ref={group}>
      <Orb />
      <PointShell />
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 4, 2]} intensity={1.5} color="#e8f0c0" />
      <directionalLight position={[3, -2, -3]} intensity={0.55} color={new THREE.Color(DARK).getStyle()} />
    </group>
  )
}

export default function HeroScene({
  scrollRef,
  onReady,
}: {
  scrollRef: RefObject<number>
  onReady?: () => void
}) {
  const host = useRef<HTMLDivElement>(null)

  // Fade in through the DOM directly. Driving this from React state races the
  // reconciler's commit and can leave the canvas permanently at opacity 0.
  // The effect only runs once the canvas is actually in the document.
  useEffect(() => {
    const canvas = host.current?.querySelector('canvas')
    if (!canvas) return
    canvas.style.transition = 'opacity 900ms cubic-bezier(.22,1,.36,1)'
    const frame = requestAnimationFrame(() => {
      canvas.style.opacity = '1'
      onReady?.()
    })
    return () => cancelAnimationFrame(frame)
  }, [onReady])

  return (
    <div ref={host} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent' }}
        // Clear to fully transparent so the page background and the painted
        // halo behind the canvas stay visible around the object.
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Rig scrollRef={scrollRef} />
      </Canvas>
    </div>
  )
}
