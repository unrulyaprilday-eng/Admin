(function () {
  var operationRows = [
    { id: 1, account: "admin", role: "财务", module: "财务管理", content: "充值订单201200102222审核完成", objectId: "213123", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 2, account: "admin", role: "财务", module: "财务管理", content: "提款订单201200102222审核完成", objectId: "123123", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 3, account: "admin", role: "财务", module: "商户管理", content: "添加商户 Admiwww", objectId: "123123", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 4, account: "admin", role: "管理员", module: "商户管理", content: "删除商户 Elldls", objectId: "1232323", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 5, account: "admin", role: "管理员", module: "玩家管理", content: "冻结代理 11212", objectId: "3213123", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 6, account: "admin", role: "管理员", module: "消息通知", content: "发送消息", objectId: "-", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 7, account: "admin", role: "管理员", module: "平台管理", content: "创建角色 客服", objectId: "-", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" },
    { id: 8, account: "ops01", role: "运维", module: "平台管理", content: "创建账号失败，角色不存在", objectId: "-", errorCode: "10001", result: "待处理", time: "2020-11-25 23:26:08", ip: "191.168.0.2" },
    { id: 9, account: "ops01", role: "运维", module: "商户管理", content: "商户创建失败，回调服务超时", objectId: "M20391", errorCode: "10007", result: "待处理", time: "2020-11-25 23:26:08", ip: "191.168.0.2" },
    { id: 10, account: "admin", role: "管理员", module: "游戏管理", content: "《大富豪》关闭", objectId: "-", errorCode: "-", result: "成功", time: "2020-11-25 23:26:08", ip: "191.168.0.1" }
  ];

  var loginRows = [
    { id: 1, account: "admin", role: "财务", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 2, account: "admin", role: "财务", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 3, account: "admin", role: "财务", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 4, account: "admin", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 5, account: "admin", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 6, account: "admin", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 7, account: "ops01", role: "运维", loginTime: "2020-11-25 23:26:08", logoutTime: "-", ip: "191.168.0.2", region: "新加坡" },
    { id: 8, account: "audit02", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "-", ip: "191.168.0.8", region: "中国澳门" },
    { id: 9, account: "admin", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" },
    { id: 10, account: "admin", role: "管理员", loginTime: "2020-11-25 23:26:08", logoutTime: "2020-11-25 23:56:08", ip: "191.168.0.1", region: "中国香港" }
  ];

  var els = {};

  function get(id) {
    return document.getElementById(id);
  }

  function statusClass(value) {
    if (value === "成功") return "status-success";
    if (value === "待处理") return "status-warning";
    return "status-danger";
  }

  function statusHtml(value) {
    return "<span class=\"status-tag " + statusClass(value) + "\">" + value + "</span>";
  }

  function emptyRow(count) {
    return "<tr><td colspan=\"" + count + "\" class=\"empty-cell\">暂无数据</td></tr>";
  }

  function operationHtml(row) {
    var code = row.errorCode === "-" ? "-" : "<button class=\"link-text\" type=\"button\" data-action=\"detail\" data-scope=\"operation\" data-id=\"" + row.id + "\">" + row.errorCode + "</button>";
    return "<tr>"
      + "<td>" + row.id + "</td>"
      + "<td>" + row.account + "</td>"
      + "<td><span class=\"link-text\">" + row.role + "</span></td>"
      + "<td>" + row.module + "</td>"
      + "<td title=\"" + row.content + "\">" + row.content + "</td>"
      + "<td>" + row.objectId + "</td>"
      + "<td>" + code + "</td>"
      + "<td>" + statusHtml(row.result) + "</td>"
      + "<td>" + row.time + "</td>"
      + "<td><button class=\"table-link\" type=\"button\" data-action=\"detail\" data-scope=\"operation\" data-id=\"" + row.id + "\">详情</button></td>"
      + "</tr>";
  }

  function loginHtml(row) {
    return "<tr>"
      + "<td>" + row.id + "</td>"
      + "<td>" + row.account + "</td>"
      + "<td><span class=\"link-text\">" + row.role + "</span></td>"
      + "<td>" + row.loginTime + "</td>"
      + "<td>" + row.logoutTime + "</td>"
      + "<td>" + row.ip + "</td>"
      + "<td>" + row.region + "</td>"
      + "</tr>";
  }

  function operationFiltered() {
    var account = els.operationAccount.value.trim();
    var role = els.operationRole.value;
    var module = els.operationModule.value;
    return operationRows.filter(function (row) {
      return (!account || row.account.indexOf(account) >= 0)
        && (!role || row.role === role)
        && (!module || row.module === module);
    });
  }

  function loginFiltered() {
    var account = els.loginAccount.value.trim();
    var role = els.loginRole.value;
    return loginRows.filter(function (row) {
      return (!account || row.account.indexOf(account) >= 0)
        && (!role || row.role === role);
    });
  }

  function renderOperation() {
    var rows = operationFiltered();
    els.operationBody.innerHTML = rows.length ? rows.map(operationHtml).join("") : emptyRow(11);
  }

  function renderLogin() {
    var rows = loginFiltered();
    els.loginBody.innerHTML = rows.length ? rows.map(loginHtml).join("") : emptyRow(7);
  }

  function reset(scope) {
    if (scope === "operation") {
      els.operationAccount.value = "";
      els.operationRole.value = "";
      els.operationModule.value = "";
      els.operationStart.value = "";
      els.operationEnd.value = "";
      renderOperation();
      return;
    }
    els.loginAccount.value = "";
    els.loginRole.value = "";
    els.loginStart.value = "";
    els.loginEnd.value = "";
    renderLogin();
  }

  function showTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("data-tab") === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab-panel"), function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-panel") === name);
    });
  }

  function findRow(scope, id) {
    var rows = scope === "operation" ? operationRows : loginRows;
    return rows.filter(function (row) { return String(row.id) === String(id); })[0];
  }

  function pair(label, value, wide) {
    return "<dt>" + label + "</dt><dd" + (wide ? " class=\"wide-value\"" : "") + ">" + value + "</dd>";
  }

  function openDetail(scope, id) {
    var row = findRow(scope, id);
    if (!row) return;
    els.detailTitle.textContent = "操作日志详情";
    if (scope === "operation") {
      els.detailGrid.innerHTML = pair("账号", row.account)
        + pair("角色", row.role)
        + pair("操作日志类型", row.module)
        + pair("对象ID", row.objectId)
        + pair("错误编码", row.errorCode)
        + pair("结果", row.result)
        + pair("操作IP", row.ip)
        + pair("操作时间", row.time)
        + pair("内容", row.content, true);
    }
    els.dialog.classList.remove("is-hidden");
  }

  function closeDetail() {
    els.dialog.classList.add("is-hidden");
  }

  function exportRows(scope) {
    var count = scope === "operation" ? operationFiltered().length : loginFiltered().length;
    alert("已导出当前筛选结果，共 " + count + " 条。");
  }

  function bindActions() {
    document.body.addEventListener("click", function (event) {
      var target = event.target;
      var tab = target.getAttribute("data-tab");
      var action = target.getAttribute("data-action");
      var scope = target.getAttribute("data-scope");
      if (tab) {
        showTab(tab);
      }
      if (action === "search" && scope === "operation") renderOperation();
      if (action === "search" && scope === "login") renderLogin();
      if (action === "reset") reset(scope);
      if (action === "export") exportRows(scope);
      if (action === "detail" && scope === "operation") openDetail(scope, target.getAttribute("data-id"));
    });
    els.closeDialog.addEventListener("click", closeDetail);
    els.confirmDialog.addEventListener("click", closeDetail);
  }

  function init() {
    els.operationAccount = get("operationAccount");
    els.operationRole = get("operationRole");
    els.operationModule = get("operationModule");
    els.operationStart = get("operationStart");
    els.operationEnd = get("operationEnd");
    els.operationBody = get("operationBody");
    els.loginAccount = get("loginAccount");
    els.loginRole = get("loginRole");
    els.loginStart = get("loginStart");
    els.loginEnd = get("loginEnd");
    els.loginBody = get("loginBody");
    els.dialog = get("detailDialog");
    els.detailTitle = get("detailTitle");
    els.detailGrid = get("detailGrid");
    els.closeDialog = get("closeDialog");
    els.confirmDialog = get("confirmDialog");
    renderOperation();
    renderLogin();
    bindActions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
