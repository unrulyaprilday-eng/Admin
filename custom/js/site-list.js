(function() {
  var pageSize = 5;
  var currentPage = 1;
  var activeRow = null;

  var sites = [
    {
      merchantId: "M10001",
      merchantName: "蓝海娱乐",
      siteName: "蓝海主站",
      domain: "www.lanhai.example",
      openedAt: "2026-03-18",
      maintenanceWindow: "02:00-04:00",
      status: "正常",
      updatedAt: "2026-05-21 14:30"
    },
    {
      merchantId: "M10001",
      merchantName: "蓝海娱乐",
      siteName: "蓝海体育站",
      domain: "sports.lanhai.example",
      openedAt: "2026-03-25",
      maintenanceWindow: "03:00-05:00",
      status: "维护",
      updatedAt: "2026-05-20 22:10"
    },
    {
      merchantId: "M10018",
      merchantName: "星河互娱",
      siteName: "星河主站",
      domain: "www.xinghe.example",
      openedAt: "2026-04-02",
      maintenanceWindow: "01:00-03:00",
      status: "正常",
      updatedAt: "2026-05-19 11:24"
    },
    {
      merchantId: "M10022",
      merchantName: "恒信游戏",
      siteName: "恒信电子站",
      domain: "slot.hengxin.example",
      openedAt: "2026-04-08",
      maintenanceWindow: "02:30-04:30",
      status: "停用",
      updatedAt: "2026-05-18 09:45"
    },
    {
      merchantId: "M10033",
      merchantName: "启航娱乐",
      siteName: "启航棋牌站",
      domain: "chess.qihang.example",
      openedAt: "2026-04-16",
      maintenanceWindow: "04:00-05:00",
      status: "正常",
      updatedAt: "2026-05-17 16:08"
    },
    {
      merchantId: "M10045",
      merchantName: "银杉互娱",
      siteName: "银杉主站",
      domain: "www.yinshan.example",
      openedAt: "2026-04-21",
      maintenanceWindow: "02:00-03:30",
      status: "正常",
      updatedAt: "2026-05-16 18:26"
    },
    {
      merchantId: "M10052",
      merchantName: "澄空娱乐",
      siteName: "澄空电竞站",
      domain: "esports.chengkong.example",
      openedAt: "2026-04-29",
      maintenanceWindow: "01:30-03:00",
      status: "维护",
      updatedAt: "2026-05-15 20:40"
    }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getFilteredRows() {
    var siteName = normalize($("siteNameFilter").value);
    var merchantId = normalize($("merchantIdFilter").value);
    var merchantName = normalize($("merchantNameFilter").value);
    var status = $("statusFilter").value;

    return sites.filter(function(row) {
      return (!siteName || normalize(row.siteName).indexOf(siteName) > -1)
        && (!merchantId || normalize(row.merchantId).indexOf(merchantId) > -1)
        && (!merchantName || normalize(row.merchantName).indexOf(merchantName) > -1)
        && (!status || row.status === status);
    });
  }

  function statusClass(status) {
    if (status === "维护") {
      return "status-maintenance";
    }
    if (status === "停用") {
      return "status-disabled";
    }
    return "status-normal";
  }

  function renderTable() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    var start = (currentPage - 1) * pageSize;
    var pageRows = rows.slice(start, start + pageSize);

    $("siteTableBody").innerHTML = pageRows.length ? pageRows.map(function(row) {
      var index = sites.indexOf(row);
      return [
        "<tr>",
        "<td>" + row.merchantId + "</td>",
        "<td>" + row.merchantName + "</td>",
        "<td>" + row.siteName + "</td>",
        "<td>" + row.domain + "</td>",
        "<td>" + row.openedAt + "</td>",
        "<td>" + row.maintenanceWindow + "</td>",
        '<td><span class="status-tag ' + statusClass(row.status) + '">' + row.status + "</span></td>",
        "<td>" + row.updatedAt + "</td>",
        '<td><button class="inline-action" type="button" data-index="' + index + '">修改状态</button></td>',
        "</tr>"
      ].join("");
    }).join("") : '<tr><td class="empty-row" colspan="9">暂无匹配站点</td></tr>';

    $("resultSummary").textContent = "共 " + rows.length + " 条";
    $("pageSummary").textContent = "第 " + currentPage + " / " + totalPages + " 页";
    $("prevPageBtn").disabled = currentPage <= 1;
    $("nextPageBtn").disabled = currentPage >= totalPages;
  }

  function resetFilters() {
    $("siteNameFilter").value = "";
    $("merchantIdFilter").value = "";
    $("merchantNameFilter").value = "";
    $("statusFilter").value = "";
    currentPage = 1;
    renderTable();
  }

  function openModal(index) {
    activeRow = sites[Number(index)];
    if (!activeRow) {
      return;
    }
    $("modalSiteInfo").textContent = activeRow.merchantId + " / " + activeRow.merchantName + " / " + activeRow.siteName;
    $("modalStatus").value = activeRow.status;
    $("modalWindow").value = activeRow.maintenanceWindow;
    $("modalRemark").value = "";
    $("statusModal").classList.add("open");
    $("statusModal").setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    $("statusModal").classList.remove("open");
    $("statusModal").setAttribute("aria-hidden", "true");
  }

  function saveStatus() {
    if (!activeRow) {
      return;
    }
    activeRow.status = $("modalStatus").value;
    activeRow.maintenanceWindow = $("modalWindow").value || "-";
    activeRow.updatedAt = "2026-05-22 10:30";
    renderTable();
    closeModal();
    showToast("已提交 " + activeRow.siteName + " 状态调整");
  }

  function showToast(message) {
    var oldToast = document.querySelector(".toast");
    if (oldToast) {
      oldToast.remove();
    }
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function() {
      toast.remove();
    }, 2200);
  }

  function exportRows() {
    var rows = getFilteredRows();
    showToast("已导出当前视图 " + rows.length + " 条站点数据");
  }

  function bindEvents() {
    $("searchBtn").addEventListener("click", function() {
      currentPage = 1;
      renderTable();
    });
    $("resetBtn").addEventListener("click", resetFilters);
    $("exportBtn").addEventListener("click", exportRows);
    $("prevPageBtn").addEventListener("click", function() {
      currentPage -= 1;
      renderTable();
    });
    $("nextPageBtn").addEventListener("click", function() {
      currentPage += 1;
      renderTable();
    });
    $("siteTableBody").addEventListener("click", function(event) {
      var button = event.target.closest(".inline-action");
      if (button) {
        openModal(button.getAttribute("data-index"));
      }
    });
    $("closeModalBtn").addEventListener("click", closeModal);
    $("cancelModalBtn").addEventListener("click", closeModal);
    $("saveStatusBtn").addEventListener("click", saveStatus);
    $("statusModal").addEventListener("click", function(event) {
      if (event.target === $("statusModal")) {
        closeModal();
      }
    });
  }

  bindEvents();
  renderTable();
})();
