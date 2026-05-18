(function () {
  var rows = [
    {
      id: "cp_10001",
      complaintDate: "2026-05-15 09:18:42",
      merchantId: "M10021",
      merchantName: "长风娱乐",
      siteId: "S101",
      siteName: "长风一站",
      memberId: "1010010006",
      memberAccount: "gb101",
      content: "会员提现不到账，多次联系商户客服未得到明确处理结果。",
      attachmentType: "video",
      complaintCount: 6,
      unhandledDays: 1,
      status: "待处理",
      operator: "",
      handleTime: "",
      triggerReason: "投诉次数过多"
    },
    {
      id: "cp_10002",
      complaintDate: "2026-05-13 16:24:09",
      merchantId: "M10086",
      merchantName: "星河游戏",
      siteId: "S203",
      siteName: "星河主站",
      memberId: "1010010012",
      memberAccount: "gb102",
      content: "游戏派彩异常，商户侧超过两天未回复，要求平台协助跟进。",
      attachmentType: "video",
      complaintCount: 2,
      unhandledDays: 3,
      status: "处理中",
      operator: "平台客服A01",
      handleTime: "2026-05-15 10:12:30",
      triggerReason: "未处理过久"
    },
    {
      id: "cp_10003",
      complaintDate: "2026-05-12 11:05:17",
      merchantId: "M10033",
      merchantName: "大公会",
      siteId: "S305",
      siteName: "大公会站点",
      memberId: "1010010004",
      memberAccount: "agent",
      content: "充值到账延迟，会员重复提交投诉后升级至平台处理。",
      attachmentType: "none",
      complaintCount: 5,
      unhandledDays: 2,
      status: "已处理",
      operator: "平台客服A02",
      handleTime: "2026-05-15 13:45:21",
      triggerReason: "投诉次数过多"
    }
  ];

  var filters = {
    status: "",
    siteId: "",
    memberId: "",
    account: ""
  };
  var activeRow = null;
  var els = {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

function emptyRow() {
    return "<tr><td colspan=\"14\" class=\"empty-cell\">暂无数据</td></tr>";
  }

  function statusHtml(status) {
    var className = status === "已处理" ? "done" : status === "处理中" ? "processing" : "pending";
    return "<span class=\"status-tag " + className + "\">" + status + "</span>";
  }

  function memberText(row) {
    return row.memberAccount + " / " + row.memberId;
  }

  function rowHtml(row) {
    var action = row.status === "已处理" ? "查看" : "处理";
    var actionClass = row.status === "已处理" ? " view" : "";
    return "<tr>"
      + "<td>" + escapeHtml(row.complaintDate) + "</td>"
      + "<td>" + escapeHtml(row.merchantId) + "</td>"
      + "<td>" + escapeHtml(row.merchantName) + "</td>"
      + "<td>" + escapeHtml(row.siteId) + "</td>"
      + "<td>" + escapeHtml(row.siteName) + "</td>"
      + "<td title=\"" + escapeHtml(memberText(row)) + "\">" + escapeHtml(memberText(row)) + "</td>"
      + "<td title=\"" + escapeHtml(row.content) + "\">" + escapeHtml(row.content) + "</td>"
      + "<td>" + row.complaintCount + "</td>"
      + "<td>" + row.unhandledDays + "</td>"
      + "<td><span class=\"reason-tag\">" + escapeHtml(row.triggerReason) + "</span></td>"
      + "<td>" + statusHtml(row.status) + "</td>"
      + "<td>" + escapeHtml(row.operator || "-") + "</td>"
      + "<td>" + escapeHtml(row.handleTime || "-") + "</td>"
      + "<td class=\"sticky-action\"><button class=\"action-btn" + actionClass + "\" type=\"button\" data-action=\"detail\" data-id=\"" + row.id + "\">" + action + "</button></td>"
      + "</tr>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!filters.status || row.status === filters.status)
        && (!filters.siteId || row.siteId.indexOf(filters.siteId) >= 0)
        && (!filters.memberId || row.memberId.indexOf(filters.memberId) >= 0)
        && (!filters.account || row.memberAccount.indexOf(filters.account) >= 0);
    });
  }

  function render() {
    var list = filteredRows();
    els.body.innerHTML = list.length ? list.map(rowHtml).join("") : emptyRow();
  }

  function readFilters() {
    filters.status = els.status.value;
    filters.siteId = els.siteId.value.trim();
    filters.memberId = els.memberId.value.trim();
    filters.account = els.account.value.trim();
  }

  function resetFilters() {
    els.startDate.value = "";
    els.endDate.value = "";
    els.status.value = "";
    els.siteId.value = "";
    els.memberId.value = "";
    els.account.value = "";
    readFilters();
    render();
  }

  function findRow(id) {
    return rows.filter(function (row) { return row.id === id; })[0];
  }

  function openLayer(layer) {
    layer.classList.remove("is-hidden");
  }

  function closeLayer(layer) {
    layer.classList.add("is-hidden");
    if (layer === els.detailModal) {
      activeRow = null;
    }
  }

  function attachmentHtml(row) {
    if (row.attachmentType === "video") {
      return "<div class=\"attachment-panel\"><div class=\"video-mock\"><div class=\"video-progress\"></div><div class=\"video-toolbar\"><span>▶</span><strong>0:00 / 0:05</strong><span>▮▮</span><span>□</span><span>⋮</span></div></div></div>";
    }
    return "<div class=\"attachment-panel\">无附件</div>";
  }

  function detailHtml(row, readonly) {
    return ""
      + "<label class=\"complaint-form-row\"><span>反馈内容:</span><textarea class=\"feedback\" readonly>" + escapeHtml(row.content) + "</textarea></label>"
      + "<div class=\"complaint-form-row\"><span>附件:</span>" + attachmentHtml(row) + "</div>"
      + "<label class=\"complaint-form-row\"><span>回复:</span><textarea class=\"reply\" id=\"processRemark\" " + (readonly ? "readonly" : "") + " placeholder=\"请输入回复内容\">" + (readonly ? escapeHtml(row.reply || "已采纳处理") : "") + "</textarea></label>";
  }

  function openDetail(row) {
    activeRow = row;
    els.detailTitle.textContent = row.status === "已处理" ? "查看投诉" : "处理投诉";
    els.detailBody.innerHTML = detailHtml(row, row.status === "已处理");
    els.detailFooter.innerHTML = row.status === "已处理"
      ? "<button class=\"btn primary large\" type=\"button\" data-detail-result=\"close\">关闭</button>"
      : "<button class=\"btn ghost large\" type=\"button\" data-detail-result=\"ignore\">忽略</button><button class=\"btn primary large\" type=\"button\" data-detail-result=\"done\">采纳</button>";
    openLayer(els.detailModal);
  }

  function handleDetailResult(result) {
    if (result === "close") {
      closeLayer(els.detailModal);
      return;
    }
    if (!activeRow) return;
    activeRow.status = result === "ignore" ? "已处理" : "已处理";
    activeRow.operator = "平台客服A01";
    activeRow.handleTime = "2026-05-15 16:40:00";
    activeRow.reply = document.getElementById("processRemark") ? document.getElementById("processRemark").value.trim() : "";
    closeLayer(els.detailModal);
    render();
  }

  function updateContentCount() {
    els.contentCount.textContent = String(els.remindContent.value.length) + " / 1000";
  }

  function updateRemindParamState() {
    var isCycle = els.remindCycle.value === "cycle";
    els.remindParam.disabled = !isCycle;
    if (!isCycle) {
      els.remindParam.value = "";
    } else if (!els.remindParam.value) {
      els.remindParam.value = "2";
    }
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      render();
    });
    els.reset.addEventListener("click", resetFilters);
    els.triggerBtn.addEventListener("click", function () {
      openLayer(els.triggerModal);
    });
    els.remindBtn.addEventListener("click", function () {
      openLayer(els.remindModal);
    });
    els.body.addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      var row;
      if (!button) return;
      row = findRow(button.getAttribute("data-id"));
      if (row) openDetail(row);
    });
    document.addEventListener("click", function (event) {
      var target = event.target;
      var closeType = target.getAttribute("data-close");
      if (closeType === "detail" || target.classList.contains("modal-mask") && target.parentNode === els.detailModal) closeLayer(els.detailModal);
      if (closeType === "trigger" || target.classList.contains("modal-mask") && target.parentNode === els.triggerModal) closeLayer(els.triggerModal);
      if (closeType === "remind" || target.classList.contains("modal-mask") && target.parentNode === els.remindModal) closeLayer(els.remindModal);
    });
    els.detailFooter.addEventListener("click", function (event) {
      var button = event.target.closest("[data-detail-result]");
      if (button) handleDetailResult(button.getAttribute("data-detail-result"));
    });
    els.triggerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      closeLayer(els.triggerModal);
    });
    els.remindForm.addEventListener("submit", function (event) {
      event.preventDefault();
      closeLayer(els.remindModal);
    });
    els.remindContent.addEventListener("input", updateContentCount);
    els.remindCycle.addEventListener("change", updateRemindParamState);
  }

  function init() {
    els = {
      body: document.getElementById("complaintBody"),
      startDate: document.getElementById("startDate"),
      endDate: document.getElementById("endDate"),
      status: document.getElementById("statusFilter"),
      siteId: document.getElementById("siteIdFilter"),
      memberId: document.getElementById("memberIdFilter"),
      account: document.getElementById("accountFilter"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      triggerBtn: document.getElementById("triggerSettingBtn"),
      remindBtn: document.getElementById("remindSettingBtn"),
      detailModal: document.getElementById("detailModal"),
      detailTitle: document.getElementById("detailTitle"),
      detailBody: document.getElementById("detailBody"),
      detailFooter: document.getElementById("detailFooter"),
      triggerModal: document.getElementById("triggerModal"),
      triggerForm: document.getElementById("triggerForm"),
      remindModal: document.getElementById("remindModal"),
      remindForm: document.getElementById("remindForm"),
      remindCycle: document.getElementById("remindCycle"),
      remindParam: document.getElementById("remindParam"),
      remindContent: document.getElementById("remindContent"),
      contentCount: document.getElementById("contentCount")
    };
    bind();
    updateContentCount();
    updateRemindParamState();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
