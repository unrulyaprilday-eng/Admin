# AGENTS.md

本项目是 SaaS 系统 A 端后台原型，基于 Axure11 导出的静态 HTML 维护并部署到 GitHub Pages。维护时必须保持 Axure11 原有目录、运行时和页面导航逻辑，不要改造成现代前端工程。

## 硬性规则

- 使用原生 HTML、CSS、JS；页面之间使用相对路径。
- 不引入 React、Vue、Angular、NextJS、Vite、Webpack、npm 工程化、TypeScript 工程化或 SPA 路由。
- 不修改 `resources/`、Axure runtime 核心 JS、Axure 原有页面逻辑和原有 CSS，除非用户明确要求。
- 允许新增独立页面、CSS、JS、assets，以及必要的 `data/document.js` sitemap 菜单入口。
- 读写中文文件名或中文内容的 HTML、CSS、JS、Markdown、Axure data 文件时必须使用 UTF-8；PowerShell 读取显式加 `-Encoding UTF8`。
- 不要用会改写大量无关文件的格式化、构建或迁移命令；本项目不是现代前端工程。

## 新增页面流程

新增页面前先查找相近页面，优先复用现有轻量静态页面模式、布局密度、字段口径和交互方式。新增报表类页面时，先参考同类页面的根 HTML、对应 `custom/css/*.css`、`custom/js/*.js`、`files/页面名称/data.js`。

新增页面推荐结构：

```text
/页面名称.html
/custom/css/页面英文名.css
/custom/js/页面英文名.js
/files/页面名称/data.js
```

每个页面必须可单独打开，也能从 `index.html` 菜单打开。HTML 必须引用：

```html
<script src="data/document.js"></script>
<script src="files/页面名称/data.js"></script>
```

HTML 页面还必须满足：

- `body` 带 `data-axure-page-id="page_id"`。
- 页面 id 与 `files/页面名称/data.js` 的 `packageId` 一致。
- 引用自有 CSS、JS 时放在 `custom/css/`、`custom/js/`，不要污染 Axure 原文件。
- 页面内容以真实后台操作界面为主，不做营销落地页。

`files/页面名称/data.js` 必须调用 `$axure.loadCurrentPage(...)`，且至少包含正确的：

- `url`：与真实 HTML 文件名完全一致。
- `page.packageId`：与 HTML `data-axure-page-id` 一致。
- `page.name`：与菜单页面名称一致。

否则从 Axure 菜单打开时右侧 `mainFrame` 可能空白。

## sitemap 规则

需要进入左上角页面目录菜单时，修改 `data/document.js`，并确认：

- 页面 id 唯一。
- 页面名称正确。
- URL 与真实 HTML 文件名完全一致，并使用相对路径。
- 页面放在正确业务菜单下。
- 修改后执行语法检查和 sitemap 解析验证，确认 Axure 实际能读取目标节点。

`data/document.js` 可能是 Axure 压缩变量文件，也可能被改写成普通 `$axure.loadDocument({...})` 文件。修改 sitemap 时优先用 Node 解析 `$axure.loadDocument` 得到对象后再修改对象并回写，避免在压缩长行里手工拼接。

处理中文页面名时，避免在 PowerShell heredoc 传给 Node 的脚本里直接写中文断言或中文对象字面量；这可能因控制台编码导致脚本内中文字面量变成乱码。推荐做法：

- 用稳定的页面 id 定位菜单节点，避免依赖中文菜单名。
- Node 脚本中新增中文字符串时可使用 Unicode 转义，例如 `\u5546\u6237\u8d26\u5355\u7a3d\u6838`。
- sitemap 验证脚本里的中文断言也使用 Unicode 转义，或只断言 id/url 后输出解析结果。
- 不要因为验证脚本中文字面量乱码而误判 `data/document.js` 内容错误；先确认实际解析出的节点值。

页面归属：

- `财务中心`：对账、结算、收入、费用、账单、人工加扣款、实际收款、成本、利润相关页面。
- `数据中心`：商户数据、运营数据、趋势分析、会员活跃、投注、充值、提款等经营统计，以及不直接作为结算依据的统计页面。

## UI 与报表

- 默认风格：SaaS A 端运营后台，白色科技感、数据密度高、低饱和蓝、清晰层级、圆角适中、轻微阴影，PC 优先并兼顾响应式。
- 避免：营销落地页、夸张渐变、大面积霓虹、过度动画、过度留白、卡片套卡片、字段堆满导致表格不可读。
- 报表字段按决策价值组织：核心指标、辅助指标、资金参考、流程状态，不要简单堆字段。
- 金额、数量、状态字段要有稳定列宽和清晰对齐；大表格优先横向滚动，避免压缩到不可读。
- 财务流程状态放在表格靠后并支持筛选，不放入核心金额指标卡。
- 站点列表类页面以筛选和明细表为主，不放“站点总数、正常站点、维护中、停用站点”等状态统计卡片。
- 操作型报表应提供必要的筛选、重置、导出、分页、详情或确认操作；只是静态展示时也要让原型表达清楚业务流。

## 业务口径

- 具体业务字段、统计公式、状态流转以用户本次说明和现有参考页面为准，不把单个页面的业务细节固化成通用规则。
- 报表内不同口径的数据要用标题、分组或说明文字区分清楚，避免把参考指标、结算指标和流程状态混在一起。
- 说明文字应使用明显的说明样式，不伪装成业务数据。

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

## GitHub Pages

页面上线后没更新时，优先排查提交文件是否完整、发布分支和目录是否正确、浏览器或 GitHub Pages CDN 缓存、中文文件名大小写和 URL 是否完全一致。

## 输出要求

交付说明保持简洁，只说明本次实际改动和关键验证结果。不固定逐项列出页面路径、文件、导航、`files/页面名称/data.js`、`index.html` 菜单验证、GitHub Pages 注意点；只有对当前问题有实际帮助或用户明确要求时再说明。

默认不输出 git 信息、git diff、git status 或提交相关说明，除非用户明确要求。

如果过程中遇到工具环境问题，例如 `git` 不可用、PowerShell 中文字面量乱码、验证脚本自身失败，要简短说明原因和最终采用的替代验证方式。
