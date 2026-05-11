(function () {
  var rows = [
    { month: "2026-04", supplier: "Asia Matrix", vendor: "PG Soft", type: "SLOTS", rate: 0.003, users: 3250, bets: 183224, totalBet: 4869200, validBet: 4621800, payout: 4310250, profit: 311550, status: "wait" },
    { month: "2026-04", supplier: "Asia Matrix", vendor: "PG Soft", type: "TABLE", rate: 0.0025, users: 980, bets: 44218, totalBet: 1386000, validBet: 1329000, payout: 1268450, profit: 60550, status: "wait" },
    { month: "2026-04", supplier: "Asia Matrix", vendor: "JILI", type: "SLOTS", rate: 0.0032, users: 2786, bets: 121006, totalBet: 3328400, validBet: 3182200, payout: 2987600, profit: 194600, status: "wait" },
    { month: "2026-04", supplier: "Asia Matrix", vendor: "JILI", type: "ARCADE", rate: 0.0028, users: 1128, bets: 59023, totalBet: 1160200, validBet: 1098800, payout: 1025600, profit: 73200, status: "wait" },
    { month: "2026-04", supplier: "BetLink", vendor: "Evolution", type: "LIVE", rate: 0.004, users: 1664, bets: 78310, totalBet: 6420500, validBet: 6124700, payout: 5892200, profit: 232500, status: "done" },
    { month: "2026-04", supplier: "BetLink", vendor: "Pragmatic Play", type: "SLOTS", rate: 0.0035, users: 2190, bets: 104660, totalBet: 3912600, validBet: 3748000, payout: 3608800, profit: 139200, status: "done" },
    { month: "2026-04", supplier: "BetLink", vendor: "Pragmatic Play", type: "LIVE", rate: 0.0042, users: 810, bets: 32490, totalBet: 2028800, validBet: 1936400, payout: 2001200, profit: -64800, status: "diff" },
    { month: "2026-04", supplier: "Blue Ocean", vendor: "BTI", type: "SPORTS", rate: 0.002, users: 4120, bets: 139808, totalBet: 7823400, validBet: 7518200, payout: 7200400, profit: 317800, status: "wait" },
    { month: "2026-04", supplier: "Blue Ocean", vendor: "SABA", type: "SPORTS", rate: 0.0021, users: 3716, bets: 128920, totalBet: 7210900, validBet: 6894400, payout: 6635400, profit: 259000, status: "wait" },
    { month: "2026-04", supplier: "Nova Gaming", vendor: "CQ9", type: "SLOTS", rate: 0.003, users: 1890, bets: 92220, totalBet: 2210200, validBet: 2097600, payout: 1998500, profit: 99100, status: "done" },
    { month: "2026-04", supplier: "Nova Gaming", vendor: "Kingmaker", type: "CHESS", rate: 0.0038, users: 1024, bets: 28426, totalBet: 1728300, validBet: 1659000, payout: 1537000, profit: 122000, status: "done" },
    { month: "2026-03", supplier: "Asia Matrix", vendor: "PG Soft", type: "SLOTS", rate: 0.003, users: 2964, bets: 168904, totalBet: 4412400, validBet: 4219200, payout: 4017000, profit: 202200, status: "done" },
    { month: "2026-03", supplier: "Asia Matrix", vendor: "JILI", type: "SLOTS", rate: 0.0032, users: 2410, bets: 113204, totalBet: 3088700, validBet: 2954200, payout: 2830800, profit: 123400, status: "done" },
    { month: "2026-03", supplier: "BetLink", vendor: "Evolution", type: "LIVE", rate: 0.004, users: 1518, bets: 71602, totalBet: 5984400, validBet: 5720800, payout: 5493200, profit: 227600, status: "done" },
    { month: "2026-03", supplier: "Blue Ocean", vendor: "BTI", type: "SPORTS", rate: 0.002, users: 3808, bets: 131002, totalBet: 7066200, validBet: 6812500, payout: 6520100, profit: 292400, status: "done" }
  ];

  var state = {
    page: 1,
    pageSize: 5,
    expanded: {},
    filters: {
      supplier: "",
      vendor: "",
      type: "",
      month: "2026-04",
      status: ""
    }
  };

  var statusMap = {
    wait: { label: "待结算", className: "wait" },
    done: { label: "已结算", className: "done" },
    diff: { label: "差异待核", className: "diff" },
    mixed: { label: "混合状态", className: "wait" }
  };

  var els = {};

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function percent(value) {
    return (Number(value || 0) * 100).toFixed(2) + "%";
  }

  function calcFee(row) {
    return row.validBet * row.rate;
  }

  function optionList(field, baseRows) {
    var seen = {};
    return baseRows
      .map(function (row) { return row[field]; })
      .filter(function (value) {
        if (seen[value]) return false;
        seen[value] = true;
        return true;
      })
      .sort();
  }

  function setOptions(select, values, placeholder) {
    var current = select.value;
    select.innerHTML = "<option value=\"\">" + placeholder + "</option>" + values.map(function (value) {
      return "<option value=\"" + value + "\">" + value + "</option>";
    }).join("");

    if (values.indexOf(current) >= 0) {
      select.value = current;
    }
  }

  function syncOptions() {
    var supplierRows = rows;
    var vendorRows = rows.filter(function (row) {
      return !state.filters.supplier || row.supplier === state.filters.supplier;
    });
    var typeRows = vendorRows.filter(function (row) {
      return !state.filters.vendor || row.vendor === state.filters.vendor;
    });

    setOptions(els.supplier, optionList("supplier", supplierRows), "全部供应商");
    setOptions(els.vendor, optionList("vendor", vendorRows), "全部厂商");
    setOptions(els.type, optionList("type", typeRows), "全部游戏类型");

    els.supplier.value = state.filters.supplier;
    els.vendor.value = state.filters.vendor;
    els.type.value = state.filters.type;
    els.month.value = state.filters.month;
    els.status.value = state.filters.status;
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!state.filters.supplier || row.supplier === state.filters.supplier)
        && (!state.filters.vendor || row.vendor === state.filters.vendor)
        && (!state.filters.type || row.type === state.filters.type)
        && (!state.filters.month || row.month === state.filters.month)
        && (!state.filters.status || row.status === state.filters.status);
    });
  }

  function aggregate(list) {
    var grouped = {};

    list.forEach(function (row) {
      var key = row.month + "|" + row.supplier;
      if (!grouped[key]) {
        grouped[key] = {
          key: key,
          month: row.month,
          supplier: row.supplier,
          vendors: {},
          types: {},
          users: 0,
          bets: 0,
          totalBet: 0,
          validBet: 0,
          payout: 0,
          profit: 0,
          fee: 0,
          statuses: {},
          details: []
        };
      }

      grouped[key].vendors[row.vendor] = true;
      grouped[key].types[row.type] = true;
      grouped[key].users += row.users;
      grouped[key].bets += row.bets;
      grouped[key].totalBet += row.totalBet;
      grouped[key].validBet += row.validBet;
      grouped[key].payout += row.payout;
      grouped[key].profit += row.profit;
      grouped[key].fee += calcFee(row);
      grouped[key].statuses[row.status] = true;
      grouped[key].details.push(row);
    });

    return Object.keys(grouped).map(function (key) {
      var item = grouped[key];
      var statuses = Object.keys(item.statuses);
      item.vendorCount = Object.keys(item.vendors).length;
      item.typeCount = Object.keys(item.types).length;
      item.avgRate = item.validBet ? item.fee / item.validBet : 0;
      item.rtp = item.totalBet ? item.payout / item.totalBet : 0;
      item.status = statuses.length === 1 ? statuses[0] : "mixed";
      return item;
    }).sort(function (a, b) {
      if (a.month === b.month) return a.supplier.localeCompare(b.supplier);
      return b.month.localeCompare(a.month);
    });
  }

  function summaryMetrics(list) {
    var groups = aggregate(list);
    var totalFee = list.reduce(function (sum, row) { return sum + calcFee(row); }, 0);
    var validBet = list.reduce(function (sum, row) { return sum + row.validBet; }, 0);
    var profit = list.reduce(function (sum, row) { return sum + row.profit; }, 0);
    var waitCount = groups.filter(function (item) { return item.status === "wait" || item.status === "mixed" || item.status === "diff"; }).length;

    els.metricSupplier.textContent = groups.length;
    els.metricFee.textContent = "$" + money(totalFee);
    els.metricBet.textContent = "$" + money(validBet);
    els.metricWait.textContent = waitCount;
    els.metricProfit.textContent = "$" + money(profit);
    els.metricMonth.textContent = state.filters.month || "全部月份";
  }

  function statusTag(status) {
    var item = statusMap[status] || statusMap.wait;
    return "<span class=\"tag " + item.className + "\">" + item.label + "</span>";
  }

  function statusSelect(status, attrs) {
    var item = statusMap[status] || statusMap.wait;
    var options = ["wait", "done", "diff"].map(function (value) {
      var option = statusMap[value];
      return "<option value=\"" + value + "\"" + (value === status ? " selected" : "") + ">" + option.label + "</option>";
    }).join("");

    return "<select class=\"status-select " + item.className + "\" " + attrs + ">"
      + options
      + "</select>";
  }

  function detailRow(row) {
    var fee = calcFee(row);
    var rtp = row.totalBet ? row.payout / row.totalBet : 0;
    var profitClass = row.profit < 0 ? "negative" : "positive";

    return "<tr class=\"detail-row\">"
      + "<td></td>"
      + "<td><span class=\"detail-indent\">明细</span></td>"
      + "<td>" + row.month + "</td>"
      + "<td>" + row.vendor + "</td>"
      + "<td>" + row.type + "</td>"
      + "<td>" + percent(row.rate) + "</td>"
      + "<td>" + intText(row.users) + "</td>"
      + "<td>" + intText(row.bets) + "</td>"
      + "<td>$" + money(row.validBet) + "</td>"
      + "<td>" + percent(rtp) + "</td>"
      + "<td class=\"" + profitClass + "\">$" + money(row.profit) + "</td>"
      + "<td class=\"money\">$" + money(fee) + "</td>"
      + "<td>" + statusSelect(row.status, "data-detail-status=\"" + row.supplier + "|" + row.vendor + "|" + row.type + "|" + row.month + "\"") + "</td>"
      + "<td><button class=\"action-link\" type=\"button\">查看流水</button></td>"
      + "</tr>";
  }

  function summaryRow(item) {
    var isOpen = !!state.expanded[item.key];
    var profitClass = item.profit < 0 ? "negative" : "positive";
    var html = "<tr class=\"summary-row\">"
      + "<td class=\"expand-cell\"><button class=\"expand-btn " + (isOpen ? "is-open" : "") + "\" type=\"button\" data-expand=\"" + item.key + "\">" + (isOpen ? "-" : "+") + "</button></td>"
      + "<td><div class=\"supplier-name\"><span class=\"supplier-badge\">" + item.vendorCount + "</span>" + item.supplier + "</div></td>"
      + "<td>" + item.month + "</td>"
      + "<td>全部厂商</td>"
      + "<td>" + item.typeCount + " 类</td>"
      + "<td>" + percent(item.avgRate) + "</td>"
      + "<td>" + intText(item.users) + "</td>"
      + "<td>" + intText(item.bets) + "</td>"
      + "<td>$" + money(item.validBet) + "</td>"
      + "<td>" + percent(item.rtp) + "</td>"
      + "<td class=\"" + profitClass + "\">$" + money(item.profit) + "</td>"
      + "<td class=\"money\">$" + money(item.fee) + "</td>"
      + "<td>" + statusSelect(item.status === "mixed" ? "wait" : item.status, "data-summary-status=\"" + item.key + "\"") + "</td>"
      + "<td><button class=\"action-link\" type=\"button\" data-expand=\"" + item.key + "\">" + (isOpen ? "收起" : "展开") + "</button></td>"
      + "</tr>";

    if (isOpen) {
      html += item.details.map(detailRow).join("");
    }

    return html;
  }

  function renderPagination(total) {
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;

    var buttons = [];
    for (var i = 1; i <= pageCount; i += 1) {
      buttons.push("<button class=\"page-btn " + (i === state.page ? "active" : "") + "\" type=\"button\" data-page=\"" + i + "\">" + i + "</button>");
    }

    els.paginationInfo.textContent = "共 " + total + " 条供应商账单，当前第 " + state.page + " / " + pageCount + " 页";
    els.paginationActions.innerHTML = "<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>"
      + buttons.join("")
      + "<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>";
  }

  function render() {
    syncOptions();

    var list = filteredRows();
    var groups = aggregate(list);
    var start = (state.page - 1) * state.pageSize;
    var visibleGroups = groups.slice(start, start + state.pageSize);

    summaryMetrics(list);
    els.tableCount.textContent = groups.length + " 个供应商账单";

    if (!visibleGroups.length) {
      els.tableBody.innerHTML = "<tr><td colspan=\"14\"><div class=\"empty-state\">暂无符合条件的对账数据</div></td></tr>";
    } else {
      els.tableBody.innerHTML = visibleGroups.map(summaryRow).join("");
    }

    renderPagination(groups.length);
  }

  function readFilters() {
    state.filters.supplier = els.supplier.value;
    state.filters.vendor = els.vendor.value;
    state.filters.type = els.type.value;
    state.filters.month = els.month.value;
    state.filters.status = els.status.value;
  }

  function exportCsv() {
    var header = ["月份", "供应商", "厂商", "游戏类型", "费率", "投注人数", "投注次数", "总投注", "有效投注", "RTP", "线路盈利", "应付费用", "结算状态"];
    var lines = filteredRows().map(function (row) {
      var status = statusMap[row.status] || statusMap.wait;
      var rtp = row.totalBet ? row.payout / row.totalBet : 0;
      return [
        row.month,
        row.supplier,
        row.vendor,
        row.type,
        percent(row.rate),
        row.users,
        row.bets,
        money(row.totalBet),
        money(row.validBet),
        percent(rtp),
        money(row.profit),
        money(calcFee(row)),
        status.label
      ];
    });
    var csv = [header].concat(lines).map(function (line) {
      return line.map(function (value) {
        return "\"" + String(value).replace(/"/g, "\"\"") + "\"";
      }).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "游戏厂商对账表_" + (state.filters.month || "全部月份") + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      state.expanded = {};
      render();
    });

    els.reset.addEventListener("click", function () {
      state.filters = { supplier: "", vendor: "", type: "", month: "2026-04", status: "" };
      state.page = 1;
      state.expanded = {};
      render();
    });

    els.export.addEventListener("click", exportCsv);

    ["supplier", "vendor", "type", "month", "status"].forEach(function (name) {
      els[name].addEventListener("change", function () {
        readFilters();
        if (name === "supplier") {
          state.filters.vendor = "";
          state.filters.type = "";
        }
        if (name === "vendor") {
          state.filters.type = "";
        }
        state.page = 1;
        render();
      });
    });

    els.tableBody.addEventListener("click", function (event) {
      var key = event.target.getAttribute("data-expand");
      if (!key) return;
      state.expanded[key] = !state.expanded[key];
      render();
    });

    els.tableBody.addEventListener("change", function (event) {
      var detailKey = event.target.getAttribute("data-detail-status");
      var summaryKey = event.target.getAttribute("data-summary-status");
      var nextStatus = event.target.value;

      if (detailKey) {
        rows.forEach(function (row) {
          var rowKey = row.supplier + "|" + row.vendor + "|" + row.type + "|" + row.month;
          if (rowKey === detailKey) row.status = nextStatus;
        });
        render();
      }

      if (summaryKey) {
        rows.forEach(function (row) {
          if (row.month + "|" + row.supplier === summaryKey) row.status = nextStatus;
        });
        state.expanded[summaryKey] = true;
        render();
      }
    });

    els.paginationActions.addEventListener("click", function (event) {
      var target = event.target.getAttribute("data-page");
      if (!target) return;
      var pageCount = Math.max(1, Math.ceil(aggregate(filteredRows()).length / state.pageSize));

      if (target === "prev") state.page = Math.max(1, state.page - 1);
      else if (target === "next") state.page = Math.min(pageCount, state.page + 1);
      else state.page = Number(target);

      render();
    });
  }

  function init() {
    els = {
      supplier: document.getElementById("filterSupplier"),
      vendor: document.getElementById("filterVendor"),
      type: document.getElementById("filterType"),
      month: document.getElementById("filterMonth"),
      status: document.getElementById("filterStatus"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      export: document.getElementById("exportBtn"),
      tableBody: document.getElementById("reconciliationBody"),
      tableCount: document.getElementById("tableCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      paginationActions: document.getElementById("paginationActions"),
      metricSupplier: document.getElementById("metricSupplier"),
      metricFee: document.getElementById("metricFee"),
      metricBet: document.getElementById("metricBet"),
      metricWait: document.getElementById("metricWait"),
      metricProfit: document.getElementById("metricProfit"),
      metricMonth: document.getElementById("metricMonth")
    };

    bind();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
