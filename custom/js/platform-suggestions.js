(function () {
  var rows = [
    {
      id: "sg_10001",
      siteId: "101",
      merchantId: "M10086",
      merchantName: "星河游戏",
      status: "待处理",
      submitTime: "2026-05-15 15:48:26",
      content: "TESTTESTTESTTEST",
      attachmentType: "none",
      attachmentText: "无附件",
      reply: "",
      operator: "",
      operateTime: "2026-05-15 15:48:26"
    },
    {
      id: "sg_10002",
      siteId: "101",
      merchantId: "M10021",
      merchantName: "长风娱乐",
      status: "已采纳",
      submitTime: "2026-05-06 14:05:12",
      content: "1111111111",
      attachmentType: "image",
      attachmentText: "查看",
      attachmentUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
      reply: "1111",
      operator: "admin",
      operateTime: "2026-05-06 15:22:25"
    },
    {
      id: "sg_10003",
      siteId: "101",
      merchantId: "M10033",
      merchantName: "大公会",
      status: "已采纳",
      submitTime: "2026-05-06 13:09:25",
      content: "大公司的风格sdfgsdfgsdfgd",
      attachmentType: "link",
      attachmentText: "www.baidu.com",
      attachmentUrl: "https://www.baidu.com",
      reply: "",
      operator: "amumu",
      operateTime: "2026-05-15 15:42:37"
    }
  ];

  var filters = {
    startTime: "",
    endTime: "",
    status: "",
    merchantId: ""
  };
  var activeRow = null;
  var els = {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function emptyRow() {
    return "<tr><td colspan=\"10\" class=\"empty-cell\">暂无数据</td></tr>";
  }

  function statusHtml(status) {
    var className = status === "待处理" ? "pending" : status === "已采纳" ? "accepted" : "rejected";
    return "<span class=\"status-tag " + className + "\">" + status + "</span>";
  }

  function rowHtml(row) {
    var hasAttachment = row.attachmentType !== "none";
    var action = row.status === "待处理" ? "处理" : "查看";
    var actionClass = row.status === "待处理" ? "" : " view";
    return "<tr>"
      + "<td>" + escapeHtml(row.merchantId) + "</td>"
      + "<td>" + escapeHtml(row.merchantName) + "</td>"
      + "<td>" + statusHtml(row.status) + "</td>"
      + "<td>" + escapeHtml(row.submitTime) + "</td>"
      + "<td title=\"" + escapeHtml(row.content) + "\">" + escapeHtml(row.content) + "</td>"
      + "<td>" + (hasAttachment ? "<button class=\"table-link\" type=\"button\" data-action=\"detail\" data-id=\"" + row.id + "\">查看</button>" : "-") + "</td>"
      + "<td title=\"" + escapeHtml(row.reply) + "\">" + escapeHtml(row.reply) + "</td>"
      + "<td>" + escapeHtml(row.operator) + "</td>"
      + "<td>" + escapeHtml(row.operateTime) + "</td>"
      + "<td><button class=\"action-btn" + actionClass + "\" type=\"button\" data-action=\"" + (row.status === "待处理" ? "process" : "detail") + "\" data-id=\"" + row.id + "\">" + action + "</button></td>"
      + "</tr>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      return (!filters.status || row.status === filters.status)
        && (!filters.merchantId || row.merchantId.indexOf(filters.merchantId) >= 0);
    });
  }

  function render() {
    var list = filteredRows();
    els.body.innerHTML = list.length ? list.map(rowHtml).join("") : emptyRow();
  }

  function readFilters() {
    filters.startTime = els.startTime.value.trim();
    filters.endTime = els.endTime.value.trim();
    filters.status = els.status.value;
    filters.merchantId = els.merchantId.value.trim();
  }

  function resetFilters() {
    els.startTime.value = "";
    els.endTime.value = "";
    els.status.value = "";
    els.merchantId.value = "";
    readFilters();
    render();
  }

  function findRow(id) {
    return rows.filter(function (row) { return row.id === id; })[0];
  }

  function attachmentHtml(row) {
    if (row.attachmentType === "image") {
      return "<div class=\"attachment-box\"><img class=\"attachment-image\" src=\"" + row.attachmentUrl + "\" alt=\"附件图片\" /></div>";
    }
    if (row.attachmentType === "link") {
      return "<div class=\"attachment-box\"><a href=\"" + row.attachmentUrl + "\" target=\"_blank\">" + escapeHtml(row.attachmentText) + "</a></div>";
    }
    return "<div class=\"attachment-box empty\">无附件</div>";
  }

  function openProcess(row) {
    activeRow = row;
    els.card.className = "modal-card";
    els.title.textContent = "处理建议";
    els.modalBody.innerHTML = ""
      + "<label class=\"modal-field\"><span>反馈内容:</span><textarea readonly>" + escapeHtml(row.content) + "</textarea></label>"
      + "<div class=\"modal-field\"><span>附件:</span>" + attachmentHtml(row) + "</div>"
      + "<label class=\"modal-field\"><span>回复:</span><textarea id=\"replyInput\" placeholder=\"请输入回复内容\"></textarea></label>";
    els.modalFooter.innerHTML = ""
      + "<button class=\"btn ghost large\" type=\"button\" data-result=\"reject\">忽略</button>"
      + "<button class=\"btn primary large\" type=\"button\" data-result=\"accept\">采纳</button>";
    openModal();
  }

  function openDetail(row) {
    activeRow = row;
    els.card.className = "modal-card detail";
    els.title.textContent = "查看建议（" + row.status + "）";
    els.modalBody.innerHTML = ""
      + "<label class=\"modal-field\"><span>反馈内容:</span><textarea readonly>" + escapeHtml(row.content) + "</textarea></label>"
      + "<div class=\"modal-field\"><span>附件:</span>" + attachmentHtml(row) + "</div>"
      + (row.status === "已采纳" ? "<label class=\"modal-field\"><span>回复:</span><textarea readonly>" + escapeHtml(row.reply) + "</textarea></label>" : "");
    els.modalFooter.innerHTML = "<button class=\"btn primary large\" type=\"button\" data-result=\"close\">关闭</button>";
    openModal();
  }

  function openModal() {
    els.modal.classList.remove("is-hidden");
  }

  function closeModal() {
    els.modal.classList.add("is-hidden");
    activeRow = null;
  }

  function handleResult(action) {
    var replyInput;
    if (action === "close") {
      closeModal();
      return;
    }
    if (!activeRow) return;
    replyInput = document.getElementById("replyInput");
    activeRow.status = action === "accept" ? "已采纳" : "未采纳";
    activeRow.reply = replyInput ? replyInput.value.trim() : "";
    activeRow.operator = action === "accept" ? "admin" : "amumu";
    activeRow.operateTime = "2026-05-15 16:02:18";
    closeModal();
    render();
  }

  function bind() {
    els.search.addEventListener("click", function () {
      readFilters();
      render();
    });
    els.reset.addEventListener("click", resetFilters);
    els.close.addEventListener("click", closeModal);
    els.modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("modal-mask")) {
        closeModal();
      }
    });
    els.body.addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      var row;
      if (!button) return;
      row = findRow(button.getAttribute("data-id"));
      if (!row) return;
      if (button.getAttribute("data-action") === "process") {
        openProcess(row);
      } else {
        openDetail(row);
      }
    });
    els.modalFooter.addEventListener("click", function (event) {
      var button = event.target.closest("[data-result]");
      if (button) {
        handleResult(button.getAttribute("data-result"));
      }
    });
  }

  function init() {
    els = {
      body: document.getElementById("suggestionBody"),
      startTime: document.getElementById("startTime"),
      endTime: document.getElementById("endTime"),
      status: document.getElementById("statusFilter"),
      merchantId: document.getElementById("merchantIdFilter"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      modal: document.getElementById("suggestionModal"),
      card: document.querySelector(".modal-card"),
      title: document.getElementById("modalTitle"),
      modalBody: document.getElementById("modalBody"),
      modalFooter: document.getElementById("modalFooter"),
      close: document.getElementById("closeModal")
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
