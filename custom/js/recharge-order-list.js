(function () {
  var rows = [
    { orderNo: "RC202606220001", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-22 09:18:26", arrivedAt: "2026-06-22 09:20:11", date: "2026-06-22", merchantId: "M10001", merchantName: "星河娱乐城", orderAmount: 50000, actualAmount: 50500, bonusAmount: 500, balanceAfter: 286420.55, status: "success", applicant: "SKY.ONE Alpha", address: "TRON-TT9v3mK4aE8f2a" },
    { orderNo: "RC202606220002", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-22 10:06:15", arrivedAt: "2026-06-22 10:09:41", date: "2026-06-22", merchantId: "M10003", merchantName: "极光娱乐", orderAmount: 80000, actualAmount: 81600, bonusAmount: 1600, balanceAfter: 513780.2, status: "success", applicant: "NOVA.LINK Beta", address: "ERC20-0x8af89b34ce91d4" },
    { orderNo: "RC202606220003", orderType: "manual", typeName: "人工补单", createdAt: "2026-06-22 11:23:08", arrivedAt: "2026-06-22 11:24:02", date: "2026-06-22", merchantId: "M10008", merchantName: "银翼国际", orderAmount: 20000, actualAmount: 20000, bonusAmount: 0, balanceAfter: 96208, status: "success", applicant: "CORE.NET Gamma", address: "TRON-TQ2h11Mb9f1b6k" },
    { orderNo: "RC202606210017", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-21 17:15:49", arrivedAt: "2026-06-21 17:19:12", date: "2026-06-21", merchantId: "M10002", merchantName: "蓝海国际", orderAmount: 30000, actualAmount: 30300, bonusAmount: 300, balanceAfter: 184662.88, status: "success", applicant: "ARC.AIS Delta", address: "TRON-TL5s9Ad31c7e0d" },
    { orderNo: "RC202606210016", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-21 16:08:25", arrivedAt: "2026-06-21 16:12:56", date: "2026-06-21", merchantId: "M10005", merchantName: "云顶新娱", orderAmount: 120000, actualAmount: 123600, bonusAmount: 3600, balanceAfter: 642310, status: "success", applicant: "GRID.FLOW Echo", address: "ERC20-0x7120cf6ad9843b" },
    { orderNo: "RC202606210015", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-21 14:33:09", arrivedAt: "2026-06-21 14:34:55", date: "2026-06-21", merchantId: "M10006", merchantName: "盛世互动", orderAmount: 15000, actualAmount: 15000, bonusAmount: 0, balanceAfter: 88200.5, status: "closed", applicant: "BYTE.WAVE Foxtrot", address: "TRON-TY6p7Ku49be203" },
    { orderNo: "RC202606200012", orderType: "manual", typeName: "人工补单", createdAt: "2026-06-20 19:12:47", arrivedAt: "", date: "2026-06-20", merchantId: "M10004", merchantName: "银石游戏", orderAmount: 40000, actualAmount: 40000, bonusAmount: 0, balanceAfter: 220540.1, status: "failed", applicant: "LINK.NODE Sigma", address: "TRON-TA91xY4cb26a71" },
    { orderNo: "RC202606200011", orderType: "normal", typeName: "普通充值", createdAt: "2026-06-20 12:41:16", arrivedAt: "2026-06-20 12:43:08", date: "2026-06-20", merchantId: "M10009", merchantName: "东誉平台", orderAmount: 60000, actualAmount: 60600, bonusAmount: 600, balanceAfter: 340980.44, status: "success", applicant: "META.HUB Orion", address: "ERC20-0xd1829bc5410e73" }
  ];

  var state = {
    page: 1,
    pageSize: 5,
    filters: {
      startTime: "2026-06-01",
      endTime: "2026-06-22",
      merchantId: "",
      orderNo: "",
      status: "",
      orderType: ""
    }
  };

  var statusMap = {
    success: { label: "充值成功", className: "success" },
    failed: { label: "充值失败", className: "failed" },
    closed: { label: "已关闭", className: "closed" }
  };

  var els = {};

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!state.filters.startTime || row.date >= state.filters.startTime)
        && (!state.filters.endTime || row.date <= state.filters.endTime)
        && (!state.filters.merchantId || row.merchantId.toLowerCase().indexOf(state.filters.merchantId) >= 0)
        && (!state.filters.orderNo || row.orderNo.toLowerCase().indexOf(state.filters.orderNo) >= 0)
        && (!state.filters.status || row.status === state.filters.status)
        && (!state.filters.orderType || row.orderType === state.filters.orderType);
    });
  }

  function statusTag(status) {
    var item = statusMap[status] || statusMap.success;
    return "<span class=\"status-tag " + item.className + "\">" + item.label + "</span>";
  }

  function rowHtml(row) {
    return "<tr>"
      + "<td>" + row.orderNo + "</td>"
      + "<td>" + row.typeName + "</td>"
      + "<td>" + row.createdAt + "</td>"
      + "<td>" + (row.arrivedAt || "-") + "</td>"
      + "<td>" + row.merchantId + "</td>"
      + "<td><strong>" + row.merchantName + "</strong></td>"
      + "<td class=\"money\">" + money(row.orderAmount) + "</td>"
      + "<td class=\"money\">" + money(row.actualAmount) + "</td>"
      + "<td class=\"bonus\">" + money(row.bonusAmount) + "</td>"
      + "<td class=\"money\">" + money(row.balanceAfter) + "</td>"
      + "<td>" + statusTag(row.status) + "</td>"
      + "<td>" + row.applicant + "</td>"
      + "<td class=\"address-cell\" title=\"" + row.address + "\">" + row.address + "</td>"
      + "<td><button class=\"link-btn\" type=\"button\" data-order=\"" + row.orderNo + "\">详情</button></td>"
      + "</tr>";
  }

  function renderPager(total) {
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pageCount) {
      state.page = pageCount;
    }

    var html = [];
    html.push("<button class=\"page-btn\" type=\"button\" data-page=\"prev\" " + (state.page === 1 ? "disabled" : "") + ">上一页</button>");
    for (var i = 1; i <= pageCount; i += 1) {
      html.push("<button class=\"page-btn " + (i === state.page ? "active" : "") + "\" type=\"button\" data-page=\"" + i + "\">" + i + "</button>");
    }
    html.push("<button class=\"page-btn\" type=\"button\" data-page=\"next\" " + (state.page === pageCount ? "disabled" : "") + ">下一页</button>");
    els.pager.innerHTML = html.join("");
  }

  function render() {
    var list = filteredRows();
    var start = (state.page - 1) * state.pageSize;
    var pageRows = list.slice(start, start + state.pageSize);

    els.body.innerHTML = pageRows.map(rowHtml).join("") || "<tr><td colspan=\"14\" style=\"height: 96px; color: #8a97a8;\">暂无数据</td></tr>";
    els.summary.textContent = "共 " + list.length + " 条充值订单";
    renderPager(list.length);
  }

  function readFilters() {
    state.filters.startTime = els.startTime.value;
    state.filters.endTime = els.endTime.value;
    state.filters.merchantId = els.merchantId.value.trim().toLowerCase();
    state.filters.orderNo = els.orderNo.value.trim().toLowerCase();
    state.filters.status = els.status.value;
    state.filters.orderType = els.orderType.value;
  }

  function resetFilters() {
    state.filters = {
      startTime: "2026-06-01",
      endTime: "2026-06-22",
      merchantId: "",
      orderNo: "",
      status: "",
      orderType: ""
    };
    els.startTime.value = state.filters.startTime;
    els.endTime.value = state.filters.endTime;
    els.merchantId.value = "";
    els.orderNo.value = "";
    els.status.value = "";
    els.orderType.value = "";
    state.page = 1;
    render();
  }

  function downloadCsv(filename, lines) {
    var csv = lines.map(function (line) {
      return line.map(function (value) {
        return "\"" + String(value).replace(/"/g, "\"\"") + "\"";
      }).join(",");
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
    var lines = [["订单号", "订单类型", "下单时间", "到账时间", "商户ID", "商户名称", "充币订单金额(U)", "实际到账金额(U)", "赠送金额(U)", "充值后余额(U)", "状态", "申请人", "充币地址"]];
    filteredRows().forEach(function (row) {
      lines.push([
        row.orderNo,
        row.typeName,
        row.createdAt,
        row.arrivedAt || "-",
        row.merchantId,
        row.merchantName,
        money(row.orderAmount),
        money(row.actualAmount),
        money(row.bonusAmount),
        money(row.balanceAfter),
        statusMap[row.status].label,
        row.applicant,
        row.address
      ]);
    });
    downloadCsv("充值订单列表.csv", lines);
  }

  function bind() {
    els.searchBtn.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.resetBtn.addEventListener("click", resetFilters);
    els.exportBtn.addEventListener("click", exportCsv);

    els.pager.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-page]");
      var pageCount = Math.max(1, Math.ceil(filteredRows().length / state.pageSize));
      if (!button) {
        return;
      }
      if (button.dataset.page === "prev" && state.page > 1) {
        state.page -= 1;
      } else if (button.dataset.page === "next" && state.page < pageCount) {
        state.page += 1;
      } else if (/^\d+$/.test(button.dataset.page)) {
        state.page = Number(button.dataset.page);
      }
      render();
    });

    els.body.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-order]");
      if (!button) {
        return;
      }
      window.alert("订单 " + button.getAttribute("data-order") + " 的详情弹窗待接后续流程补充。");
    });
  }

  function init() {
    els = {
      startTime: document.getElementById("startTime"),
      endTime: document.getElementById("endTime"),
      merchantId: document.getElementById("merchantId"),
      orderNo: document.getElementById("orderNo"),
      status: document.getElementById("status"),
      orderType: document.getElementById("orderType"),
      searchBtn: document.getElementById("searchBtn"),
      resetBtn: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      body: document.getElementById("orderBody"),
      summary: document.getElementById("tableSummary"),
      pager: document.getElementById("pager")
    };

    if (!els.body || !els.pager) {
      return;
    }

    bind();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
