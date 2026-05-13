(function () {
  var rows = [
    { month: "2026-05", merchantId: "M10001", merchantName: "星河娱乐城", merchantRecharge: 420000, merchantBalance: 864220, setupFee: 12000, serverFee: 8600, vendorCharge: 128240, vendorCost: 102600, manualAdd: 18600, manualDeduct: 10000, rechargeBonus: 32200, otherDeduction: 3800, status: "confirmed" },
    { month: "2026-05", merchantId: "M10002", merchantName: "蓝海国际", merchantRecharge: 360000, merchantBalance: 526800, setupFee: 10000, serverFee: 7200, vendorCharge: 92580, vendorCost: 74100, manualAdd: 9200, manualDeduct: 5400, rechargeBonus: 22400, otherDeduction: 2500, status: "wait" },
    { month: "2026-05", merchantId: "M10003", merchantName: "极光娱乐", merchantRecharge: 210000, merchantBalance: 286400, setupFee: 8000, serverFee: 5600, vendorCharge: 59240, vendorCost: 48100, manualAdd: 5800, manualDeduct: 3000, rechargeBonus: 13600, otherDeduction: 1200, status: "settled" },
    { month: "2026-05", merchantId: "M10004", merchantName: "银石游戏", merchantRecharge: 90000, merchantBalance: 188900, setupFee: 6000, serverFee: 4200, vendorCharge: 21900, vendorCost: 23600, manualAdd: 4200, manualDeduct: 5400, rechargeBonus: 8200, otherDeduction: 1800, status: "wait" },
    { month: "2026-04", merchantId: "M10001", merchantName: "星河娱乐城", merchantRecharge: 390000, merchantBalance: 841600, setupFee: 12000, serverFee: 8600, vendorCharge: 119600, vendorCost: 96400, manualAdd: 22400, manualDeduct: 8200, rechargeBonus: 28600, otherDeduction: 3000, status: "settled" },
    { month: "2026-04", merchantId: "M10002", merchantName: "蓝海国际", merchantRecharge: 310000, merchantBalance: 504300, setupFee: 10000, serverFee: 7200, vendorCharge: 81500, vendorCost: 66200, manualAdd: 11800, manualDeduct: 4600, rechargeBonus: 19800, otherDeduction: 2200, status: "settled" },
    { month: "2026-04", merchantId: "M10005", merchantName: "云顶新娱", merchantRecharge: 260000, merchantBalance: 412500, setupFee: 9000, serverFee: 6500, vendorCharge: 79920, vendorCost: 63800, manualAdd: 7200, manualDeduct: 3600, rechargeBonus: 18400, otherDeduction: 1500, status: "confirmed" },
    { month: "2026-04", merchantId: "M10006", merchantName: "盛世互动", merchantRecharge: 80000, merchantBalance: 96200, setupFee: 5000, serverFee: 3600, vendorCharge: 14220, vendorCost: 11600, manualAdd: 1300, manualDeduct: 900, rechargeBonus: 4200, otherDeduction: 600, status: "wait" }
  ];

  var state = {
    view: "overview",
    page: 1,
    pageSize: 6,
    filters: { monthStart: "2026-05", monthEnd: "2026-05", merchant: "", status: "" }
  };

  var els = {};
  var statusMap = {
    wait: { label: "待确认", className: "wait" },
    confirmed: { label: "已确认", className: "confirmed" },
    settled: { label: "已结算", className: "settled" }
  };

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function vendorDiff(row) {
    return row.vendorCharge - row.vendorCost;
  }

  function deduction(row) {
    return row.manualAdd + row.rechargeBonus + row.otherDeduction - row.manualDeduct;
  }

  function actualIncome(row) {
    return row.setupFee + row.serverFee + vendorDiff(row) - row.manualAdd + row.manualDeduct - row.rechargeBonus - row.otherDeduction;
  }

  function statusTag(value) {
    var item = statusMap[value] || statusMap.wait;
    return "<span class=\"tag " + item.className + "\">" + item.label + "</span>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      var keyword = state.filters.merchant.toLowerCase();
      var matchMerchant = !keyword || row.merchantId.toLowerCase().indexOf(keyword) >= 0 || row.merchantName.toLowerCase().indexOf(keyword) >= 0;
      return (!state.filters.monthStart || row.month >= state.filters.monthStart)
        && (!state.filters.monthEnd || row.month <= state.filters.monthEnd)
        && matchMerchant
        && (!state.filters.status || row.status === state.filters.status);
    });
  }

  function aggregateByMonth(list) {
    var map = {};
    list.forEach(function (row) {
      if (!map[row.month]) {
        map[row.month] = {
          month: row.month,
          merchants: {},
          merchantRecharge: 0,
          merchantBalance: 0,
          setupFee: 0,
          serverFee: 0,
          vendorCharge: 0,
          vendorCost: 0,
          manualAdd: 0,
          manualDeduct: 0,
          rechargeBonus: 0,
          otherDeduction: 0,
          statuses: {}
        };
      }

      var target = map[row.month];
      target.merchants[row.merchantId] = true;
      target.merchantRecharge += row.merchantRecharge;
      target.merchantBalance += row.merchantBalance;
      target.setupFee += row.setupFee;
      target.serverFee += row.serverFee;
      target.vendorCharge += row.vendorCharge;
      target.vendorCost += row.vendorCost;
      target.manualAdd += row.manualAdd;
      target.manualDeduct += row.manualDeduct;
      target.rechargeBonus += row.rechargeBonus;
      target.otherDeduction += row.otherDeduction;
      target.statuses[row.status] = true;
    });

    return Object.keys(map).sort().reverse().map(function (month) {
      var row = map[month];
      row.merchantCount = Object.keys(row.merchants).length;
      row.status = row.statuses.wait ? "wait" : (row.statuses.confirmed ? "confirmed" : "settled");
      return row;
    });
  }

  function updateMetrics(list) {
    var actual = list.reduce(function (sum, row) { return sum + actualIncome(row); }, 0);
    var fixed = list.reduce(function (sum, row) { return sum + row.setupFee + row.serverFee; }, 0);
    var diff = list.reduce(function (sum, row) { return sum + vendorDiff(row); }, 0);
    var deductions = list.reduce(function (sum, row) { return sum + deduction(row); }, 0);
    var merchantRecharge = list.reduce(function (sum, row) { return sum + row.merchantRecharge; }, 0);
    var merchantBalance = list.reduce(function (sum, row) { return sum + row.merchantBalance; }, 0);

    els.metricActualIncome.textContent = "$" + money(actual);
    els.metricFixedFee.textContent = "$" + money(fixed);
    els.metricVendorDiff.textContent = "$" + money(diff);
    els.metricDeduction.textContent = "$" + money(deductions);
    els.metricMerchantRecharge.textContent = "$" + money(merchantRecharge);
    els.metricMerchantBalance.textContent = "$" + money(merchantBalance);
    els.metricMonth.textContent = state.filters.monthStart === state.filters.monthEnd ? state.filters.monthStart : state.filters.monthStart + " - " + state.filters.monthEnd;
  }

  function classByValue(value) {
    return value < 0 ? "negative" : "positive";
  }

  function overviewRowHtml(row) {
    var diff = vendorDiff(row);
    var actual = actualIncome(row);
    return "<tr>"
      + "<td>" + row.month + "</td>"
      + "<td>" + intText(row.merchantCount) + "</td>"
      + "<td class=\"money\">$" + money(row.merchantRecharge) + "</td>"
      + "<td class=\"money\">$" + money(row.merchantBalance) + "</td>"
      + "<td class=\"money\">$" + money(row.setupFee) + "</td>"
      + "<td class=\"money\">$" + money(row.serverFee) + "</td>"
      + "<td class=\"money\">$" + money(row.vendorCharge) + "</td>"
      + "<td class=\"money\">$" + money(row.vendorCost) + "</td>"
      + "<td class=\"" + classByValue(diff) + "\">$" + money(diff) + "</td>"
      + "<td class=\"money\">$" + money(row.manualAdd) + "</td>"
      + "<td class=\"money\">$" + money(row.manualDeduct) + "</td>"
      + "<td class=\"money\">$" + money(row.rechargeBonus) + "</td>"
      + "<td class=\"money\">$" + money(row.otherDeduction) + "</td>"
      + "<td class=\"" + classByValue(actual) + "\">$" + money(actual) + "</td>"
      + "<td>" + statusTag(row.status) + "</td>"
      + "</tr>";
  }

  function detailRowHtml(row) {
    var diff = vendorDiff(row);
    var actual = actualIncome(row);
    return "<tr>"
      + "<td>" + row.month + "</td>"
      + "<td>" + row.merchantId + "</td>"
      + "<td><strong>" + row.merchantName + "</strong></td>"
      + "<td class=\"money\">$" + money(row.merchantRecharge) + "</td>"
      + "<td class=\"money\">$" + money(row.merchantBalance) + "</td>"
      + "<td class=\"money\">$" + money(row.setupFee) + "</td>"
      + "<td class=\"money\">$" + money(row.serverFee) + "</td>"
      + "<td class=\"money\">$" + money(row.vendorCharge) + "</td>"
      + "<td class=\"money\">$" + money(row.vendorCost) + "</td>"
      + "<td class=\"" + classByValue(diff) + "\">$" + money(diff) + "</td>"
      + "<td class=\"money\">$" + money(row.manualAdd) + "</td>"
      + "<td class=\"money\">$" + money(row.manualDeduct) + "</td>"
      + "<td class=\"money\">$" + money(row.rechargeBonus) + "</td>"
      + "<td class=\"money\">$" + money(row.otherDeduction) + "</td>"
      + "<td class=\"" + classByValue(actual) + "\">$" + money(actual) + "</td>"
      + "<td>" + statusTag(row.status) + "</td>"
      + "</tr>";
  }

  function renderPagination(total) {
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;

    var buttons = [];
    for (var i = 1; i <= pageCount; i += 1) {
      buttons.push("<button class=\"page-btn " + (i === state.page ? "active" : "") + "\" type=\"button\" data-page=\"" + i + "\">" + i + "</button>");
    }

    els.paginationInfo.textContent = "共 " + total + " 条商户收入，当前第 " + state.page + " / " + pageCount + " 页";
    els.paginationActions.innerHTML = "<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>"
      + buttons.join("")
      + "<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>";
  }

  function render() {
    var list = filteredRows();
    var overview = aggregateByMonth(list);
    var start = (state.page - 1) * state.pageSize;
    var detailRows = list.slice(start, start + state.pageSize);

    updateMetrics(list);
    els.overviewCount.textContent = overview.length + " 条月度汇总";
    els.detailCount.textContent = list.length + " 条商户收入";
    els.overviewBody.innerHTML = overview.map(overviewRowHtml).join("") || "<tr><td colspan=\"15\" style=\"text-align:center;height:88px;color:#6b7789;\">暂无数据</td></tr>";
    els.detailBody.innerHTML = detailRows.map(detailRowHtml).join("") || "<tr><td colspan=\"16\" style=\"text-align:center;height:88px;color:#6b7789;\">暂无数据</td></tr>";
    renderPagination(list.length);

    els.overviewPanel.classList.toggle("is-hidden", state.view !== "overview");
    els.detailPanel.classList.toggle("is-hidden", state.view !== "detail");
    els.tabButtons.forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-view") === state.view);
    });
  }

  function readFilters() {
    state.filters.monthStart = els.monthStart.value;
    state.filters.monthEnd = els.monthEnd.value;
    state.filters.merchant = els.merchant.value;
    state.filters.status = els.status.value;
  }

  function downloadCsv(filename, header, lines) {
    var csv = [header].concat(lines).map(function (line) {
      return line.map(function (value) { return "\"" + String(value).replace(/"/g, "\"\"") + "\""; }).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    var list = filteredRows();
    if (state.view === "overview") {
      var overviewHeader = ["月份", "商户数", "商户充值(U)", "商户可用余额", "开版费", "服务器费用", "厂商收费", "厂商成本", "厂商费用差额", "人工加款", "人工扣款", "商户充值优惠", "其他减免", "平台实际收益", "结算状态"];
      var overviewLines = aggregateByMonth(list).map(function (row) {
        return [row.month, row.merchantCount, money(row.merchantRecharge), money(row.merchantBalance), money(row.setupFee), money(row.serverFee), money(row.vendorCharge), money(row.vendorCost), money(vendorDiff(row)), money(row.manualAdd), money(row.manualDeduct), money(row.rechargeBonus), money(row.otherDeduction), money(actualIncome(row)), statusMap[row.status].label];
      });
      downloadCsv("平台收入_月度总览.csv", overviewHeader, overviewLines);
      return;
    }

    var detailHeader = ["月份", "商户ID", "商户名称", "商户充值(U)", "商户可用余额", "开版费", "服务器费用", "厂商收费", "厂商成本", "厂商费用差额", "人工加款", "人工扣款", "商户充值优惠", "其他减免", "平台实际收益", "结算状态"];
    var detailLines = list.map(function (row) {
      return [row.month, row.merchantId, row.merchantName, money(row.merchantRecharge), money(row.merchantBalance), money(row.setupFee), money(row.serverFee), money(row.vendorCharge), money(row.vendorCost), money(vendorDiff(row)), money(row.manualAdd), money(row.manualDeduct), money(row.rechargeBonus), money(row.otherDeduction), money(actualIncome(row)), statusMap[row.status].label];
    });
    downloadCsv("平台收入_商户详表.csv", detailHeader, detailLines);
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.reset.addEventListener("click", function () {
      state.filters = { monthStart: "2026-05", monthEnd: "2026-05", merchant: "", status: "" };
      els.monthStart.value = "2026-05";
      els.monthEnd.value = "2026-05";
      els.merchant.value = "";
      els.status.value = "";
      state.page = 1;
      render();
    });

    els.exportBtn.addEventListener("click", exportCsv);
    els.tabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.view = button.getAttribute("data-view");
        render();
      });
    });

    els.paginationActions.addEventListener("click", function (event) {
      var page = event.target.getAttribute("data-page");
      if (!page) return;

      var pageCount = Math.max(1, Math.ceil(filteredRows().length / state.pageSize));
      if (page === "prev") state.page = Math.max(1, state.page - 1);
      else if (page === "next") state.page = Math.min(pageCount, state.page + 1);
      else state.page = Number(page);
      render();
    });
  }

  function init() {
    els = {
      monthStart: document.getElementById("filterMonthStart"),
      monthEnd: document.getElementById("filterMonthEnd"),
      merchant: document.getElementById("filterMerchant"),
      status: document.getElementById("filterStatus"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      tabButtons: Array.prototype.slice.call(document.querySelectorAll(".tab-btn")),
      overviewPanel: document.getElementById("overviewPanel"),
      detailPanel: document.getElementById("detailPanel"),
      overviewBody: document.getElementById("overviewBody"),
      detailBody: document.getElementById("detailBody"),
      overviewCount: document.getElementById("overviewCount"),
      detailCount: document.getElementById("detailCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      paginationActions: document.getElementById("paginationActions"),
      metricMonth: document.getElementById("metricMonth"),
      metricActualIncome: document.getElementById("metricActualIncome"),
      metricFixedFee: document.getElementById("metricFixedFee"),
      metricVendorDiff: document.getElementById("metricVendorDiff"),
      metricDeduction: document.getElementById("metricDeduction"),
      metricMerchantRecharge: document.getElementById("metricMerchantRecharge"),
      metricMerchantBalance: document.getElementById("metricMerchantBalance")
    };
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
