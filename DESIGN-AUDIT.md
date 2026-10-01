# 前端样式 / 风格审计与「更大胆」改造 —— 已实施

> 对象：`ifon-z.github.io`（Vite 8 + React 19 + 单页 + 手写 CSS，GitHub Pages 静态部署）
> 状态：**A + B + C 三个方案已全部落地，`pnpm build` 通过，并在无头浏览器中逐版块截图验证。**

预览：[首屏](docs/preview-hero.png) · [作品区](docs/preview-work.png)

---

## 一、改造前的诊断

| 问题 | 改造前 | 位置 |
| --- | --- | --- |
| 尺度太保守 | Hero 标题 `clamp(42px, 5.3vw, 69px)`；标签 **10px**、导航 12px、正文 15px，全站挤在 10–15px 的窄带里 | `styles.css` |
| 只有一种调性 | 全站 100% 米白 `#fafaf8`，滚动像一条直线，没有明暗节奏 | — |
| 「3D 感」是假的 | `hero-mark` 只是平面同心方框 + 一个小方块，没有透视、没有光影 | `App.tsx:40` |
| 作品区最弱 | 三张卡片 = 一个背景色 + 一个方块；三色明度接近，分不出彼此 | `styles.css:10-13` |
| 零动效 | 除 `:hover` 变色外没有任何 transition / transform / animation | 全站 |
| 设计令牌缺失 | 只有 1 个 `--accent`，其余颜色/间距/字号全是字面量，末尾还有 6 行覆盖补丁 | `styles.css:6-13` |
| 可访问性 | 无 `:focus-visible`、无 `prefers-reduced-motion`；`#888` 小字对比度约 3.5:1（低于 AA 4.5:1） | — |
| 字体阻塞 | Google Fonts 的 CSS `@import` 在样式表首行，会阻塞首屏，并把访客 IP 暴露给第三方 | `styles.css:1` |

---

## 二、实际做了什么

### 1. 设计令牌体系（原方案 A 的骨架）

`src/styles.css` 现在是**分层的**：令牌 → 基础 → 布局 → 组件 → 动效 → 响应式 → 减弱动效。

- 一处定义全部颜色、间距、圆角、阴影、缓动、时长；
- 六级 `clamp()` 字阶（`--step--2` … `--step-5`）取代满地的 10/12/15px；
- `--gutter`、`--measure`、`--radius`、`--shadow-1/2`、`--ease-out`、`--dur`；
- 删掉了文件末尾那 6 行覆盖补丁，也删掉了散落的 `#84aa43` 硬编码。

**对比度同时修好**：小字从 `#888` 提到 `--muted: #5d5c53`（≥4.5:1），浅底强调色从 `#84aa43` 换成 `--accent-deep: #4d6320`（≥4.5:1）。

### 2. 排版尺度（方案 A）—— 但为中文重新定标

这一条在实施中**推翻了我最初的建议**。原方案写的是 Hero 放到 12–18vw，实测直接翻车：CJK 字形是满宽的、没有 ascender/descender 余量，`line-height: 0.88` 会让字**互相重叠**，15rem 会**溢出容器**。

实施后的做法：

```css
/* 中文基线下更保守：CJK 没有升降部余量，0.9 行高会碰撞、超大字号会溢出 */
--step-4: clamp(2.2rem, 1.4rem + 3.4vw, 4.4rem);
--step-5: clamp(2.4rem, 1.2rem + 5vw, 5.6rem);

/* 只有英文才回到紧凑的展示体设定 */
:lang(en) .hero-title { font-size: clamp(2.4rem, 1rem + 5vw, 5rem); line-height: 0.96; }
```

配套修正：CJK 标题 `letter-spacing` 从 `-.045em` 收紧到 `-.015em ~ -.025em`（负值太大在中文字上会显得散）；`line-height` 提到 1.14–1.24；标题的 `text-wrap: balance` 改为 `normal`，因为断行是靠 `<br>` 手工控制的，balance 会把它打乱并造成 `experiences` 这种词被拆开。

**Playfair 斜体只在英文生效**。它没有中文字形，用在中文上会掉进系统宋体，看起来像 bug。中文改用一条橄榄色下划线代替：

```css
:lang(zh) .serif-em {
  font-family: inherit; font-style: normal; font-weight: 800;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-position: 0 88%; background-size: 100% 0.16em; background-repeat: no-repeat;
}
```

### 3. 真的 3D 物体（方案 B）

`src/components/HeroScene.tsx` —— R3F + 手写 GLSL：

- **扭曲多面体**：`IcosahedronGeometry(1.32, 24)`，顶点沿法线被 3D simplex noise 位移（两个频率叠加），自定义 `ShaderMaterial` 按位移量在墨色↔橄榄色之间取色，再加 Fresnel 边缘光；
- **线框笼**：`WireframeGeometry(IcosahedronGeometry(1.4, 3))`；
- **斐波那契点壳**：1500 个点，片元着色器里用径向衰减画出圆形柔边（**不用** `AdditiveBlending` —— 在浅色页面上会整片发白）；
- **交互**：鼠标位置阻尼跟随（`lerp` 0.06），滚动驱动 `rotate + scale + 位移`，让物体在离开首屏时退场。

**关键工程约束（都做到了）：**

| 约束 | 实现 |
| --- | --- |
| three.js 不能进首屏包 | `Hero3D.tsx`（薄加载器）→ 动态 `import('./HeroScene')`。Vite 会以 `INEFFECTIVE_DYNAMIC_IMPORT` 警告守住这条边界 |
| 不能拖慢 LCP | 只在 `requestIdleCallback` 里加载；加载前首屏文案已绘制 |
| 必须有兜底 | CSS 海报（三层旋转圆环 + 径向光晕 + 物体光晕），**它本身就是一个完整的设计**，不是占位符 |
| `prefers-reduced-motion` | 命中就**完全不加载** canvas，只留海报 |
| save-data | 同上，不加载 |
| chunk 失败 | `.catch()` 静默保留海报，绝不白屏 |
| 移动端 | `dpr={[1, 1.5]}`、`performance={{ min: 0.5 }}`；手机上物体缩到 210px，不把文案挤出首屏 |
| 资源释放 | 线框几何体、点几何体都在 effect cleanup 里 `dispose()` |
| 不用重资源 | 无 drei、无后处理、无 `MeshTransmissionMaterial`、无 HDR `Environment` |

### 4. 项目卡换成真实图片（方案 A + C）

- 从 Unsplash 下载 4 张源图，用 Pillow 转成 **800w / 1600w 两档 WebP** 提交进仓库（`public/projects/`）；署名见 [CREDITS.md](CREDITS.md)。**不做热链**——作品集的图 404 是最糟的失败模式；
- 每张 `<img>` 都带 `srcset` / `sizes` / `width` / `height`（防止 CLS）/ `loading="lazy"` / `decoding="async"`；
- **双色调统一**：`filter: grayscale(1) contrast(1.12)` + 橄榄色 `mix-blend-mode: color` 叠加层，把四张来源各异的照片统一成一套色彩语言；
- 卡片改为「图 / 文」左右交替（`:nth-child(even)` 换边），视线沿页面呈 Z 字下行；
- 新增 **满幅地球夜景段落**（"数据流过每一个时区"），同样是双色调处理。

### 5. 动效层（零依赖）

- `src/lib/motion.ts`：一个全局 `IntersectionObserver`，一次性 `unobserve`，用 `--reveal-i` 做错峰入场；
- **默认可见，JS 只负责「加动效」**。这条是刻意的：如果 JS 被禁用、observer 从未触发、或浏览器不支持，内容依然全部可见。没有采用 `animation-timeline: view()` 作为唯一手段——Firefox 尚未默认支持，那样会让内容**永久不可见**；
- 首屏入场：`hero-in` / `title-in`（带 `clip-path` 遮罩揭开）/ `stage-in`，纯 CSS keyframes；
- **磁性按钮**：`pointermove` 计算相对中心的偏移，`translate3d` 跟随，`pointerleave` 归位；用 `@media (hover: hover) and (pointer: fine)` 守卫，触屏不启用；
- **走马灯**：两份相同轨道 + `translateX(0 → -50%)`，间距放在每个 item 上（不是轨道的 `gap`），这样 -50% 正好落在第二份的起点，**循环无闪跳**；hover 暂停。

### 6. 明暗对撞 + 质感（方案 C）

- **Work 整段反色**：`#0a100d` 底 + 米白字，用 `margin-inline: calc(50% - 50vw)` 满幅出血，与前后米白段形成硬切；
- **全站噪点**：内联 SVG `feTurbulence` 的 data-URI，`position: fixed`、`opacity: .05`、`mix-blend-mode: multiply`，**永不动画**（动画化滤镜是逐帧全量重绘）。z-index 放在顶栏之下、内容之上；
- 项目标签做胶囊描边，年份用等宽体 `tabular-nums`。

### 7. 工程与可访问性

- **字体自托管**：`@fontsource-variable/manrope` + `@fontsource/playfair-display`，在 `src/main.tsx` 里 import，**彻底删掉 Google Fonts 的 CSS `@import`**。中文刻意走系统字体栈（PingFang SC / Noto Sans SC / 微软雅黑）——子集化的中文 webfont 会比页面其余部分加起来还大；
- 补齐 `:focus-visible`（之前完全没有，键盘用户看不见焦点）；
- 切换语言时同步更新 `<html lang>`；
- 顶栏加了 `aria-expanded` / `aria-controls`，菜单按钮的 `aria-label` 随状态变化；
- 图片有**描述性** `alt`（不是 "project image"）；
- `>=700px` / `<=760px` / `<=420px` 三档断点；`scroll-padding-top` 让锚点跳转不被吸顶栏挡住。

---

## 三、动手过程中真实踩到的坑

这几条值得单独记下来，它们都是「看截图才发现」的类型：

1. **CJK 不能套用拉丁文的展示体设定。** 见 §2。中文的 `line-height: 0.88` 直接重叠。
2. **浅色页面上 3D 物体不能是浅色的。** 第一版用「深底 + 亮橄榄」的配色，在米白背景上几乎看不见——必须反过来做成**深色实体 + 亮边缘光**。点阵也不能用 `AdditiveBlending`，否则整片泛白。
3. **`opacity` 门控会和 React 的提交过程打架。** 我原本用 `useState` 在 `onCreated` 里控制 canvas 淡入，结果 canvas 恒定在 `opacity: 0` —— 状态更新被对账器的提交时机吃掉了。改成用 ref 拿到 canvas 元素、在 `useEffect` + `requestAnimationFrame` 里直接写样式才稳定。
4. **`import` 写错位置会让代码分割失效。** `App.tsx` 一开始静态 import 了重模块，Vite 直接报 `INEFFECTIVE_DYNAMIC_IMPORT`，首屏包 1151 kB。拆成「薄加载器 + 动态 import 重模块」后降到 235 kB。
5. **截图验证本身也会骗人。** 用 CDP 模拟 390px 时只设了 `mobile: true`，页面因为没配全，`innerWidth` 实际是 1560——我一度以为「移动端断点没生效」。必须同时设 `screenWidth/screenHeight` 与触摸模拟。
6. **重写组件时丢了东西。** 我把移动端菜单按钮在改写 `App.tsx` 时漏掉了，是截图里「600px 宽没有汉堡按钮」才暴露出来——现在已恢复并带完整 aria 属性。

---

## 四、构建产物

```
dist/index.html                          0.90 kB │ gzip:   0.53 kB
dist/assets/index-*.css                 22.09 kB │ gzip:   8.25 kB
dist/assets/index-*.js                 235.48 kB │ gzip:  74.57 kB   ← 首屏
dist/assets/HeroScene-*.js             916.86 kB │ gzip: 243.72 kB   ← 懒加载，首屏不下载
dist/assets/*.woff2                     93 kB（其中 latin 子集仅 48 kB）
```

首屏 JS 约 **75 kB gzip**；3D 的 244 kB 只在浏览器空闲、且用户未开启「减弱动效」时才拉取。

---

## 五、更新后的「还没做」清单

1. **作品链接还是 `#contact` 占位**，三个项目没有真实案例页或仓库地址。
2. **`hello@example.com` 是占位邮箱。**
3. **依赖仍写 `"latest"`**（`package.json:13-21`）。能用，但任何一次 install 都可能把大版本推上去，建议钉成具体区间。
4. **没有交互式对比度审计工具跑过**，当前对比度是按字号手工核算的。
5. **`prefers-reduced-motion` 下 3D 完全不加载**——如果你希望这类访客仍看到一个静态渲染帧，需要额外导出一张图。
6. 作品区目前是**纵向列表**；如果项目变多，可以考虑粘性横向滚动。
