(function () {
  var rows = [
    { date: "2026-05-11", merchantId: "M10001", name: "星河娱乐城", sites: 12, balance: 864220, activeMembers: 12840, depositUsers: 8730, betUsers: 11680, recharge: 1586000, withdraw: 1194200, validBet: 6412000, totalLoss: 446000, risk: "normal" },
    { date: "2026-05-11", merchantId: "M10002", name: "蓝海国际", sites: 9, balance: 526800, activeMembers: 9160, depositUsers: 6120, betUsers: 8420, recharge: 1129000, withdraw: 842600, validBet: 4629000, totalLoss: 333000, risk: "warning" },
    { date: "2026-05-11", merchantId: "M10003", name: "极光娱乐", sites: 7, balance: 286400, activeMembers: 5720, depositUsers: 3510, betUsers: 4980, recharge: 724000, withdraw: 538600, validBet: 2962000, totalLoss: 213000, risk: "normal" },
    { date: "2026-05-11", merchantId: "M10004", name: "银石游戏", sites: 5, balance: 188900, activeMembers: 2210, depositUsers: 1210, betUsers: 1840, recharge: 318000, withdraw: 302600, validBet: 1095000, totalLoss: 21880, risk: "danger" },
    { date: "2026-05-10", merchantId: "M10001", name: "星河娱乐城", sites: 12, balance: 841600, activeMembers: 12180, depositUsers: 8260, betUsers: 11040, recharge: 1462000, withdraw: 1088600, validBet: 6088000, totalLoss: 421000, risk: "normal" },
    { date: "2026-05-10", merchantId: "M10002", name: "蓝海国际", sites: 9, balance: 504300, activeMembers: 8740, depositUsers: 5480, betUsers: 7560, recharge: 986000, withdraw: 742400, validBet: 4075000, totalLoss: 286000, risk: "warning" },
    { date: "2026-05-10", merchantId: "M10005", name: "云顶新娱", sites: 8, balance: 412500, activeMembers: 7380, depositUsers: 4890, betUsers: 6680, recharge: 916000, withdraw: 688400, validBet: 3996000, totalLoss: 270800, risk: "normal" },
    { date: "2026-05-10", merchantId: "M10006", name: "盛世互动", sites: 3, balance: 96200, activeMembers: 1360, depositUsers: 740, betUsers: 1120, recharge: 182000, withdraw: 137600, validBet: 711000, totalLoss: 62100, risk: "warning" }
  ];

  var state = {
    page: 1,
    pageSize: 6,
    filters: {
      keyword: "",
      risk: "",
      dateStart: "",
      dateEnd: ""
    }
  };

  var els = {};

  var riskMap = {
    normal: { label: "正常", className: "normal" },
    warning: { label: "关注", className: "warning" },
    danger: { label: "高风险", className: "danger" }
  };

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function statusTag(value) {
    var item = riskMap[value] || riskMap.normal;
    return "<span class=\"tag " + item.className + "\">" + item.label + "</span>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      var keyword = state.filters.keyword.toLowerCase();
      var matchKeyword = !keyword || row.merchantId.toLowerCase().indexOf(keyword) >= 0 || row.name.toLowerCase().indexOf(keyword) >= 0;

      return matchKeyword
        && (!state.filters.risk || row.risk === state.filters.risk)
        && (!state.filters.dateStart || row.date >= state.filters.dateStart)
        && (!state.filters.dateEnd || row.date <= state.filters.dateEnd);
    });
  }

  function uniqueMerchantCount(list) {
    var map = {};
    list.forEach(function (row) { map[row.merchantId] = true; });
    return Object.keys(map).length;
  }

  function updateMetrics(list) {
    var recharge = list.reduce(function (sum, row) { return sum + row.recharge; }, 0);
    var activeMembers = list.reduce(function (sum, row) { return sum + row.activeMembers; }, 0);
    var totalLoss = list.reduce(function (sum, row) { return sum + row.totalLoss; }, 0);

    els.metricMerchant.textContent = intText(uniqueMerchantCount(list));
    els.metricActiveMembers.textContent = intText(activeMembers);
    els.metricDeposit.textContent = "$" + money(recharge);
    els.metricTotalLoss.textContent = "$" + money(totalLoss);
  }

  function rowHtml(row) {
    return "<tr>"
      + "<td>" + row.date + "</td>"
      + "<td>" + row.merchantId + "</td>"
      + "<td><strong>" + row.name + "</strong></td>"
      + "<td>" + intText(row.sites) + "</td>"
      + "<td class=\"money\">$" + money(row.balance) + "</td>"
      + "<td>" + intText(row.activeMembers) + "</td>"
      + "<td>" + intText(row.depositUsers) + "</td>"
      + "<td>" + intText(row.betUsers) + "</td>"
      + "<td class=\"money\">$" + money(row.recharge) + "</td>"
      + "<td class=\"money\">$" + money(row.withdraw) + "</td>"
      + "<td class=\"money\">$" + money(row.validBet) + "</td>"
      + "<td class=\"money\">$" + money(row.totalLoss) + "</td>"
      + "<td>" + statusTag(row.risk) + "</td>"
      + "</tr>";
  }

  function renderPagination(total) {
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;

    var buttons = [];
    for (var i = 1; i <= pageCount; i += 1) {
      buttons.push("<button class=\"page-btn " + (i === state.page ? "active" : "") + "\" type=\"button\" data-page=\"" + i + "\">" + i + "</button>");
    }

    els.paginationInfo.textContent = "共 " + total + " 条日统计数据，当前第 " + state.page + " / " + pageCount + " 页";
    els.paginationActions.innerHTML = "<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>"
      + buttons.join("")
      + "<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>";
  }

  function render() {
    var list = filteredRows();
    var start = (state.page - 1) * state.pageSize;
    var pageRows = list.slice(start, start + state.pageSize);

    updateMetrics(list);
    els.tableCount.textContent = list.length + " 条日统计";
    els.tableBody.innerHTML = pageRows.map(rowHtml).join("") || "<tr><td colspan=\"13\" style=\"text-align:center;height:88px;color:#6b7789;\">暂无数据</td></tr>";
    renderPagination(list.length);
  }

  function readFilters() {
    state.filters.keyword = els.keyword.value;
    state.filters.risk = els.risk.value;
    state.filters.dateStart = els.dateStart.value;
    state.filters.dateEnd = els.dateEnd.value;
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
    var header = ["日期", "商户ID", "商户名称", "子站点数", "可用余额", "活跃会员", "充值人数", "投注人数", "用户充值", "提现金额", "有效投注", "总客损", "风控状态"];
    var lines = filteredRows().map(function (row) {
      return [row.date, row.merchantId, row.name, row.sites, money(row.balance), row.activeMembers, row.depositUsers, row.betUsers, money(row.recharge), money(row.withdraw), money(row.validBet), money(row.totalLoss), riskMap[row.risk].label];
    });
    downloadCsv("商户数据_日统计.csv", header, lines);
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.reset.addEventListener("click", function () {
      state.filters = { keyword: "", risk: "", dateStart: "", dateEnd: "" };
      els.keyword.value = "";
      els.risk.value = "";
      els.dateStart.value = "";
      els.dateEnd.value = "";
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
      keyword: document.getElementById("filterKeyword"),
      risk: document.getElementById("filterRisk"),
      dateStart: document.getElementById("filterDateStart"),
      dateEnd: document.getElementById("filterDateEnd"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      tableBody: document.getElementById("merchantTableBody"),
      tableCount: document.getElementById("tableCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      paginationActions: document.getElementById("paginationActions"),
      metricMerchant: document.getElementById("metricMerchant"),
      metricActiveMembers: document.getElementById("metricActiveMembers"),
      metricDeposit: document.getElementById("metricDeposit"),
      metricTotalLoss: document.getElementById("metricTotalLoss")
    };
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
