(function () {
  var rows = [
    { chainTradeId: "TRX-9d2ce0f7a3147c001", merchantId: "M10001", merchantName: "星河娱乐城", merchantAccount: "SKY.ONE Alpha", operatedAt: "2026-06-22 09:18:26", collectedAt: "2026-06-22 09:22:03", date: "2026-06-22", amount: 12800, trxFee: 4.82, depositAddress: "TQ9v3mK4aEGp52Kocm8f2a3wTT19Ua1yS", withdrawAddress: "TRo8d7f6c31nB1mK5Yx9P4Qw2Ae7tHkUZ", status: "success" },
    { chainTradeId: "TRX-b31f7ec202451c002", merchantId: "M10003", merchantName: "极光娱乐", merchantAccount: "NOVA.LINK Beta", operatedAt: "2026-06-22 10:06:15", collectedAt: "2026-06-22 10:09:47", date: "2026-06-22", amount: 45600, trxFee: 5.11, depositAddress: "TF8af89b34ce91d4Npk71QmSxqA2uL8Zf", withdrawAddress: "TH6k28LmN3q0RzVx5P9sDw7Be1JcYt4Qa", status: "success" },
    { chainTradeId: "TRX-f1aa884520780c003", merchantId: "M10008", merchantName: "银翼国际", merchantAccount: "CORE.NET Gamma", operatedAt: "2026-06-22 11:23:08", collectedAt: "", date: "2026-06-22", amount: 8200, trxFee: 4.56, depositAddress: "TQ2h11Mb9f1b6kL0qWv7nE8rXs4YpUaDd", withdrawAddress: "TRq4uH6nD1mX0sK8aP5cVz2Jw7LbYe9Ft", status: "processing" },
    { chainTradeId: "TRX-c81ae44f903a0d004", merchantId: "M10002", merchantName: "蓝海国际", merchantAccount: "ARC.AIS Delta", operatedAt: "2026-06-21 17:15:49", collectedAt: "2026-06-21 17:20:18", date: "2026-06-21", amount: 30240, trxFee: 4.98, depositAddress: "TL5s9Ad31c7e0dMp2Qh7Vs9xJ4RaYe2Wq", withdrawAddress: "TTv4Q9oP6a1dXz7Nf2Jk8Lu5Me3HrCsBw", status: "success" },
    { chainTradeId: "TRX-54d7bc19028ef0005", merchantId: "M10005", merchantName: "云顶新娱", merchantAccount: "GRID.FLOW Echo", operatedAt: "2026-06-21 16:08:25", collectedAt: "2026-06-21 16:14:39", date: "2026-06-21", amount: 68500, trxFee: 5.44, depositAddress: "TP2w6Sr90abE3kLv5Qn1Yx7Jm4Cf8UtZd", withdrawAddress: "TDc6Zn7Lp2Qk8Mr4Hx1As9Ve5Yw3BtJuF", status: "success" },
    { chainTradeId: "TRX-25e0f663bc902f006", merchantId: "M10006", merchantName: "盛世互动", merchantAccount: "BYTE.WAVE Foxtrot", operatedAt: "2026-06-21 14:33:09", collectedAt: "", date: "2026-06-21", amount: 15000, trxFee: 4.37, depositAddress: "TY6p7Ku49be203Lx7Qw5Ne8Ar1Vc6HtPm", withdrawAddress: "TR2sW8mY3Qd6Vb1Nk9Je4Lp7Fx5UcAoRh", status: "failed" },
    { chainTradeId: "TRX-7e12ac4604bd94007", merchantId: "M10004", merchantName: "银石游戏", merchantAccount: "LINK.NODE Sigma", operatedAt: "2026-06-20 19:12:47", collectedAt: "2026-06-20 19:18:02", date: "2026-06-20", amount: 40000, trxFee: 5.03, depositAddress: "TA91xY4cb26a71Yt2Kf8Pw4Qm7Hd9LsXe", withdrawAddress: "TX2eV7rJ5qN9Zp4Lc8As1Mw6Hb3KdFuTy", status: "success" },
    { chainTradeId: "TRX-8bc9307d1f22cb008", merchantId: "M10009", merchantName: "东誉平台", merchantAccount: "META.HUB Orion", operatedAt: "2026-06-20 12:41:16", collectedAt: "2026-06-20 12:46:54", date: "2026-06-20", amount: 55600, trxFee: 5.26, depositAddress: "TD1829bc5410e73Fq8Lh2Km5Pv7Rn1WxZ", withdrawAddress: "TRj4Mz9Vq1Nb6Ht3Ac7Lp5Dw8Xe2YuSkQ", status: "success" }
  ];

  var state = {
    page: 1,
    pageSize: 5,
    filters: {
      startTime: "2026-06-01",
      endTime: "2026-06-22",
      merchantType: "merchantAccount",
      merchantKeyword: "",
      chainTradeId: "",
      amountMin: "",
      amountMax: "",
      status: ""
    }
  };

  var statusMap = {
    success: { label: "归集成功", className: "success" },
    processing: { label: "处理中", className: "processing" },
    failed: { label: "归集失败", className: "failed" }
  };

  var placeholderMap = {
    merchantAccount: "请输入商户账号",
    merchantId: "请输入商户ID",
    merchantName: "请输入商户名称"
  };

  var els = {};

  function money(value) {
    return Number(value || 0).toLocaleString("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function fieldValue(row) {
    return String(row[state.filters.merchantType] || "").toLowerCase();
  }

  function filteredRows() {
    return rows.filter(function (row) {
      var amountMin = state.filters.amountMin === "" ? null : Number(state.filters.amountMin);
      var amountMax = state.filters.amountMax === "" ? null : Number(state.filters.amountMax);
      return (!state.filters.startTime || row.date >= state.filters.startTime)
        && (!state.filters.endTime || row.date <= state.filters.endTime)
        && (!state.filters.merchantKeyword || fieldValue(row).indexOf(state.filters.merchantKeyword) >= 0)
        && (!state.filters.chainTradeId || row.chainTradeId.toLowerCase().indexOf(state.filters.chainTradeId) >= 0)
        && (amountMin === null || row.amount >= amountMin)
        && (amountMax === null || row.amount <= amountMax)
        && (!state.filters.status || row.status === state.filters.status);
    });
  }

  function statusTag(status) {
    var item = statusMap[status] || statusMap.success;
    return "<span class=\"status-tag " + item.className + "\">" + item.label + "</span>";
  }

  function rowHtml(row) {
    return "<tr>"
      + "<td>" + row.chainTradeId + "</td>"
      + "<td>" + row.merchantId + "</td>"
      + "<td><strong>" + row.merchantName + "</strong></td>"
      + "<td>" + row.operatedAt + "</td>"
      + "<td>" + (row.collectedAt || "-") + "</td>"
      + "<td class=\"money\">" + money(row.amount) + "</td>"
      + "<td class=\"fee\">" + money(row.trxFee) + "</td>"
      + "<td class=\"address-cell\" title=\"" + row.depositAddress + "\">" + row.depositAddress + "</td>"
      + "<td class=\"address-cell\" title=\"" + row.withdrawAddress + "\">" + row.withdrawAddress + "</td>"
      + "<td>" + statusTag(row.status) + "</td>"
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

    els.body.innerHTML = pageRows.map(rowHtml).join("") || "<tr><td colspan=\"10\" style=\"height: 96px; color: #8a97a8;\">暂无数据</td></tr>";
    els.summary.textContent = "共 " + list.length + " 条归集订单";
    renderPager(list.length);
  }

  function syncMerchantPlaceholder() {
    var type = els.merchantType.value;
    els.merchantKeyword.placeholder = placeholderMap[type] || placeholderMap.merchantAccount;
  }

  function readFilters() {
    state.filters.startTime = els.startTime.value;
    state.filters.endTime = els.endTime.value;
    state.filters.merchantType = els.merchantType.value;
    state.filters.merchantKeyword = els.merchantKeyword.value.trim().toLowerCase();
    state.filters.chainTradeId = els.chainTradeId.value.trim().toLowerCase();
    state.filters.amountMin = els.amountMin.value.trim();
    state.filters.amountMax = els.amountMax.value.trim();
    state.filters.status = els.status.value;
  }

  function resetFilters() {
    state.filters = {
      startTime: "2026-06-01",
      endTime: "2026-06-22",
      merchantType: "merchantAccount",
      merchantKeyword: "",
      chainTradeId: "",
      amountMin: "",
      amountMax: "",
      status: ""
    };
    els.startTime.value = state.filters.startTime;
    els.endTime.value = state.filters.endTime;
    els.merchantType.value = state.filters.merchantType;
    els.merchantKeyword.value = "";
    els.chainTradeId.value = "";
    els.amountMin.value = "";
    els.amountMax.value = "";
    els.status.value = "";
    syncMerchantPlaceholder();
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
    var lines = [["链上的交易ID", "商户ID", "商户名称", "商户账号", "操作时间", "归集时间", "归集金额", "TRX消耗", "充币地址", "提币地址", "状态"]];
    filteredRows().forEach(function (row) {
      lines.push([
        row.chainTradeId,
        row.merchantId,
        row.merchantName,
        row.merchantAccount,
        row.operatedAt,
        row.collectedAt || "-",
        money(row.amount),
        money(row.trxFee),
        row.depositAddress,
        row.withdrawAddress,
        statusMap[row.status].label
      ]);
    });
    downloadCsv("归集订单列表.csv", lines);
  }

  function bind() {
    els.searchBtn.addEventListener("click", function () {
      readFilters();
      state.page = 1;
      render();
    });

    els.resetBtn.addEventListener("click", resetFilters);
    els.exportBtn.addEventListener("click", exportCsv);
    els.merchantType.addEventListener("change", syncMerchantPlaceholder);

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
  }

  function init() {
    els = {
      startTime: document.getElementById("startTime"),
      endTime: document.getElementById("endTime"),
      merchantType: document.getElementById("merchantType"),
      merchantKeyword: document.getElementById("merchantKeyword"),
      chainTradeId: document.getElementById("chainTradeId"),
      amountMin: document.getElementById("amountMin"),
      amountMax: document.getElementById("amountMax"),
      status: document.getElementById("status"),
      searchBtn: document.getElementById("searchBtn"),
      resetBtn: document.getElementById("resetBtn"),
      exportBtn: document.getElementById("exportBtn"),
      body: document.getElementById("orderBody"),
      summary: document.getElementById("tableSummary"),
      pager: document.getElementById("pager")
    };

    if (!els.body || !els.pager || !els.merchantType) {
      return;
    }

    syncMerchantPlaceholder();
    bind();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
