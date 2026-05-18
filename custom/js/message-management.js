(function () {
  var rows = [
    {
      id: 10001,
      type: "平台公告",
      title: "商户后台结算时间调整通知",
      merchants: "全部商户",
      sendTime: "2026-05-15 09:30",
      endTime: "2026-05-20 23:59",
      status: "已发送",
      operator: "平台运营A01",
      operateTime: "2026-05-15 09:20",
      content: "平台将于 05-16 起调整商户后台结算任务执行时间，请各商户提前核对账单。"
    },
    {
      id: 10002,
      type: "风控弹窗",
      title: "支付通道夜间维护提醒",
      merchants: "mk1001,mk1003,mk2088",
      sendTime: "2026-05-16 01:00",
      endTime: "2026-05-16 06:00",
      status: "待发送",
      operator: "平台运营A02",
      operateTime: "2026-05-15 11:10",
      content: "受维护影响，指定商户夜间充值回调可能存在短暂延迟。"
    },
    {
      id: 10003,
      type: "通知",
      title: "周末充值返利活动上线",
      merchants: "mk3021,mk3025",
      sendTime: "2026-05-17 10:00",
      endTime: "2026-05-19 23:59",
      status: "已发送",
      operator: "平台运营A03",
      operateTime: "2026-05-15 14:36",
      content: "平台已为指定商户开放周末充值返利配置，请及时在 B 端查看活动说明。"
    },
    {
      id: 10004,
      type: "短信",
      title: "短信签名报备提醒",
      merchants: "mk1099,mk2077",
      sendTime: "2026-05-18 12:00",
      endTime: "2026-05-25 23:59",
      status: "待发送",
      operator: "平台运营A02",
      operateTime: "2026-05-15 15:08",
      content: "请在商户后台补充短信签名报备资料，避免验证码短信发送失败。"
    },
    {
      id: 10005,
      type: "系统消息",
      title: "API 白名单配置变更完成",
      merchants: "mk1001",
      sendTime: "2026-05-15 16:20",
      endTime: "2026-05-22 23:59",
      status: "已发送",
      operator: "平台运维A01",
      operateTime: "2026-05-15 16:18",
      content: "商户 mk1001 的 API 白名单配置已更新完成，请在 B 端后台确认接口连通性。"
    }
  ];
  var dialogMode = "add";
  var editingId = null;
  var filters = {
    startTime: "",
    endTime: "",
    type: "",
    status: "",
    title: ""
  };

  var els = {};

  function emptyRow() {
    return "<tr><td colspan=\"10\" class=\"empty-cell\">暂无数据</td></tr>";
  }

  function rowHtml(row) {
    return "<tr>"
      + "<td>" + row.id + "</td>"
      + "<td>" + row.type + "</td>"
      + "<td>" + row.title + "</td>"
      + "<td>" + row.merchants + "</td>"
      + "<td>" + row.sendTime + "</td>"
      + "<td>" + row.endTime + "</td>"
      + "<td>" + statusHtml(row.status) + "</td>"
      + "<td>" + row.operator + "</td>"
      + "<td>" + row.operateTime + "</td>"
      + "<td><div class=\"table-actions\">"
      + "<button class=\"table-link\" type=\"button\" data-action=\"detail\" data-id=\"" + row.id + "\">查看</button>"
      + "<button class=\"table-link\" type=\"button\" data-action=\"edit\" data-id=\"" + row.id + "\">编辑</button>"
      + "<button class=\"table-link\" type=\"button\" data-action=\"send\" data-id=\"" + row.id + "\"" + (row.status === "已发送" ? " disabled" : "") + ">发送</button>"
      + "<button class=\"table-link danger\" type=\"button\" data-action=\"delete\" data-id=\"" + row.id + "\">删除</button>"
      + "</div></td>"
      + "</tr>";
  }

  function statusHtml(status) {
    var className = status === "已发送" ? "sent" : "pending";
    return "<span class=\"status-tag " + className + "\">" + status + "</span>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!filters.type || row.type === filters.type)
        && (!filters.status || row.status === filters.status)
        && (!filters.title || row.title.indexOf(filters.title) >= 0);
    });
  }

  function render() {
    var list = filteredRows();
    els.body.innerHTML = list.length ? list.map(rowHtml).join("") : emptyRow();
  }

  function readFilters() {
    filters.startTime = els.startTime.value.trim();
    filters.endTime = els.endTime.value.trim();
    filters.type = els.type.value;
    filters.status = els.status.value;
    filters.title = els.title.value.trim();
  }

  function resetFilters() {
    els.startTime.value = "";
    els.endTime.value = "";
    els.type.value = "";
    els.status.value = "";
    els.title.value = "";
    readFilters();
    render();
  }

  function openDialog() {
    dialogMode = "add";
    editingId = null;
    els.dialogTitle.textContent = "新增";
    els.submit.textContent = "提交";
    els.form.classList.remove("is-readonly");
    setFormDisabled(false);
    els.dialog.classList.remove("is-hidden");
    els.form.reset();
    toggleRecipientMode();
  }

  function closeDialog() {
    els.dialog.classList.add("is-hidden");
  }

  function toggleRecipientMode() {
    var isSpecific = els.recipientSpecific.checked;
    els.recipientAccounts.disabled = !isSpecific;
    if (!isSpecific) {
      els.recipientAccounts.value = "";
    }
  }

  function recipientText() {
    if (els.recipientAll.checked) {
      return "全部商户";
    }
    return els.recipientAccounts.value.trim();
  }

  function findRow(id) {
    return rows.filter(function (item) { return String(item.id) === String(id); })[0];
  }

  function fillForm(row) {
    els.formType.value = row.type;
    els.formTitle.value = row.title;
    document.getElementById("formContent").value = row.content || "";
    els.formEndTime.value = row.endTime === "--" ? "" : row.endTime;
    if (row.merchants === "全部商户") {
      els.recipientAll.checked = true;
      els.recipientSpecific.checked = false;
    } else {
      els.recipientAll.checked = false;
      els.recipientSpecific.checked = true;
      els.recipientAccounts.value = row.merchants;
    }
    toggleRecipientMode();
  }

  function setFormDisabled(disabled) {
    var fields = els.form.querySelectorAll("input, select, textarea");
    Array.prototype.forEach.call(fields, function (field) {
      if (field.id !== "closeDialog") field.disabled = disabled;
    });
    els.cancel.disabled = false;
    els.submit.disabled = disabled;
  }

  function openDetail(row) {
    dialogMode = "detail";
    editingId = row.id;
    els.dialogTitle.textContent = "查看消息";
    els.submit.textContent = "提交";
    els.form.reset();
    fillForm(row);
    els.form.classList.add("is-readonly");
    setFormDisabled(true);
    els.dialog.classList.remove("is-hidden");
  }

  function openEdit(row) {
    dialogMode = "edit";
    editingId = row.id;
    els.dialogTitle.textContent = "编辑消息";
    els.submit.textContent = "保存";
    els.form.reset();
    fillForm(row);
    els.form.classList.remove("is-readonly");
    setFormDisabled(false);
    els.dialog.classList.remove("is-hidden");
  }

  function submitForm(event) {
    event.preventDefault();
    var merchants = recipientText();
    if (!merchants) {
      els.recipientAccounts.focus();
      return;
    }
    if (dialogMode === "edit") {
      var current = findRow(editingId);
      if (!current) return;
      current.type = els.formType.value;
      current.title = els.formTitle.value.trim();
      current.merchants = merchants;
      current.endTime = els.formEndTime.value.trim() || "--";
      current.operateTime = "2026-05-15 16:30";
      current.content = document.getElementById("formContent").value.trim();
    } else {
      rows.push({
        id: rows.length ? rows[rows.length - 1].id + 1 : 10001,
        type: els.formType.value,
        title: els.formTitle.value.trim(),
        merchants: merchants,
        sendTime: "提交后发送",
        endTime: els.formEndTime.value.trim() || "--",
        status: "待发送",
        operator: "平台运营A01",
        operateTime: "2026-05-15 16:00",
        content: document.getElementById("formContent").value.trim()
      });
    }
    closeDialog();
    render();
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      render();
    });
    els.reset.addEventListener("click", resetFilters);
    els.add.addEventListener("click", openDialog);
    els.close.addEventListener("click", closeDialog);
    els.cancel.addEventListener("click", closeDialog);
    els.form.addEventListener("submit", submitForm);
    els.recipientAll.addEventListener("change", toggleRecipientMode);
    els.recipientSpecific.addEventListener("change", toggleRecipientMode);
    els.body.addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      var row;
      if (!button) return;
      row = rows.filter(function (item) { return String(item.id) === button.getAttribute("data-id"); })[0];
      if (!row) return;
      if (button.getAttribute("data-action") === "detail") {
        openDetail(row);
      }
      if (button.getAttribute("data-action") === "edit") {
        openEdit(row);
      }
      if (button.getAttribute("data-action") === "send") {
        row.status = "已发送";
        row.sendTime = "2026-05-15 16:45";
        row.operateTime = "2026-05-15 16:45";
        render();
      }
      if (button.getAttribute("data-action") === "delete") {
        rows = rows.filter(function (item) { return item.id !== row.id; });
        render();
      }
    });
  }

  function init() {
    els = {
      body: document.getElementById("messageBody"),
      startTime: document.getElementById("startTime"),
      endTime: document.getElementById("endTime"),
      type: document.getElementById("messageType"),
      status: document.getElementById("messageStatus"),
      title: document.getElementById("messageTitle"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      add: document.getElementById("addBtn"),
      dialog: document.getElementById("messageDialog"),
      form: document.getElementById("messageForm"),
      dialogTitle: document.getElementById("dialogTitle"),
      formType: document.getElementById("formType"),
      formTitle: document.getElementById("formTitle"),
      formEndTime: document.getElementById("formEndTime"),
      recipientAll: document.getElementById("recipientAll"),
      recipientSpecific: document.getElementById("recipientSpecific"),
      recipientAccounts: document.getElementById("recipientAccounts"),
      close: document.getElementById("closeDialog"),
      cancel: document.getElementById("cancelBtn"),
      submit: document.getElementById("submitBtn")
    };
    bind();
    toggleRecipientMode();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
