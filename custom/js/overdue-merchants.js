(function () {
  var statusOptions = [
    {
      value: "maintenance",
      label: "维护",
      className: "maintenance",
      description: "最高限制等级，站点进入维护状态。"
    },
    {
      value: "forbidden_game",
      label: "禁止游戏",
      className: "forbidden-game",
      description: "前台所有会员都无法进入三方游戏。"
    },
    {
      value: "backend_restricted",
      label: "后台限制",
      className: "backend-restricted",
      description: "将无法导出会员资料和无法提现审核，含暂停自动出款。"
    },
    {
      value: "warning",
      label: "预警",
      className: "warning",
      description: "最低限制等级，仅提示逾期风险。"
    },
    {
      value: "normal",
      label: "正常",
      className: "normal",
      description: "站点正常开放，未触发逾期限制。"
    }
  ];

  var rows = [
    {
      merchantId: "M10086",
      merchantName: "星河娱乐城",
      overdueAmount: 128270.34,
      overdueDays: 36,
      lastRechargeAt: "2026-04-12 15:24:18",
      siteStatus: "maintenance"
    },
    {
      merchantId: "M10052",
      merchantName: "蓝海国际",
      overdueAmount: 86420.00,
      overdueDays: 21,
      lastRechargeAt: "2026-04-27 09:18:42",
      siteStatus: "forbidden_game"
    },
    {
      merchantId: "M10031",
      merchantName: "金冠体育",
      overdueAmount: 35890.50,
      overdueDays: 12,
      lastRechargeAt: "2026-05-03 20:06:11",
      siteStatus: "backend_restricted"
    },
    {
      merchantId: "M10018",
      merchantName: "云顶娱乐",
      overdueAmount: 12600.00,
      overdueDays: 5,
      lastRechargeAt: "2026-05-11 11:32:06",
      siteStatus: "warning"
    },
    {
      merchantId: "M10007",
      merchantName: "壹号俱乐部",
      overdueAmount: 6900.75,
      overdueDays: 2,
      lastRechargeAt: "2026-05-15 17:45:29",
      siteStatus: "warning"
    },
    {
      merchantId: "M10002",
      merchantName: "极光电竞",
      overdueAmount: 0,
      overdueDays: 0,
      lastRechargeAt: "2026-05-18 10:12:46",
      siteStatus: "normal"
    }
  ];
  var els = {};
  var currentMerchantId = "";
  var filters = {
    merchantId: "",
    merchantName: "",
    minDays: "",
    maxDays: "",
    siteStatus: ""
  };

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function statusMeta(value) {
    return statusOptions.filter(function (item) { return item.value === value; })[0] || statusOptions[4];
  }

  function statusTag(value) {
    var item = statusMeta(value);
    return "<span class=\"status " + item.className + "\">" + item.label + "</span>";
  }

  function filteredRows() {
    var minDays = filters.minDays === "" ? null : Number(filters.minDays);
    var maxDays = filters.maxDays === "" ? null : Number(filters.maxDays);
    return rows.filter(function (row) {
      return (!filters.merchantId || row.merchantId.indexOf(filters.merchantId) >= 0)
        && (!filters.merchantName || row.merchantName.indexOf(filters.merchantName) >= 0)
        && (minDays === null || row.overdueDays >= minDays)
        && (maxDays === null || row.overdueDays <= maxDays)
        && (!filters.siteStatus || row.siteStatus === filters.siteStatus);
    });
  }

  function render() {
    els.body.innerHTML = filteredRows().map(function (row) {
      return "<tr>"
        + "<td>" + row.merchantId + "</td>"
        + "<td>" + row.merchantName + "</td>"
        + "<td class=\"money\">" + money(row.overdueAmount) + "</td>"
        + "<td>" + row.overdueDays + "</td>"
        + "<td>" + row.lastRechargeAt + "</td>"
        + "<td>" + statusTag(row.siteStatus) + "</td>"
        + "<td><button class=\"link-btn\" type=\"button\" data-action=\"status\" data-id=\"" + row.merchantId + "\">调整</button></td>"
        + "</tr>";
    }).join("") || "<tr><td colspan=\"7\" class=\"empty-cell\">暂无数据</td></tr>";
  }

  function renderFilterStatusOptions() {
    els.filterSiteStatus.innerHTML = "<option value=\"\">全部</option>" + statusOptions.map(function (item) {
      return "<option value=\"" + item.value + "\">" + item.label + "</option>";
    }).join("");
  }

  function renderStatusOptions(selectedValue) {
    els.statusSelect.innerHTML = statusOptions.map(function (item) {
      return "<option value=\"" + item.value + "\">" + item.label + "</option>";
    }).join("");
    els.statusSelect.value = selectedValue || statusOptions[4].value;
    renderStatusDescription();
  }

  function renderStatusDescription() {
    els.statusDesc.textContent = statusMeta(els.statusSelect.value).description;
  }

  function findRow(id) {
    return rows.filter(function (row) { return row.merchantId === id; })[0];
  }

  function openStatusPanel(row) {
    if (!row) return;
    currentMerchantId = row.merchantId;
    els.modalTitle.textContent = "调整站点状态 - " + row.merchantName + "（" + row.merchantId + "）";
    renderStatusOptions(row.siteStatus);
    els.statusPanel.classList.remove("is-hidden");
  }

  function closeStatusPanel() {
    currentMerchantId = "";
    els.statusPanel.classList.add("is-hidden");
  }

  function confirmStatus() {
    var row = findRow(currentMerchantId);
    if (row) row.siteStatus = els.statusSelect.value;
    closeStatusPanel();
    render();
  }

  function readFilters() {
    filters.merchantId = els.filterMerchantId.value.trim();
    filters.merchantName = els.filterMerchantName.value.trim();
    filters.minDays = els.filterMinDays.value;
    filters.maxDays = els.filterMaxDays.value;
    filters.siteStatus = els.filterSiteStatus.value;
  }

  function resetFilters() {
    filters = {
      merchantId: "",
      merchantName: "",
      minDays: "",
      maxDays: "",
      siteStatus: ""
    };
    els.filterMerchantId.value = "";
    els.filterMerchantName.value = "";
    els.filterMinDays.value = "";
    els.filterMaxDays.value = "";
    els.filterSiteStatus.value = "";
    render();
  }

  function bind() {
    els.searchBtn.addEventListener("click", function () {
      readFilters();
      render();
    });

    els.resetBtn.addEventListener("click", resetFilters);

    els.body.addEventListener("click", function (event) {
      var action = event.target.getAttribute("data-action");
      var id = event.target.getAttribute("data-id");
      if (action === "status") openStatusPanel(findRow(id));
    });

    els.statusSelect.addEventListener("change", renderStatusDescription);
    els.closeStatusBtn.addEventListener("click", closeStatusPanel);
    els.cancelStatusBtn.addEventListener("click", closeStatusPanel);
    els.confirmStatusBtn.addEventListener("click", confirmStatus);
  }

  function init() {
    els = {
      filterMerchantId: document.getElementById("filterMerchantId"),
      filterMerchantName: document.getElementById("filterMerchantName"),
      filterMinDays: document.getElementById("filterMinDays"),
      filterMaxDays: document.getElementById("filterMaxDays"),
      filterSiteStatus: document.getElementById("filterSiteStatus"),
      searchBtn: document.getElementById("searchBtn"),
      resetBtn: document.getElementById("resetBtn"),
      body: document.getElementById("overdueMerchantBody"),
      statusPanel: document.getElementById("statusPanel"),
      modalTitle: document.getElementById("modalTitle"),
      statusSelect: document.getElementById("siteStatusSelect"),
      statusDesc: document.getElementById("siteStatusDesc"),
      closeStatusBtn: document.getElementById("closeStatusBtn"),
      cancelStatusBtn: document.getElementById("cancelStatusBtn"),
      confirmStatusBtn: document.getElementById("confirmStatusBtn")
    };
    renderFilterStatusOptions();
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
