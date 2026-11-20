# AGENTS.md

本项目是基于 Axure11 导出的 SaaS A 端后台静态原型，部署到 GitHub Pages。保持 Axure 目录、运行时和页面导航，不改造成现代前端工程。

## 子代理协作

- 有两个及以上相互独立、可单独验收且没有文件或共享状态冲突的子任务时，主代理应尽量并行派发；存在依赖、共享写入或并行成本明显更高时，按依赖串行处理。复杂架构和关键决策由主代理负责。
- 子代理统一使用 gpt-6.1-sol。主代理根据任务复杂度选择推理等级：简单任务用低等级，常规任务用中等级，复杂或关键任务用高等级；拿不准时上调。
- 派发时说明目标、读写范围和文件归属、依赖与汇合点、禁止事项、验收及验证方式。子代理先读本端规则，只在授权范围内工作；遇到范围外事项或需要决策时报告 ESCALATE 并暂停相关工作，不得自行派生子代理。
- 主代理负责调度、冲突整合和最终审阅验证；并发数量服从运行环境限制。本端独立使用时本节直接生效，跨端任务遵守根目录规则并先确认工作区权限。
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
