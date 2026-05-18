(function () {
  var rows = [
    {
      id: "101",
      code: "BRL",
      name: "巴西",
      symbol: "R$",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "102",
      code: "USD",
      name: "美元",
      symbol: "$",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "103",
      code: "PHP",
      name: "菲律宾",
      symbol: "₱",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "104",
      code: "IDR",
      name: "印度尼西亚",
      symbol: "Rp",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "105",
      code: "INR",
      name: "印度",
      symbol: "₹",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "106",
      code: "VND",
      name: "越南",
      symbol: "₫",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "107",
      code: "PKR",
      name: "巴基斯坦",
      symbol: "₨",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "108",
      code: "BDT",
      name: "孟加拉",
      symbol: "৳",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "109",
      code: "MXN",
      name: "墨西哥",
      symbol: "$",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "110",
      code: "NGN",
      name: "尼日利亚",
      symbol: "₦",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "111",
      code: "ARS",
      name: "阿根廷",
      symbol: "$",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "112",
      code: "COP",
      name: "哥伦比亚",
      symbol: "$",
      type: "法币",
      chains: [],
      remark: ""
    },
    {
      id: "113",
      code: "USDT",
      name: "U",
      symbol: "₮",
      type: "加密货币",
      chains: ["TRC20"],
      remark: "当前仅支持 TRC20"
    }
  ];

  var filters = {
    keyword: "",
    type: ""
  };
  var editingId = "";
  var els = {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function iconHtml(row) {
    var className = row.type === "加密货币" ? "coin-icon crypto" : "coin-icon";
    return "<span class=\"" + className + "\">" + escapeHtml(row.code.slice(0, 2)) + "</span>";
  }

  function rowHtml(row) {
    return "<tr>"
      + "<td>" + escapeHtml(row.id) + "</td>"
      + "<td>" + escapeHtml(row.code) + "</td>"
      + "<td>" + iconHtml(row) + "</td>"
      + "<td>" + escapeHtml(row.name) + "</td>"
      + "<td>" + escapeHtml(row.symbol) + "</td>"
      + "<td>" + escapeHtml(row.type) + "</td>"
      + "<td>" + escapeHtml(row.chains.join(", ")) + "</td>"
      + "<td title=\"" + escapeHtml(row.remark) + "\">" + escapeHtml(row.remark || "-") + "</td>"
      + "<td><div class=\"action-list\">"
      + "<button class=\"btn ghost\" type=\"button\" data-action=\"edit\" data-id=\"" + row.id + "\">编辑</button>"
      + "</div></td>"
      + "</tr>";
  }

  function emptyRow() {
    return "<tr><td colspan=\"9\" class=\"empty-cell\">暂无币种数据</td></tr>";
  }

  function filteredRows() {
    return rows.filter(function (row) {
      var text = row.name + row.code + row.symbol;
      return (!filters.keyword || text.toLowerCase().indexOf(filters.keyword.toLowerCase()) >= 0)
        && (!filters.type || row.type === filters.type);
    });
  }

  function render() {
    var list = filteredRows();
    els.body.innerHTML = list.length ? list.map(rowHtml).join("") : emptyRow();
  }

  function currencyOptions() {
    var keyword = els.keyword.value.trim().toLowerCase();
    return rows.filter(function (row) {
      var text = row.code + row.name + row.symbol;
      return !keyword || text.toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function renderCurrencyMenu() {
    var list = currencyOptions();
    els.currencyMenu.innerHTML = list.length ? list.map(function (row) {
      return "<button class=\"select-option\" type=\"button\" data-code=\"" + escapeHtml(row.code) + "\">"
        + "<b>" + escapeHtml(row.code) + "</b>"
        + "<span>" + escapeHtml(row.name) + "</span>"
        + "</button>";
    }).join("") : "<button class=\"select-option\" type=\"button\" disabled><span>暂无匹配币种</span></button>";
  }

  function showCurrencyMenu() {
    renderCurrencyMenu();
    els.currencyMenu.classList.remove("is-hidden");
  }

  function hideCurrencyMenu() {
    els.currencyMenu.classList.add("is-hidden");
  }

  function findRow(id) {
    return rows.filter(function (row) { return row.id === id; })[0];
  }

  function selectedType() {
    var checked = document.querySelector("input[name='currencyType']:checked");
    return checked ? checked.value : "法币";
  }

  function selectedChains() {
    return Array.prototype.slice.call(els.chainField.querySelectorAll("input:checked")).map(function (input) {
      return input.value;
    });
  }

  function setChains(chains) {
    Array.prototype.slice.call(els.chainField.querySelectorAll("input[type='checkbox']")).forEach(function (input) {
      input.checked = chains.indexOf(input.value) >= 0;
    });
  }

  function updateChainState() {
    var isCrypto = selectedType() === "加密货币";
    els.chainField.classList.toggle("is-disabled", !isCrypto);
    if (!isCrypto) {
      setChains([]);
    }
  }

  function openModal(row) {
    if (!row) return;
    editingId = row.id;
    els.title.textContent = "编辑币种";
    els.code.value = row.code;
    els.name.value = row.name;
    els.symbol.value = row.symbol;
    els.remark.value = row.remark;
    els.iconPreview.textContent = row.code.slice(0, 2);
    document.querySelector("input[name='currencyType'][value='" + row.type + "']").checked = true;
    setChains(row.chains);
    updateChainState();
    els.modal.classList.remove("is-hidden");
  }

  function closeModal() {
    els.modal.classList.add("is-hidden");
    editingId = "";
    setChains([]);
    updateChainState();
  }

  function saveRow(event) {
    var row;
    var type;
    var chains;
    event.preventDefault();
    row = findRow(editingId);
    if (!row) return;
    type = row.type;
    chains = type === "加密货币" ? selectedChains() : [];
    if (type === "加密货币" && !chains.length) {
      alert("加密货币至少选择一个主链");
      return;
    }
    row.symbol = els.symbol.value.trim().toUpperCase();
    row.chains = chains;
    row.remark = els.remark.value.trim();
    closeModal();
    render();
  }

  function bind() {
    els.search.addEventListener("click", function () {
      filters.keyword = els.keyword.value.trim();
      filters.type = els.type.value;
      hideCurrencyMenu();
      render();
    });
    els.reset.addEventListener("click", function () {
      els.keyword.value = "";
      els.type.value = "";
      filters.keyword = "";
      filters.type = "";
      hideCurrencyMenu();
      render();
    });
    els.keyword.addEventListener("focus", showCurrencyMenu);
    els.keyword.addEventListener("input", showCurrencyMenu);
    els.currencyToggle.addEventListener("click", function () {
      if (els.currencyMenu.classList.contains("is-hidden")) {
        showCurrencyMenu();
        els.keyword.focus();
      } else {
        hideCurrencyMenu();
      }
    });
    els.currencyMenu.addEventListener("click", function (event) {
      var button = event.target.closest("[data-code]");
      if (!button) return;
      els.keyword.value = button.getAttribute("data-code");
      hideCurrencyMenu();
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".search-select")) {
        hideCurrencyMenu();
      }
    });
    els.body.addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      var id;
      if (!button) return;
      id = button.getAttribute("data-id");
      if (button.getAttribute("data-action") === "edit") {
        openModal(findRow(id));
      }
    });
    els.close.addEventListener("click", closeModal);
    els.cancel.addEventListener("click", closeModal);
    els.modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("modal-mask")) closeModal();
    });
    els.form.addEventListener("submit", saveRow);
    Array.prototype.slice.call(document.querySelectorAll("input[name='currencyType']")).forEach(function (input) {
      input.addEventListener("change", updateChainState);
    });
    els.icon.addEventListener("change", function () {
      var file = els.icon.files && els.icon.files[0];
      els.iconPreview.textContent = file ? "图" : "+";
    });
  }

  function init() {
    els = {
      body: document.getElementById("currencyBody"),
      keyword: document.getElementById("currencyFilter"),
      currencyToggle: document.getElementById("currencyToggle"),
      currencyMenu: document.getElementById("currencyMenu"),
      type: document.getElementById("typeFilter"),
      search: document.getElementById("searchBtn"),
      reset: document.getElementById("resetBtn"),
      modal: document.getElementById("currencyModal"),
      form: document.getElementById("currencyForm"),
      title: document.getElementById("modalTitle"),
      close: document.getElementById("closeModal"),
      cancel: document.getElementById("cancelBtn"),
      code: document.getElementById("codeInput"),
      name: document.getElementById("nameInput"),
      symbol: document.getElementById("symbolInput"),
      icon: document.getElementById("iconInput"),
      iconPreview: document.getElementById("iconPreview"),
      chainField: document.getElementById("chainField"),
      remark: document.getElementById("remarkInput")
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
