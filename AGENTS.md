# AGENTS.md

本项目是 SaaS 系统 A 端后台原型，基于 Axure11 导出的静态 HTML 维护并部署到 GitHub Pages。维护时保持 Axure11 原有目录、运行时和页面导航逻辑，不要改造成现代前端工程。

## 硬性规则

- 使用原生 HTML、CSS、JS；页面之间使用相对路径。
- 不引入 React、Vue、Angular、NextJS、Vite、Webpack、npm 工程化、TypeScript 工程化或 SPA 路由。
- 不修改 `resources/`、Axure runtime 核心 JS、Axure 原有页面逻辑和原有 CSS，除非用户明确要求。
- 允许新增独立页面、CSS、JS、assets，以及必要的 `data/document.js` sitemap 菜单入口。
- 读写中文文件名或中文内容的 HTML、CSS、JS、Markdown、Axure data 文件时必须使用 UTF-8；PowerShell 读取显式加 `-Encoding UTF8`，避免乱码。

## 新增页面规则

新增页面必须是独立静态 HTML，推荐结构：

```text
/页面名称.html
/custom/css/页面英文名.css
/custom/js/页面英文名.js
/files/页面名称/data.js
```

每个页面应可单独打开，也能从 `index.html` 菜单打开。HTML 必须引用：

```html
<script src="data/document.js"></script>
<script src="files/页面名称/data.js"></script>
```

`body` 必须带 `data-axure-page-id="page_id"`；`files/页面名称/data.js` 必须调用 `$axure.loadCurrentPage(...)`，否则 Axure 菜单打开时右侧 `mainFrame` 可能空白。

## sitemap 规则

需要进入左上角页面目录菜单时，修改 `data/document.js`，并确认：

- 页面 id 唯一。
- 页面名称正确。
- URL 与真实 HTML 文件名完全一致，并使用相对路径，例如 `平台收入总览.html`。
- 页面放在正确业务菜单下。
- 修改后执行语法检查和 sitemap 解析验证，确认 Axure 实际能读取目标节点。

页面归属：

- `财务中心`：对账、结算、平台收入、厂商费用、商户账单、人工加扣款、实际收款、成本、利润相关页面。
- `数据中心`：商户数据、运营数据、趋势分析、会员活跃、投注、充值、提款等经营统计，以及不直接作为结算依据的统计页面。

## UI 与报表

- 默认风格：SaaS A 端运营后台，白色科技感、数据密度高、低饱和蓝、清晰层级、圆角适中、轻微阴影，PC 优先并兼顾响应式。
- 避免：营销落地页、夸张渐变、大面积霓虹、过度动画、过度留白、卡片套卡片、字段堆满导致表格不可读。
- 报表字段按决策价值组织：核心指标、辅助指标、资金参考、流程状态，不要简单堆字段。
- `商户充值(U)` 可作为资金流入参考，`商户可用余额` 可作为资金占用参考，默认不计入平台收入。
- `平台实际收益` 必须保持清晰、独立的财务口径；说明文字用明显说明样式，不伪装成业务数据。
- 财务状态如待确认、已确认、已结算放在表格靠后并支持筛选，不放入核心金额指标卡。

## 验证规则

每次修改后至少执行相关语法检查：

```text
node --check data/document.js
node --check files/页面名称/data.js
node --check custom/js/页面英文名.js
```

只检查实际存在或本次修改相关的 JS 文件。修改菜单时必须解析 `data/document.js` 验证 sitemap 目标节点。页面支持导出时，还要验证当前视图导出、空筛选导出、筛选后导出。

## GitHub Pages

页面上线后没更新时，优先排查提交文件是否完整、发布分支和目录是否正确、浏览器或 GitHub Pages CDN 缓存、中文文件名大小写和 URL 是否完全一致。

## 输出要求

交付说明保持简洁，只说明本次实际改动和关键验证结果。不固定逐项列出页面路径、文件、导航、`files/页面名称/data.js`、`index.html` 菜单验证、GitHub Pages 注意点；只有对当前问题有实际帮助或用户明确要求时再说明。
