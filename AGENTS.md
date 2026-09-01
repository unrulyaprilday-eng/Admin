# AGENTS.md

本项目是基于 Axure11 导出的 SaaS A 端后台静态原型，部署到 GitHub Pages。保持 Axure 目录、运行时和页面导航，不改造成现代前端工程。

## 子代理级别与调用

- 主代理负责复杂思考、任务拆分、调度、依赖排序、文件所有权、冲突整合、审核和最终验收；复杂架构判断留在主会话。子代理仅执行父代理明确分配的独立、可验收任务，不自行扩大范围、拍板或创建/派生子代理。
- 默认路由：只读信息收集优先 `Luna Max`，不可用或同一会话连续失败 2 次后改用 `Terra High`；代码/文档编辑和独立审计使用 `Terra XHigh`，不得静默降级。其他任务选择能可靠完成的最低级别，不确定时上调一级。低到高：`Luna Max`（简单隔离/UI/CRUD/测试/文档）；`Terra High`（常规开发/bug/集成/中等重构）；`Terra Max`（中大型/跨模块/难 bug）；`Sol High`（重要功能/复杂业务/较大重构）；`Sol XHigh`（复杂架构/关键跨模块/困难调试）；`Sol Max`（关键架构/安全/支付钱包/数据库迁移/极端调试）。
- 每次派发注明目标、允许读写范围、禁止项、验收标准、验证方式及是否允许修改；未声明时不得修改。子代理先读项目和本端 `AGENTS.md`、检查现有代码，限范围修改，按规则验证并回报改动/验证结果/风险/未决项；遇到推理、方案权衡、参数或目标选择、范围变化及未授权的额外工作，立即报 `ESCALATE` 并停止，由主代理决定。
- 最多 5 个并发且服从实际并发槽位。只要任务能够拆分为独立、可验收且文件职责不冲突的子任务，主代理应默认主动拆分并启动多个子代理并行处理；并行启动是默认工作方式，而非仅在需要时才采用。受实际槽位、任务依赖或同一文件写入约束时，按可用槽位尽量并行，其余任务依赖完成后再串行；同一文件或存在依赖的步骤必须串行。审计须在相关编辑完成后基于最终文件执行。主代理负责整合、冲突处理和最终验证。本端作为独立项目打开时，本节直接生效；跨端访问先确认工作区权限。

## 硬性规则

- 只用原生 HTML、CSS、JS 和 Axure 页面壳；页面与资源使用相对路径。
- 不引入 React、Vue、Angular、NextJS、Vite、Webpack、npm、TypeScript 工程化或 SPA 路由。
- 不修改 `resources/`、Axure runtime 核心 JS、原有页面逻辑和全局 CSS，除非用户明确要求。
- 可新增独立页面、CSS、JS、assets 及必要的 `data/document.js` 菜单入口；公共自定义资产放 `custom/`、`custom/css/`、`custom/js/`、`custom/assets/`。
- AI 新增且要进 Axure 菜单的 HTML 默认放项目根目录，不放 `custom/pages/`；不依赖绝对路径、构建命令或外部网络资源。
- 中文文件名/内容使用 UTF-8；PowerShell 读取中文显式加 `-Encoding UTF8`。不运行会改写大量无关文件的格式化、构建或迁移命令。

## 新增页面

先找相近页面，复用其 Axure 壳、布局密度、字段口径和交互方式。推荐结构：

```text
/页面名称.html
/custom/css/页面英文名.css
/custom/js/页面英文名.js
/files/页面名称/data.js
/files/页面名称/styles.css
```

HTML 必须可单独打开并可由 `index.html` 菜单打开，引用以下资源：

```text
resources/css/axure_rp_page.css
data/styles.css
files/页面名称/styles.css
custom/css/页面英文名.css
data/document.js
files/页面名称/data.js
custom/js/axure-custom-page-ready.js
resources/scripts/axure/ios.js
```

另有独立交互 JS 时再引用 `custom/js/页面英文名.js`。页面还必须满足：

- `body` 带 `data-axure-page-id`，且与 `files/页面名称/data.js` 的 `page.packageId` 一致。
- 页面内容是真实后台操作界面，不做营销落地页；`#base` 保持 Axure 空容器，自定义布局放其内部容器。
- JS 渲染表格、Tab、弹窗或编辑态时，HTML 先提供首屏静态内容/空态；JS 等 DOM 就绪并保护关键 DOM。
- `files/页面名称/data.js` 调用 `$axure.loadCurrentPage(...)`，至少保证 `url`、`page.packageId`、`page.name`、`variables`、`diagram.objects` 正确；`styles.css` 即使为空也必须存在并被引用。

## 菜单、快照与归属

- sitemap 只改 `data/document.js` 的 `sitemap.rootNodes`，保留 `$axure.loadDocument(...)` 外壳；页面 id 唯一，`pageName`/`url` 与文件一致，节点放正确业务菜单，不为菜单移动 HTML。
- 优先用 Node 解析对象后修改回写；按稳定 id 查父级和重复节点，只插入/覆盖目标节点，不重建同级节点。写入后校验 sitemap id、`packageId`、`url`、`page.name` 和文件存在。
- 中文校验用稳定 id/url 或 Unicode 转义，避免把中文直接塞进 PowerShell 长 `node -e`。不要重复打印整棵 sitemap。
- 菜单基准为 `scripts/ai-menu-snapshot.json`；恢复脚本为 `restore-ai-menu.cmd` / `scripts/restore-ai-menu.js`。Axure 重新导出后执行 `.\restore-ai-menu.cmd`；确认结构正确后才执行 `.\restore-ai-menu.cmd save`。
- 恢复保留快照中没有的新导出节点；调整目录或新增 AI 节点后更新快照，新增 id 必须唯一。中文码点异常时先修复文件，不保存 `????` 快照。
- 页面归属：`财务中心`放对账、结算、收入、费用、账单、加扣款、收款、成本、利润；`数据中心`放商户/运营/趋势、活跃、投注、充值、提款等非结算统计。

## A 端页面风格

- 白色科技感、低饱和蓝、圆角通常不超过 8px；高信息密度、清晰层级、紧凑可读。
- 优先筛选区、工具栏、表格、状态标签、分页、行内操作；配置/报表/管理流程用表格和弹窗承载，默认数据完整。
- 避免营销 Hero、过度渐变/动画/插画/留白、霓虹风、卡片套卡片；行内修改默认用弹窗，不无需求添加顶部“保存/操作日志”。
- 弹窗包含标题、关闭、表单、取消/确定；遮罩默认 `hidden`，自定义 CSS 必须有 `[hidden] { display: none !important; }`。

## 报表与业务口径

- 字段按决策价值分核心指标、辅助指标、资金参考、流程状态；金额/数量/状态稳定列宽和对齐，大表格允许横向滚动。
- 财务状态靠后并可筛选，不放核心金额卡；站点列表以筛选和明细表为主，不虚构站点统计卡。
- 操作型报表提供筛选、重置、导出、分页、详情/确认；字段、公式、状态以用户说明和参考页面为准，说明文字不可伪装成数据。

## 编码与验证

- 中文显示为 `?` 不等于损坏；若实际码点为 `0x3f`，先从备份、快照或 Git 对象恢复。写入中文 HTML、`data/document.js` 或页面 data 后做码点检查。
- 不用 PowerShell here-string/长 `node -e` 传递中文、`$axure` 或多层引号；优先 `apply_patch` 或固定 `scripts/*.js`，脚本内部用 Unicode 转义。
- 默认只做相关静态检查，不做浏览器预览、截图或 Playwright，除非用户明确要求。相关 JS 执行 `node --check`；改菜单时解析 `$axure.loadDocument(...)`，检查目标 id、`pageName`、`url`、归属和文件。
- 页面靠 JS 显示数据/Tab 时确认 HTML 有兜底内容、ready 初始化和关键 DOM 保护；导出页按需验证当前视图、空筛选和筛选后导出。

## 输出

只说明实际改动和关键验证结果；页面发布异常优先排查提交文件、发布分支、缓存、中文文件名大小写和 URL；默认不输出 git 信息。
