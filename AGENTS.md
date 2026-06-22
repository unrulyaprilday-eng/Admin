# AGENTS.md

本项目是 SaaS 系统 A 端后台原型，基于 Axure11 导出的静态 HTML 维护并部署到 GitHub Pages。维护时必须保持 Axure11 原有目录、运行时和页面导航逻辑，不要改造成现代前端工程。

## 硬性规则

- 使用原生 HTML、CSS、JS；页面之间使用相对路径。
- 不引入 React、Vue、Angular、NextJS、Vite、Webpack、npm 工程化、TypeScript 工程化或 SPA 路由。
- 不修改 `resources/`、Axure runtime 核心 JS、Axure 原有页面逻辑和原有 CSS，除非用户明确要求。
- 允许新增独立页面、CSS、JS、assets，以及必要的 `data/document.js` sitemap 菜单入口。
- 公共自定义资产放在 `custom/`、`custom/css/`、`custom/js/`、`custom/assets/`，不要混入 Axure runtime 目录。
- AI 新增且要进入 Axure 菜单的 HTML 默认放项目根目录，不要默认放入 `custom/pages/`，否则左上角菜单可能无法识别。
- 读写中文文件名或中文内容的 HTML、CSS、JS、Markdown、Axure data 文件时必须使用 UTF-8；PowerShell 读取显式加 `-Encoding UTF8`。
- 不要用会改写大量无关文件的格式化、构建或迁移命令；本项目不是现代前端工程。
- 不依赖本地绝对路径、构建命令或外部网络资源作为页面必要能力。

## 新增页面流程

新增页面前先查找相近页面，优先复用现有轻量静态页面模式、布局密度、字段口径和交互方式。新增报表类页面时，先参考同类页面的根 HTML、对应 `custom/css/*.css`、`custom/js/*.js`、`files/页面名称/data.js`。

新增页面推荐结构：

```text
/页面名称.html
/custom/css/页面英文名.css
/custom/js/页面英文名.js
/files/页面名称/data.js
/files/页面名称/styles.css
```

每个页面必须可单独打开，也能从 `index.html` 菜单打开。HTML 必须引用：

```html
<link href="resources/css/axure_rp_page.css" rel="stylesheet">
<link href="data/styles.css" rel="stylesheet">
<link href="files/页面名称/styles.css" rel="stylesheet">
<link href="custom/css/页面英文名.css" rel="stylesheet">
<script src="data/document.js"></script>
<script src="files/页面名称/data.js"></script>
<script src="custom/js/axure-custom-page-ready.js"></script>
<script src="resources/scripts/axure/ios.js"></script>
```

HTML 页面还必须满足：

- `body` 带 `data-axure-page-id="page_id"`。
- 页面 id 与 `files/页面名称/data.js` 的 `packageId` 一致。
- 引用自有 CSS、JS 时放在 `custom/css/`、`custom/js/`，不要污染 Axure 原文件。
- 页面内容以真实后台操作界面为主，不做营销落地页。
- `#base` 保持 Axure 标准空容器，自定义布局、背景、grid/flex、`min-height: 100vh` 等样式放在 `#base` 内部容器上，不直接作用于 `#base`。
- 如依赖自定义 JS 渲染表格、Tab、弹窗或编辑态，HTML 中先放可展示的首屏静态内容或兜底空态，不能只留空容器等待 JS 渲染。
- 自定义 JS 必须等 DOM 就绪后再查询元素和绑定事件，并对关键 DOM 做空值保护，避免一个元素缺失导致整页交互失效。

`files/页面名称/data.js` 必须调用 `$axure.loadCurrentPage(...)`，且至少包含正确的：

- `url`：与真实 HTML 文件名完全一致。
- `page.packageId`：与 HTML `data-axure-page-id` 一致。
- `page.name`：与菜单页面名称一致。
- 保留 Axure 常用 `variables`。
- `diagram.objects` 至少为空数组。

`files/页面名称/styles.css` 可以为空，但必须存在并被 HTML 引用。

否则从 Axure 菜单打开时右侧 `mainFrame` 可能空白。

## sitemap 规则

需要进入左上角页面目录菜单时，修改 `data/document.js`，并确认：

- 页面 id 唯一。
- 页面名称正确。
- URL 与真实 HTML 文件名完全一致，并使用相对路径。
- 页面放在正确业务菜单下。
- 修改后执行语法检查和 sitemap 解析验证，确认 Axure 实际能读取目标节点。
- 修改菜单只改 `data/document.js` 的 `sitemap.rootNodes`，保留 `$axure.loadDocument(...)` 外壳。
- 复用已有菜单节点时保留原 `id / pageName / url / children`，不要无故重建节点。
- 不为了菜单目录调整而移动 HTML 文件位置，除非用户明确要求。

`data/document.js` 可能是 Axure 压缩变量文件，也可能被改写成普通 `$axure.loadDocument({...})` 文件。修改 sitemap 时优先用 Node 解析 `$axure.loadDocument` 得到对象后再修改对象并回写，避免在压缩长行里手工拼接。

处理中文页面名时，避免在 PowerShell heredoc 传给 Node 的脚本里直接写中文断言或中文对象字面量；这可能因控制台编码导致脚本内中文字面量变成乱码。推荐做法：

- 用稳定的页面 id 定位菜单节点，避免依赖中文菜单名。
- Node 脚本中新增中文字符串时可使用 Unicode 转义，例如 `\u5546\u6237\u8d26\u5355\u7a3d\u6838`。
- sitemap 验证脚本里的中文断言也使用 Unicode 转义，或只断言 id/url 后输出解析结果。
- 不要因为验证脚本中文字面量乱码而误判 `data/document.js` 内容错误；先确认实际解析出的节点值。
- 已知父级中文名时，优先按截图/面包屑推断父级，再用一次 `data/document.js` 解析确认；不要反复全局搜索和打印大段菜单。
- 新增节点只做“查父级、查是否已有同 id/pageName/url、插入或覆盖该节点”三步，不重建同级节点。
- 打印菜单校验时只输出目标父级的 `id/pageName/url` 三列，避免输出完整 `document.js` 或整棵 sitemap。
- 写入后立即校验：菜单节点 `id`、页面 `data.js` 的 `page.packageId`、页面 `url`、页面 `name` 四项必须一致。

## 菜单与快照

当前菜单基准保存在：

```text
scripts/ai-menu-snapshot.json
```

恢复脚本：

```text
restore-ai-menu.cmd
scripts/restore-ai-menu.js
```

Axure 重新导出后，执行一条命令恢复菜单：

```powershell
.\restore-ai-menu.cmd
```

当用户确认当前菜单结构已经调整正确，并希望作为以后恢复基准时，保存新快照：

```powershell
.\restore-ai-menu.cmd save
```

菜单恢复规则：

- 默认按 `scripts/ai-menu-snapshot.json` 恢复菜单结构。
- 恢复时保留 Axure 新导出的、快照里没有的菜单节点。
- 调整目录结构或移动菜单节点后，必须执行 `.\restore-ai-menu.cmd save` 更新快照。
- 新增 AI 页面菜单节点时，新增页面 `data.js` 的 `page.packageId` 必须与 sitemap 节点 `id` 一致。
- AI 新增节点的 `id` 应唯一；移动或复用已有节点时保留原 `id`。
- `.\restore-ai-menu.cmd save` 只能在菜单中文码点确认正常后执行；如果误保存了 `????` 快照，修复 `data/document.js` 后必须重新 save。

手动调整 sitemap 时：

- 先解析 `data/document.js` 得到真实 `sitemap.rootNodes`，不要直接手改 Axure 压缩变量表。
- 如果 `data/document.js` 是 `$axure.loadDocument((function(){...})())` 形式，可用 Node 临时提供 `$axure.loadDocument = d => doc = d` 读取对象。
- 写回时保留 `$axure.loadDocument(...)` 外壳，可以写成格式化 JSON，便于后续维护。
- 重排后检查顶层顺序、关键子级归属、页面 `url` 和文件是否存在。

页面归属：

- `财务中心`：对账、结算、收入、费用、账单、人工加扣款、实际收款、成本、利润相关页面。
- `数据中心`：商户数据、运营数据、趋势分析、会员活跃、投注、充值、提款等经营统计，以及不直接作为结算依据的统计页面。

## A 端 SaaS 页面风格

优先使用：

- 现代后台 UI，白色科技感，低饱和蓝，适中圆角，通常不超过 8px。
- 高信息密度、清晰层级、紧凑但可读的布局。
- 筛选区、操作按钮、数据表格、状态标签、分页、行内操作。
- 配置页、报表页、管理页优先用表格和弹窗承载流程。
- 默认数据要完整，方便静态原型直接演示。
- A 端以平台、总台、供应商、商户、站点、财务、游戏厂商等管理任务为主，表达平台侧管控、审核、配置和统计能力。

避免使用：

- 营销页 Hero、过度渐变、夸张动画、大面积插画、低端霓虹风、过度留白。
- 页面顶部无需求的“保存”或“操作日志”按钮。
- 行内“修改”跳转页面；默认使用弹窗，除非用户明确要求跳转。
- 卡片套卡片、字段堆满导致表格不可读。

弹窗统一包含：

- 标题栏。
- 右上角关闭。
- 中间表单。
- 底部按钮：取消、确定。
- 遮罩默认使用 `hidden` 关闭态。
- 自定义 CSS 必须包含 `[hidden] { display: none !important; }`。

## UI 与报表

- 默认风格：SaaS A 端运营后台，白色科技感、数据密度高、低饱和蓝、清晰层级、圆角适中、轻微阴影，PC 优先并兼顾响应式。
- 报表字段按决策价值组织：核心指标、辅助指标、资金参考、流程状态，不要简单堆字段。
- 金额、数量、状态字段要有稳定列宽和清晰对齐；大表格优先横向滚动，避免压缩到不可读。
- 财务流程状态放在表格靠后并支持筛选，不放入核心金额指标卡。
- 站点列表类页面以筛选和明细表为主，不放“站点总数、正常站点、维护中、停用站点”等状态统计卡片。
- 操作型报表应提供必要的筛选、重置、导出、分页、详情或确认操作；只是静态展示时也要让原型表达清楚业务流。

## 业务口径

- 具体业务字段、统计公式、状态流转以用户本次说明和现有参考页面为准，不把单个页面的业务细节固化成通用规则。
- 报表内不同口径的数据要用标题、分组或说明文字区分清楚，避免把参考指标、结算指标和流程状态混在一起。
- 说明文字应使用明显的说明样式，不伪装成业务数据。

## 编码与 Windows 注意事项

- 控制台显示中文为 `?` 不一定代表文件损坏；必须检查文件实际内容或字符码点。
- 若码点是 `0x3f`，说明中文已经真实损坏，需要从备份或 Git 对象恢复。
- 写入 `data/document.js`、页面 `data.js` 或中文 HTML 后，至少做一次中文关键字/码点验证。
- 不要把包含中文字符串的长脚本通过 PowerShell here-string 管道传给 Node/Python 后直接写入项目文件。
- 不要在 PowerShell 双引号命令中直接写未转义的 `$axure`，否则可能被展开成空字符串并写坏 `data/document.js` 外壳。
- 需要写中文内容时，优先使用 `apply_patch`；脚本写入时使用 Unicode 转义字符串生成 UTF-8。
- 不假设系统一定存在 `git` 命令；需要恢复文件时优先用可用 Git 工具，必要时再从 `.git` 对象库读取。
- 创建中文命名页面文件本身优先用 `apply_patch`，不要用 PowerShell/Node 脚本批量写中文文件名。

## 验证规则

默认只做静态验证，不做浏览器预览、截图、Playwright 或视觉自动化验证，除非用户明确要求。验证以低 token 消耗为原则，只运行与本次改动直接相关的简单命令，并在交付说明中简短列出结果。

每次修改后至少执行相关语法检查：

```text
node --check data/document.js
node --check files/页面名称/data.js
node --check custom/js/页面英文名.js
```

只检查实际存在或本次修改相关的 JS 文件。修改菜单时必须解析 `data/document.js` 验证 sitemap 目标节点，至少确认：

- 能成功执行 `$axure.loadDocument(...)`。
- 能找到新增页面 id。
- `pageName`、`url` 与真实页面一致。
- 目标节点位于正确业务菜单下。

页面支持导出时，还要验证：

- 当前视图导出。
- 空筛选导出。
- 筛选后导出。

如果验证命令失败，要区分是产品文件失败还是验证脚本自身编码/断言失败。遇到 PowerShell 中文乱码时，改用 Unicode 转义后重跑，不要留下失败验证作为最终结果。

检查保持简单，不要求每次都做完整浏览器预览；但如果页面靠 JS 才能显示数据或切换 Tab，至少要确认 HTML 有兜底内容，JS 不会在 DOM 未生成时提前绑定失败。避免重复打印完整 `data/document.js` 或做无关的全项目扫描。

## GitHub Pages

页面上线后没更新时，优先排查提交文件是否完整、发布分支和目录是否正确、浏览器或 GitHub Pages CDN 缓存、中文文件名大小写和 URL 是否完全一致。

## 输出要求

交付说明保持简洁，只说明本次实际改动和关键验证结果。不固定逐项列出页面路径、文件、导航、`files/页面名称/data.js`、`index.html` 菜单验证、GitHub Pages 注意点；只有对当前问题有实际帮助或用户明确要求时再说明。

默认不输出 git 信息、git diff、git status 或提交相关说明，除非用户明确要求。

如果过程中遇到工具环境问题，例如 `git` 不可用、PowerShell 中文字面量乱码、验证脚本自身失败，要简短说明原因和最终采用的替代验证方式。
