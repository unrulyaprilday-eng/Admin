(function () {
  var rows = [
    { date: "2026-05-11", merchantId: "M10001", merchantName: "星河娱乐城", gameId: "G-SLOT-1001", gameName: "财富龙珠", supplier: "Asia Matrix", vendor: "PG Soft", type: "Slots", status: "normal", users: 3280, bets: 54210, totalBet: 1286800, validBet: 1229400, payout: 1135200 },
    { date: "2026-05-11", merchantId: "M10002", merchantName: "蓝海国际", gameId: "G-LIVE-2001", gameName: "极速百家乐", supplier: "BetLink", vendor: "Evolution", type: "Live", status: "normal", users: 2160, bets: 19840, totalBet: 1736200, validBet: 1668800, payout: 1602400 },
    { date: "2026-05-11", merchantId: "M10003", merchantName: "极光娱乐", gameId: "G-SP-3001", gameName: "冠军足球", supplier: "Blue Ocean", vendor: "BTI", type: "Sports", status: "normal", users: 1420, bets: 32680, totalBet: 2054200, validBet: 1968200, payout: 1884500 },
    { date: "2026-05-11", merchantId: "M10004", merchantName: "银石游戏", gameId: "G-ARC-4001", gameName: "飞鸟冲刺", supplier: "Asia Matrix", vendor: "JILI", type: "Arcade", status: "maintenance", users: 680, bets: 14320, totalBet: 328400, validBet: 311800, payout: 298100 },
    { date: "2026-05-12", merchantId: "M10001", merchantName: "星河娱乐城", gameId: "G-SLOT-1002", gameName: "深海宝藏", supplier: "Nova Gaming", vendor: "CQ9", type: "Slots", status: "normal", users: 2260, bets: 48720, totalBet: 1068200, validBet: 1015600, payout: 928400 },
    { date: "2026-05-12", merchantId: "M10005", merchantName: "云顶新娱", gameId: "G-SLOT-1001", gameName: "财富龙珠", supplier: "Asia Matrix", vendor: "PG Soft", type: "Slots", status: "normal", users: 1840, bets: 31860, totalBet: 842600, validBet: 806200, payout: 789300 },
    { date: "2026-05-12", merchantId: "M10006", merchantName: "盛世互动", gameId: "G-FISH-5001", gameName: "海王捕鱼", supplier: "Asia Matrix", vendor: "JILI", type: "Fishing", status: "normal", users: 960, bets: 26810, totalBet: 516800, validBet: 492400, payout: 451900 },
    { date: "2026-05-12", merchantId: "M10002", merchantName: "蓝海国际", gameId: "G-LIVE-2002", gameName: "旗舰厅轮盘", supplier: "BetLink", vendor: "Evolution", type: "Live", status: "maintenance", users: 720, bets: 6340, totalBet: 482600, validBet: 461200, payout: 475800 },
    { date: "2026-05-13", merchantId: "M10003", merchantName: "极光娱乐", gameId: "G-SP-3001", gameName: "冠军足球", supplier: "Blue Ocean", vendor: "BTI", type: "Sports", status: "normal", users: 1580, bets: 35120, totalBet: 2286400, validBet: 2191800, payout: 2059700 },
    { date: "2026-05-13", merchantId: "M10004", merchantName: "银石游戏", gameId: "G-ARC-4002", gameName: "糖果派对", supplier: "Nova Gaming", vendor: "CQ9", type: "Arcade", status: "normal", users: 620, bets: 18190, totalBet: 376200, validBet: 358600, payout: 331400 },
    { date: "2026-05-13", merchantId: "M10005", merchantName: "云顶新娱", gameId: "G-SLOT-1002", gameName: "深海宝藏", supplier: "Nova Gaming", vendor: "CQ9", type: "Slots", status: "normal", users: 1740, bets: 39260, totalBet: 916400, validBet: 872600, payout: 831900 },
    { date: "2026-05-13", merchantId: "M10001", merchantName: "星河娱乐城", gameId: "G-LIVE-2001", gameName: "极速百家乐", supplier: "BetLink", vendor: "Evolution", type: "Live", status: "normal", users: 2410, bets: 22980, totalBet: 1896200, validBet: 1817400, payout: 1760500 }
  ];

  var state = {
    page: 1,
    pageSize: 8,
    filters: {
      dateStart: "2026-05-11",
      dateEnd: "2026-05-13",
      merchant: "",
      supplier: "",
      vendor: "",
      type: "",
      game: "",
      status: ""
    }
  };
  var els = {};

  var statusMap = {
    normal: { label: "正常", className: "normal" },
    maintenance: { label: "维护中", className: "maintenance" }
  };

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function unique(list, key) {
    var seen = {};
    return list.map(function (row) { return row[key]; }).filter(function (value) {
      if (seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }

  function fillSelect(id, values) {
    var select = document.getElementById(id);
    var first = select.options[0].outerHTML;
    select.innerHTML = first + values.map(function (value) {
      return "<option value=\"" + value + "\">" + value + "</option>";
    }).join("");
  }

  function statusTag(value) {
    var item = statusMap[value] || statusMap.normal;
    return "<span class=\"tag " + item.className + "\">" + item.label + "</span>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      var merchant = state.filters.merchant.toLowerCase();
      var game = state.filters.game.toLowerCase();
      var merchantText = (row.merchantId + " " + row.merchantName).toLowerCase();
      var gameText = (row.gameId + " " + row.gameName).toLowerCase();

      return (!state.filters.dateStart || row.date >= state.filters.dateStart)
        && (!state.filters.dateEnd || row.date <= state.filters.dateEnd)
        && (!merchant || merchantText.indexOf(merchant) >= 0)
        && (!state.filters.supplier || row.supplier === state.filters.supplier)
        && (!state.filters.vendor || row.vendor === state.filters.vendor)
        && (!state.filters.type || row.type === state.filters.type)
        && (!game || gameText.indexOf(game) >= 0)
        && (!state.filters.status || row.status === state.filters.status);
    });
  }

  function aggregateRows(list) {
    var groups = {};
    list.forEach(function (row) {
      var key = [row.gameId, row.supplier, row.vendor, row.type, row.status].join("|");
      if (!groups[key]) {
        groups[key] = {
          gameId: row.gameId,
          gameName: row.gameName,
          supplier: row.supplier,
          vendor: row.vendor,
          type: row.type,
          status: row.status,
          merchants: {},
          users: 0,
          bets: 0,
          totalBet: 0,
          validBet: 0,
          payout: 0
        };
      }
      groups[key].merchants[row.merchantId] = true;
      groups[key].users += row.users;
      groups[key].bets += row.bets;
      groups[key].totalBet += row.totalBet;
      groups[key].validBet += row.validBet;
      groups[key].payout += row.payout;
    });

    return Object.keys(groups).map(function (key) {
      var row = groups[key];
      row.merchantCount = Object.keys(row.merchants).length;
      return row;
    }).sort(function (a, b) {
      return b.validBet - a.validBet;
    });
  }

  function updateMetrics(list) {
    var onlineGames = {};
    var users = 0;
    var validBet = 0;
    var loss = 0;

    list.forEach(function (row) {
      if (row.status === "normal") onlineGames[row.gameId] = true;
      users += row.users;
      validBet += row.validBet;
      loss += row.totalBet - row.payout;
    });

    els.metricOnlineGames.textContent = intText(Object.keys(onlineGames).length);
    els.metricUsers.textContent = intText(users);
    els.metricValidBet.textContent = "$" + money(validBet);
    els.metricLoss.textContent = "$" + money(loss);
  }

  function rowHtml(row) {
    var loss = row.totalBet - row.payout;
    var rtp = row.totalBet ? row.payout / row.totalBet * 100 : 0;
    var lossClass = loss < 0 ? "loss-negative" : "loss-positive";

    return "<tr>"
      + "<td>" + row.gameId + "</td>"
      + "<td><strong>" + row.gameName + "</strong></td>"
      + "<td>" + row.supplier + "</td>"
      + "<td>" + row.vendor + "</td>"
      + "<td>" + row.type + "</td>"
      + "<td class=\"number\">" + intText(row.merchantCount) + "</td>"
      + "<td class=\"number\">" + intText(row.users) + "</td>"
      + "<td class=\"number\">" + intText(row.bets) + "</td>"
      + "<td class=\"money\">$" + money(row.totalBet) + "</td>"
      + "<td class=\"money\">$" + money(row.validBet) + "</td>"
      + "<td class=\"money\">$" + money(row.payout) + "</td>"
      + "<td class=\"rate\">" + rtp.toFixed(2) + "%</td>"
      + "<td class=\"money " + lossClass + "\">$" + money(loss) + "</td>"
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

    els.paginationInfo.textContent = "共 " + total + " 条游戏统计，当前第 " + state.page + " / " + pageCount + " 页";
    els.paginationActions.innerHTML = "<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>"
      + buttons.join("")
      + "<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>";
  }

  function render() {
    var rawList = filteredRows();
    var list = aggregateRows(rawList);
    var start = (state.page - 1) * state.pageSize;
    var pageRows = list.slice(start, start + state.pageSize);

    updateMetrics(rawList);
    els.tableCount.textContent = list.length + " 条游戏统计";
    els.statBody.innerHTML = pageRows.map(rowHtml).join("") || "<tr><td colspan=\"14\" style=\"text-align:center;height:88px;color:#6b7789;\">暂无数据</td></tr>";
    renderPagination(list.length);
  }

  function readFilters() {
    state.filters.dateStart = els.dateStart.value;
    state.filters.dateEnd = els.dateEnd.value;
    state.filters.merchant = els.merchant.value.trim();
    state.filters.supplier = els.supplier.value;
    state.filters.vendor = els.vendor.value;
    state.filters.type = els.type.value;
    state.filters.game = els.game.value.trim();
    state.filters.status = els.status.value;
  }

  function reset() {
    state.filters = {
      dateStart: "2026-05-11",
      dateEnd: "2026-05-13",
      merchant: "",
      supplier: "",
      vendor: "",
      type: "",
      game: "",
      status: ""
    };
    els.dateStart.value = state.filters.dateStart;
    els.dateEnd.value = state.filters.dateEnd;
    els.merchant.value = "";
    els.supplier.value = "";
    els.vendor.value = "";
    els.type.value = "";
    els.game.value = "";
    els.status.value = "";
    state.page = 1;
    render();
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
    var header = ["游戏ID", "游戏名称", "供应商", "厂商", "游戏类型", "商户数", "投注人数", "注单数", "总投注", "有效投注", "派彩", "RTP", "客损", "游戏状态"];
    var lines = aggregateRows(filteredRows()).map(function (row) {
      var loss = row.totalBet - row.payout;
      var rtp = row.totalBet ? row.payout / row.totalBet * 100 : 0;
      return [row.gameId, row.gameName, row.supplier, row.vendor, row.type, row.merchantCount, row.users, row.bets, money(row.totalBet), money(row.validBet), money(row.payout), rtp.toFixed(2) + "%", money(loss), statusMap[row.status].label];
    });
    downloadCsv("游戏统计.csv", header, lines);
  }

  function bind() {
    els.searchBtn.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.resetBtn.addEventListener("click", reset);
    els.exportBtn.addEventListener("click", exportCsv);

    els.paginationActions.addEventListener("click", function (event) {
      var page = event.target.getAttribute("data-page");
      if (!page) return;

      var pageCount = Math.max(1, Math.ceil(aggregateRows(filteredRows()).length / state.pageSize));
      if (page === "prev") state.page = Math.max(1, state.page - 1);
      else if (page === "next") state.page = Math.min(pageCount, state.page + 1);
      else state.page = Number(page);
      render();
    });
  }

  function init() {
    els = {
      dateStart: document.getElementById("dateStart"),
      dateEnd: document.getElementById("dateEnd"),
      merchant: document.getElementById("filterMerchant"),
      supplier: document.getElementById("filterSupplier"),
      vendor: document.getElementById("filterVendor"),
      type: document.getElementById("filterType"),
      game: document.getElementById("filterGame"),
      status: document.getElementById("filterStatus"),
      searchBtn: document.getElementById("searchBtn"),
      resetBtn: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      statBody: document.getElementById("statBody"),
      tableCount: document.getElementById("tableCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      paginationActions: document.getElementById("paginationActions"),
      metricOnlineGames: document.getElementById("metricOnlineGames"),
      metricUsers: document.getElementById("metricUsers"),
      metricValidBet: document.getElementById("metricValidBet"),
      metricLoss: document.getElementById("metricLoss")
    };

    fillSelect("filterSupplier", unique(rows, "supplier"));
    fillSelect("filterVendor", unique(rows, "vendor"));
    fillSelect("filterType", unique(rows, "type"));
    bind();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
