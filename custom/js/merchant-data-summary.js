(function () {
  var rows = [
    { period: "2026-05", merchantId: "M10001", name: "星河娱乐城", recharge: 1586000, merchantRechargeU: 1586000, withdraw: 1194200, validBet: 6412000, betUsers: 11680, totalLoss: 446000 },
    { period: "2026-05", merchantId: "M10002", name: "蓝海国际", recharge: 1129000, merchantRechargeU: 1129000, withdraw: 842600, validBet: 4629000, betUsers: 8420, totalLoss: 333000 },
    { period: "2026-05", merchantId: "M10003", name: "极光娱乐", recharge: 724000, merchantRechargeU: 724000, withdraw: 538600, validBet: 2962000, betUsers: 4980, totalLoss: 213000 },
    { period: "2026-05", merchantId: "M10004", name: "银石游戏", recharge: 318000, merchantRechargeU: 318000, withdraw: 302600, validBet: 1095000, betUsers: 1840, totalLoss: 21880 },
    { period: "2026-04", merchantId: "M10001", name: "星河娱乐城", recharge: 1462000, merchantRechargeU: 1462000, withdraw: 1088600, validBet: 6088000, betUsers: 10880, totalLoss: 421000 },
    { period: "2026-04", merchantId: "M10002", name: "蓝海国际", recharge: 986000, merchantRechargeU: 986000, withdraw: 742400, validBet: 4075000, betUsers: 7560, totalLoss: 286000 },
    { period: "2026-04", merchantId: "M10005", name: "云顶新娱", recharge: 916000, merchantRechargeU: 916000, withdraw: 688400, validBet: 3996000, betUsers: 6680, totalLoss: 270800 },
    { period: "2026-04", merchantId: "M10006", name: "盛世互动", recharge: 182000, merchantRechargeU: 182000, withdraw: 137600, validBet: 711000, betUsers: 1120, totalLoss: 62100 }
  ];

  var state = {
    page: 1,
    pageSize: 6,
    filters: {
      monthStart: "2026-05",
      monthEnd: "2026-05",
      merchantId: ""
    }
  };

  var els = {};

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function depositWithdrawDiff(row) {
    return row.recharge - row.withdraw;
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!state.filters.monthStart || row.period >= state.filters.monthStart)
        && (!state.filters.monthEnd || row.period <= state.filters.monthEnd)
        && (!state.filters.merchantId || row.merchantId.indexOf(state.filters.merchantId) >= 0);
    });
  }

  function updateMetrics(list) {
    var recharge = list.reduce(function (sum, row) { return sum + row.recharge; }, 0);
    var withdraw = list.reduce(function (sum, row) { return sum + row.withdraw; }, 0);
    var merchantRecharge = list.reduce(function (sum, row) { return sum + row.merchantRechargeU; }, 0);
    var totalLoss = list.reduce(function (sum, row) { return sum + row.totalLoss; }, 0);

    els.metricMerchantRecharge.textContent = "$" + money(merchantRecharge);
    els.metricRecharge.textContent = "$" + money(recharge);
    els.metricDiff.textContent = "$" + money(recharge - withdraw);
    els.metricTotalLoss.textContent = "$" + money(totalLoss);
  }

  function rowHtml(row) {
    var diff = depositWithdrawDiff(row);
    var diffClass = diff < 0 ? "negative" : "positive";

    return "<tr>"
      + "<td>" + row.period + "</td>"
      + "<td>" + row.merchantId + "</td>"
      + "<td><strong>" + row.name + "</strong></td>"
      + "<td class=\"money\">$" + money(row.merchantRechargeU) + "</td>"
      + "<td class=\"money\">$" + money(row.recharge) + "</td>"
      + "<td class=\"money\">$" + money(row.withdraw) + "</td>"
      + "<td class=\"" + diffClass + "\">$" + money(diff) + "</td>"
      + "<td class=\"money\">$" + money(row.validBet) + "</td>"
      + "<td>" + intText(row.betUsers) + "</td>"
      + "<td class=\"money\">$" + money(row.totalLoss) + "</td>"
      + "</tr>";
  }

  function renderPagination(total) {
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;

    var buttons = [];
    for (var i = 1; i <= pageCount; i += 1) {
      buttons.push("<button class=\"page-btn " + (i === state.page ? "active" : "") + "\" type=\"button\" data-page=\"" + i + "\">" + i + "</button>");
    }

    els.paginationInfo.textContent = "共 " + total + " 条月统计数据，当前第 " + state.page + " / " + pageCount + " 页";
    els.paginationActions.innerHTML = "<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>"
      + buttons.join("")
      + "<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>";
  }

  function render() {
    var list = filteredRows();
    var start = (state.page - 1) * state.pageSize;
    var pageRows = list.slice(start, start + state.pageSize);

    updateMetrics(list);
    els.tableCount.textContent = list.length + " 条月统计";
    els.tableBody.innerHTML = pageRows.map(rowHtml).join("") || "<tr><td colspan=\"10\" style=\"text-align:center;height:88px;color:#6b7789;\">暂无数据</td></tr>";
    renderPagination(list.length);
  }

  function readFilters() {
    state.filters.monthStart = els.monthStart.value;
    state.filters.monthEnd = els.monthEnd.value;
    state.filters.merchantId = els.merchantId.value;
  }

  function exportCsv() {
    var header = ["月份", "商户ID", "商户名称", "商户充值(U)", "用户充值", "提现金额", "充提差", "有效投注", "投注人数", "总客损"];
    var lines = filteredRows().map(function (row) {
      return [row.period, row.merchantId, row.name, money(row.merchantRechargeU), money(row.recharge), money(row.withdraw), money(depositWithdrawDiff(row)), money(row.validBet), row.betUsers, money(row.totalLoss)];
    });
    var csv = [header].concat(lines).map(function (line) {
      return line.map(function (value) { return "\"" + String(value).replace(/"/g, "\"\"") + "\""; }).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "商户数据汇总_月统计.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.reset.addEventListener("click", function () {
      state.filters = { monthStart: "2026-05", monthEnd: "2026-05", merchantId: "" };
      els.monthStart.value = "2026-05";
      els.monthEnd.value = "2026-05";
      els.merchantId.value = "";
      state.page = 1;
      render();
    });

    els.exportBtn.addEventListener("click", exportCsv);

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
      merchantId: document.getElementById("filterMerchantId"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      tableBody: document.getElementById("summaryTableBody"),
      tableCount: document.getElementById("tableCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      paginationActions: document.getElementById("paginationActions"),
      metricMerchantRecharge: document.getElementById("metricMerchantRecharge"),
      metricRecharge: document.getElementById("metricRecharge"),
      metricDiff: document.getElementById("metricDiff"),
      metricTotalLoss: document.getElementById("metricTotalLoss")
    };
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
