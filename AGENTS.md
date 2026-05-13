# AGENTS.md

本项目是 SaaS 系统 A 端后台原型，基于 Axure11 导出的静态 HTML 页面维护，并部署到 GitHub Pages。

AI 维护本项目时，必须保持 Axure11 静态原型结构，不要重构为现代前端工程。

## 项目硬性规则

- 保持 Axure11 原有目录结构和页面导航逻辑。
- 新页面必须是独立静态 HTML 页面。
- 默认使用原生 HTML、CSS、JS。
- 页面之间使用相对路径。
- 不引入 React、Vue、Angular、NextJS、Vite、Webpack、npm 工程化、TypeScript 工程化或 SPA 路由。
- 不修改 `resources/` Axure 内核资源。
- 不改写 Axure runtime 核心 JS。
- 不修改 Axure 原有页面逻辑和原有 CSS，除非用户明确要求。
- 允许新增页面、CSS、JS、assets，以及必要的 sitemap 菜单入口。

## 新页面文件规则

新增页面推荐结构：

```text
/页面名称.html
/custom/css/页面英文名.css
/custom/js/页面英文名.js
/files/页面名称/data.js
```

每个页面应独立、可替换、可复制、可单独维护，避免全局强耦合。

## Axure 菜单兼容规则

新增页面必须同时满足“单独打开正常”和“从 `index.html` 菜单打开正常”。

HTML 中必须引用：

```html
<script src="data/document.js"></script>
<script src="files/页面名称/data.js"></script>
```

`body` 必须带页面 id：

```html
<body data-axure-page-id="page_id">
```

必须创建：

```text
/files/页面名称/data.js
```

页面 data 文件必须调用：

```js
$axure.loadCurrentPage(...)
```

否则会出现：单独打开 HTML 正常，但从 `index.html` 的 Axure 菜单打开时右侧 mainFrame 空白。

## sitemap 接入规则

需要进入左上角页面目录菜单的页面，必须修改：

```text
/data/document.js
```

新增入口时必须确认：

- 页面 id 唯一。
- 页面名称正确。
- URL 与真实 HTML 文件名完全一致。
- URL 使用相对路径，例如 `平台收入总览.html`。
- 页面放在正确业务菜单下。
- 修改后 sitemap 能被 Axure 实际读取。

修改 `data/document.js` 后必须执行语法检查和 sitemap 解析验证，不能只看文本是否出现。

## 页面归属规则

本项目是 SaaS A 端后台，页面应按业务场景归类。

放在 `财务中心`：

- 对账
- 结算
- 平台收入
- 厂商费用
- 商户账单
- 人工加扣款
- 与实际收款、成本、利润相关的页面

放在 `数据中心`：

- 商户数据
- 运营数据
- 趋势分析
- 会员活跃
- 投注、充值、提款等经营统计
- 不直接作为结算依据的统计页面

示例：

- `游戏厂商对账表.html` 放在财务中心。
- `平台收入总览.html` 放在财务中心。
- `商户数据.html` 放在数据中心。
- `商户数据汇总.html` 放在数据中心。

## UI 风格规则

默认风格是 SaaS A 端运营后台。

优先：

- 白色科技感
- 数据密度高
- 卡片式信息分组
- 低饱和蓝
- 清晰信息层级
- 圆角适中
- 轻微阴影或微发光
- PC 优先，兼顾响应式

避免：

- 营销落地页风格
- 夸张渐变
- 大面积霓虹
- 过度动画
- 过度留白
- 卡片套卡片
- 字段堆满导致表格不可读

## 报表设计规则

报表字段必须按 A 端实际决策价值整理，不要简单堆字段。

字段优先级：

- 核心指标：直接影响经营、财务、结算判断。
- 辅助指标：用于解释核心指标。
- 资金参考：不参与当前收入计算，但影响财务理解。
- 流程状态：确认、结算、冻结等。

说明：

- `商户充值(U)` 可作为资金流入参考。
- `商户可用余额` 可作为资金占用参考。
- 两者默认不计入平台收入。
- `平台实际收益` 必须保持清晰、独立的财务口径。
- 说明性文字要以明显的说明样式呈现，不要伪装成业务数据。

财务类页面通常保留状态字段，例如：

- 待确认
- 已确认
- 已结算

状态字段放在表格靠后位置，并支持筛选，不放在核心金额指标卡中。

## 新增页面必做清单

新增页面时必须完成：

- 创建 `页面名称.html`。
- 创建 `custom/css/页面英文名.css`。
- 如有交互，创建 `custom/js/页面英文名.js`。
- 创建 `files/页面名称/data.js`。
- HTML 引用 `data/document.js`。
- HTML 引用自己的 `files/页面名称/data.js`。
- HTML 设置 `data-axure-page-id`。
- `data/document.js` 新增 sitemap 菜单入口。
- 菜单 URL 与真实文件名完全一致。
- 单独打开页面正常。
- 从 `index.html` 菜单打开页面正常。

## 验证规则

每次修改后至少执行：

```text
node --check data/document.js
node --check files/页面名称/data.js
node --check custom/js/页面英文名.js
```

如果修改了菜单，还必须解析 `data/document.js`，确认 sitemap 中实际存在目标节点。

如果页面支持导出，还要验证：

- 当前视图导出
- 空筛选导出
- 筛选后导出

## GitHub Pages 注意事项

页面上线后没更新时，优先排查：

- 是否提交了 HTML、CSS、JS、`files/页面名称/data.js`、`data/document.js`。
- GitHub 仓库中是否能看到最新文件。
- 发布分支和发布目录是否正确。
- 浏览器缓存。
- GitHub Pages CDN 缓存。
- 中文文件名、大小写、URL 是否完全一致。

## 输出要求

每次生成或修改页面后，需要说明：

- 页面放置路径
- 新增或修改的文件
- 导航接入位置
- 是否新增 `files/页面名称/data.js`
- 是否验证 `index.html` 菜单打开
- GitHub Pages 需要注意的点
