(function () {
  var rows = [
    { merchantId: "M10001", merchantName: "星河娱乐城", supplier: "Asia Matrix", vendor: "PG Soft", type: "Slots", users: 11680, bets: 183224, totalBet: 4869200, validBet: 4621800, payout: 4310250 },
    { merchantId: "M10002", merchantName: "蓝海国际", supplier: "BetLink", vendor: "Evolution", type: "Live", users: 8420, bets: 78310, totalBet: 6420500, validBet: 6124700, payout: 5892200 },
    { merchantId: "M10003", merchantName: "极光娱乐", supplier: "Blue Ocean", vendor: "BTI", type: "Sports", users: 4980, bets: 139808, totalBet: 7823400, validBet: 7518200, payout: 7200400 },
    { merchantId: "M10004", merchantName: "银石游戏", supplier: "Asia Matrix", vendor: "JILI", type: "Arcade", users: 1840, bets: 59023, totalBet: 1160200, validBet: 1098800, payout: 1025600 },
    { merchantId: "M10005", merchantName: "云顶新娱", supplier: "Nova Gaming", vendor: "CQ9", type: "Slots", users: 1890, bets: 92220, totalBet: 2210200, validBet: 2097600, payout: 1998500 }
  ];

  var state = { merchant: "", supplier: "", vendor: "", type: "" };

  function money(value) {
    return Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function unique(list, key) {
    var seen = {};
    return list.map(function (row) { return row[key]; }).filter(function (value) {
      if (seen[value]) {
        return false;
      }
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

  function filteredRows() {
    var merchant = state.merchant.toLowerCase();
    return rows.filter(function (row) {
      var merchantText = (row.merchantId + " " + row.merchantName).toLowerCase();
      return (!merchant || merchantText.indexOf(merchant) > -1)
        && (!state.supplier || row.supplier === state.supplier)
        && (!state.vendor || row.vendor === state.vendor)
        && (!state.type || row.type === state.type);
    });
  }

  function aggregateRows(list) {
    var groups = {};
    list.forEach(function (row) {
      var key = [row.supplier, row.vendor, row.type].join("|");
      if (!groups[key]) {
        groups[key] = {
          supplier: row.supplier,
          vendor: row.vendor,
          type: row.type,
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
    });
  }

  function renderMetrics(list) {
    var users = list.reduce(function (sum, row) { return sum + row.users; }, 0);
    var validBet = list.reduce(function (sum, row) { return sum + row.validBet; }, 0);
    var loss = list.reduce(function (sum, row) { return sum + row.totalBet - row.payout; }, 0);
    document.getElementById("metricUsers").textContent = intText(users);
    document.getElementById("metricValidBet").textContent = "$" + money(validBet);
    document.getElementById("metricLoss").textContent = "$" + money(loss);
  }

  function renderTable() {
    var list = aggregateRows(filteredRows());
    var html = list.map(function (row) {
      var loss = row.totalBet - row.payout;
      var rtp = row.totalBet ? (row.payout / row.totalBet * 100).toFixed(2) + "%" : "0.00%";
      return "<tr>"
        + "<td>" + row.supplier + "</td>"
        + "<td>" + row.vendor + "</td>"
        + "<td>" + row.type + "</td>"
        + "<td class=\"number\">" + intText(row.merchantCount) + "</td>"
        + "<td class=\"number\">" + intText(row.users) + "</td>"
        + "<td class=\"number\">" + intText(row.bets) + "</td>"
        + "<td class=\"money\">$" + money(row.totalBet) + "</td>"
        + "<td class=\"money\">$" + money(row.validBet) + "</td>"
        + "<td class=\"money\">$" + money(row.payout) + "</td>"
        + "<td>" + rtp + "</td>"
        + "<td class=\"money\">$" + money(loss) + "</td>"
        + "</tr>";
    }).join("");
    document.getElementById("statBody").innerHTML = html;
    document.getElementById("tableCount").textContent = list.length + " 条统计";
    renderMetrics(list);
  }

  function search() {
    state.merchant = document.getElementById("filterMerchant").value.trim();
    state.supplier = document.getElementById("filterSupplier").value;
    state.vendor = document.getElementById("filterVendor").value;
    state.type = document.getElementById("filterType").value;
    renderTable();
  }

  function reset() {
    state = { merchant: "", supplier: "", vendor: "", type: "" };
    document.getElementById("filterMerchant").value = "";
    document.getElementById("filterSupplier").value = "";
    document.getElementById("filterVendor").value = "";
    document.getElementById("filterType").value = "";
    renderTable();
  }

  function exportCsv() {
    var header = ["供应商", "厂商", "游戏类型", "商户数", "投注人数", "注单数", "总投注", "有效投注", "派彩", "RTP", "客损"];
    var lines = aggregateRows(filteredRows()).map(function (row) {
      var loss = row.totalBet - row.payout;
      var rtp = row.totalBet ? (row.payout / row.totalBet * 100).toFixed(2) + "%" : "0.00%";
      return [row.supplier, row.vendor, row.type, row.merchantCount, row.users, row.bets, money(row.totalBet), money(row.validBet), money(row.payout), rtp, money(loss)];
    });
    var csv = [header].concat(lines).map(function (line) {
      return line.map(function (item) { return "\"" + String(item).replace(/"/g, "\"\"") + "\""; }).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "游戏厂商统计.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillSelect("filterSupplier", unique(rows, "supplier"));
    fillSelect("filterVendor", unique(rows, "vendor"));
    fillSelect("filterType", unique(rows, "type"));
    renderTable();
    document.getElementById("searchBtn").addEventListener("click", search);
    document.getElementById("resetBtn").addEventListener("click", reset);
    document.getElementById("exportBtn").addEventListener("click", exportCsv);
  });
})();
