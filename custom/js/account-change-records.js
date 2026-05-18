(function () {
  var rows = [
    { no: "0d8520c8-d751-44e9-b570-438b0...", time: "2026-05-11 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -127827.16, amount: -539.4, after: -128366.56, source: "2026-05" },
    { no: "53f159d7-1b09-486c-9172-736c9...", time: "2026-05-10 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -120795.43, amount: -7031.73, after: -127827.16, source: "2026-05" },
    { no: "d3f77792-1162-43a0-ae67-ef1a24...", time: "2026-05-09 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -120697.83, amount: -97.6, after: -120795.43, source: "2026-05" },
    { no: "894483c2-e72f-43ca-b405-e5fb01...", time: "2026-05-08 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -70897.83, amount: -49800, after: -120697.83, source: "2026-05" },
    { no: "ff94e32f-6b69-463b-97a6-327246...", time: "2026-05-07 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -1297.43, amount: -69600.4, after: -70897.83, source: "2026-05" },
    { no: "9f40a5ba-ffe3-49eb-8f0a-1b0e743...", time: "2026-05-05 12:00:00", merchantId: "1", type: "商户月度账单结算", before: -96.22, amount: -1201.21, after: -1297.43, source: "2026-05" },
    { no: "5cf3a3e2-56fc-4a2b-b9ea-a8f0d1...", time: "2026-04-30 12:00:00", merchantId: "1", type: "商户月度账单结算", before: 703.78, amount: -800, after: -96.22, source: "2026-04" },
    { no: "98ba99b7-45b4-4095-a101-82cc9...", time: "2026-04-29 12:00:00", merchantId: "1", type: "商户月度账单结算", before: 704.18, amount: -0.4, after: 703.78, source: "2026-04" },
    { no: "4bb3f5c7-5cf8-45d6-8507-269154...", time: "2026-04-28 12:00:00", merchantId: "1", type: "商户月度账单结算", before: 705.38, amount: -1.2, after: 704.18, source: "2026-04" },
    { no: "63c3eb6f-6bd8-43f4-af86-3f71cec...", time: "2026-04-27 17:04:51", merchantId: "1", type: "商户人工补单", before: 605.38, amount: 100, after: 705.38, source: "admin" },
    { no: "0cde8f56-e3da-4dc4-a306-951a04...", time: "2026-04-27 16:39:19", merchantId: "1", type: "商户月度账单结算", before: 606.4, amount: -1.02, after: 605.38, source: "2026-04" }
  ];

  var filters = { type: "", merchantId: "" };
  var els = {};

  function amountText(value) {
    return String(value);
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!filters.type || row.type === filters.type)
        && (!filters.merchantId || row.merchantId.indexOf(filters.merchantId) >= 0);
    });
  }

  function render() {
    var list = filteredRows();
    els.body.innerHTML = list.map(function (row) {
      return "<tr>"
        + "<td title=\"" + row.no + "\">" + row.no + "</td>"
        + "<td>" + row.time + "</td>"
        + "<td>" + row.merchantId + "</td>"
        + "<td>" + row.type + "</td>"
        + "<td class=\"money\">" + amountText(row.before) + "</td>"
        + "<td class=\"amount " + (row.amount >= 0 ? "positive" : "negative") + "\">" + amountText(row.amount) + "</td>"
        + "<td class=\"money balance-after\">" + amountText(row.after) + "</td>"
        + "<td>" + row.source + "</td>"
        + "</tr>";
    }).join("") || "<tr><td colspan=\"8\">暂无数据</td></tr>";
    els.total.textContent = list.length;
  }

  function downloadCsv(filename, lines) {
    var csv = lines.map(function (line) {
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
    var lines = [["单号", "交易时间", "商户ID", "类型", "变动前余额", "变动金额", "变动后余额", "来源"]];
    filteredRows().forEach(function (row) {
      lines.push([row.no, row.time, row.merchantId, row.type, row.before, row.amount, row.after, row.source]);
    });
    downloadCsv("账变记录.csv", lines);
  }

  function bind() {
    els.search.addEventListener("click", function () {
      filters.type = els.type.value;
      filters.merchantId = els.merchant.value.trim();
      render();
    });
    els.reset.addEventListener("click", function () {
      filters = { type: "", merchantId: "" };
      els.type.value = "";
      els.merchant.value = "";
      els.start.value = "";
      els.end.value = "";
      render();
    });
    els.export.addEventListener("click", exportCsv);
  }

  function init() {
    els = {
      body: document.getElementById("recordBody"),
      total: document.getElementById("totalCount"),
      type: document.getElementById("changeType"),
      merchant: document.getElementById("merchantId"),
      start: document.getElementById("startTime"),
      end: document.getElementById("endTime"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      export: document.getElementById("exportBtn")
    };
    bind();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
