(function () {
  var merchants = [
    { id: "M10001", name: "蓝海娱乐", sites: ["blue-a.com", "blue-b.com", "blue-admin"] },
    { id: "M10018", name: "星河游戏", sites: ["star-web", "star-h5", "star-agent"] },
    { id: "M10027", name: "北辰体育", sites: ["north-sport", "north-api", "north-m"] },
    { id: "M10036", name: "东南互动", sites: ["se-web", "se-pay", "se-admin"] },
    { id: "M10052", name: "银石平台", sites: ["silver-main", "silver-h5"] },
    { id: "M10068", name: "新城娱乐", sites: ["newcity-web", "newcity-app", "newcity-agent"] },
    { id: "M10079", name: "极光游戏", sites: ["aurora-web", "aurora-api"] }
  ];

  var selectedMerchants = [];
  var selectedSiteMerchant = "";
  var selectedSites = [];
  var ALL_MERCHANTS = "__ALL_MERCHANTS__";
  var ALL_SITES = "__ALL_SITES__";
  var pendingAction = "";
  var els = {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentScope() {
    var checked = document.querySelector("input[name='scopeType']:checked");
    return checked ? checked.value : "指定商户";
  }

  function merchantLabel(merchant) {
    return merchant.id + " " + merchant.name;
  }

  function renderMerchantOptions() {
    var keyword = els.merchantSearch.value.trim().toLowerCase();
    var list = merchants.filter(function (merchant) {
      return !keyword
        || merchant.id.toLowerCase().indexOf(keyword) > -1
        || merchant.name.toLowerCase().indexOf(keyword) > -1;
    });
    els.merchantOptions.innerHTML = "<label class=\"merchant-option\">"
      + "<input type=\"checkbox\" value=\"" + ALL_MERCHANTS + "\"" + (selectedMerchants.indexOf(ALL_MERCHANTS) > -1 ? " checked" : "") + " />"
      + "<span>所有商户 <small>ALL</small></span>"
      + "</label>"
      + (list.length
      ? list.map(function (merchant) {
        var checked = selectedMerchants.indexOf(merchant.id) > -1 ? " checked" : "";
        return "<label class=\"merchant-option\">"
          + "<input type=\"checkbox\" value=\"" + escapeHtml(merchant.id) + "\"" + checked + " />"
          + "<span>" + escapeHtml(merchant.name) + " <small>" + escapeHtml(merchant.id) + "</small></span>"
          + "</label>";
      }).join("")
      : "<div class=\"merchant-option\">暂无匹配商户</div>");
  }

  function renderSiteMerchantOptions() {
    var keyword = els.siteMerchantSearch.value.trim().toLowerCase();
    var list = merchants.filter(function (merchant) {
      return !keyword
        || merchant.id.toLowerCase().indexOf(keyword) > -1
        || merchant.name.toLowerCase().indexOf(keyword) > -1;
    });
    els.siteMerchantOptions.innerHTML = list.length
      ? list.map(function (merchant) {
        var checked = selectedSiteMerchant === merchant.id ? " checked" : "";
        return "<label class=\"merchant-option\">"
          + "<input type=\"radio\" name=\"siteMerchantOption\" value=\"" + escapeHtml(merchant.id) + "\"" + checked + " />"
          + "<span>" + escapeHtml(merchant.name) + " <small>" + escapeHtml(merchant.id) + "</small></span>"
          + "</label>";
      }).join("")
      : "<div class=\"merchant-option\">暂无匹配商户</div>";
  }

  function syncMerchantTarget() {
    if (selectedMerchants.indexOf(ALL_MERCHANTS) > -1) {
      els.targetMerchant.value = "所有商户";
      els.merchantPickerText.textContent = "已选择所有商户";
      return;
    }
    var selected = merchants.filter(function (merchant) {
      return selectedMerchants.indexOf(merchant.id) > -1;
    });
    els.targetMerchant.value = selected.map(merchantLabel).join("，");
    els.merchantPickerText.textContent = selected.length ? "已选择 " + selected.length + " 个商户" : "搜索并选择商户";
  }

  function currentSiteMerchant() {
    return merchants.filter(function (merchant) {
      return merchant.id === selectedSiteMerchant;
    })[0];
  }

  function renderSiteOptions() {
    var merchant = currentSiteMerchant();
    if (!merchant) {
      els.siteOptions.innerHTML = "<span class=\"empty-text\">请先选择所属商户</span>";
      els.targetSite.value = "";
      els.siteMerchantPickerText.textContent = "搜索并选择商户";
      return;
    }
    els.siteMerchantPickerText.textContent = merchant.name + " " + merchant.id;
    els.siteOptions.innerHTML = "<label class=\"site-option\">"
      + "<input type=\"checkbox\" value=\"" + ALL_SITES + "\"" + (selectedSites.indexOf(ALL_SITES) > -1 ? " checked" : "") + " />"
      + "<span>所有站点</span>"
      + "</label>"
      + merchant.sites.map(function (site) {
      var checked = selectedSites.indexOf(site) > -1 ? " checked" : "";
      return "<label class=\"site-option\">"
        + "<input type=\"checkbox\" value=\"" + escapeHtml(site) + "\"" + checked + " />"
        + "<span>" + escapeHtml(site) + "</span>"
        + "</label>";
    }).join("");
    els.targetSite.value = selectedSites.indexOf(ALL_SITES) > -1 ? "所有站点" : selectedSites.join("，");
  }

  function refreshScopeArea() {
    var scope = currentScope();
    var options = document.querySelectorAll(".scope-option");
    Array.prototype.forEach.call(options, function (option) {
      var input = option.querySelector("input");
      option.classList.toggle("is-active", input && input.checked);
    });
    els.merchantTargetArea.classList.toggle("is-visible", scope === "指定商户");
    els.siteTargetArea.classList.toggle("is-visible", scope === "指定站点");
    els.scopeImpact.textContent = scopeDesc();
  }

  function parseDateTime(value) {
    var match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    return new Date(Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] || 0)
    ));
  }

  function formatDateTimeValue(date) {
    return date.getUTCFullYear() + "-"
      + pad(date.getUTCMonth() + 1) + "-"
      + pad(date.getUTCDate()) + "T"
      + pad(date.getUTCHours()) + ":"
      + pad(date.getUTCMinutes());
  }

  function formatLocalDisplay(date) {
    if (!date) return "--";
    return date.getUTCFullYear() + "-"
      + pad(date.getUTCMonth() + 1) + "-"
      + pad(date.getUTCDate()) + " "
      + pad(date.getUTCHours()) + ":"
      + pad(date.getUTCMinutes()) + ":"
      + pad(date.getUTCSeconds());
  }

  function currentTargetTimeValue() {
    var offset = Number(els.targetTimeZone.value || 0);
    return formatDateTimeValue(new Date(Date.now() + offset * 60 * 60 * 1000));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function formatInOffset(date, offset) {
    if (!date) return "--";
    var shifted = new Date(date.getTime() + offset * 60 * 60 * 1000);
    return shifted.getUTCFullYear() + "/"
      + pad(shifted.getUTCMonth() + 1) + "/"
      + pad(shifted.getUTCDate()) + " "
      + pad(shifted.getUTCHours()) + ":"
      + pad(shifted.getUTCMinutes()) + ":"
      + pad(shifted.getUTCSeconds());
  }

  function formatUtcLabel(offset) {
    if (offset > 0) return "UTC +" + offset;
    if (offset < 0) return "UTC " + offset;
    return "UTC +0";
  }

  function refreshTimezoneCompare() {
    var offset = Number(els.targetTimeZone.value || 0);
    els.utcBaseLabel.textContent = formatUtcLabel(0);
    els.targetZoneLabel.textContent = formatUtcLabel(offset);
    var startTarget = parseDateTime(els.start.value);
    var isUnlimited = els.duration.value === "unlimited";
    var durationMs = Number(els.duration.value || 0) * 60 * 1000;
    var endTarget = startTarget ? new Date(startTarget.getTime() + durationMs) : null;
    if (isUnlimited) {
      els.end.value = "不限时";
    } else {
      els.end.value = formatLocalDisplay(endTarget);
    }
    var startUtc = startTarget ? new Date(startTarget.getTime() - offset * 60 * 60 * 1000) : null;
    if (isUnlimited) {
      els.utcBaseTime.textContent = formatInOffset(startUtc, 0) + " 起，不限时";
      els.targetZoneTime.textContent = formatInOffset(startUtc, offset) + " 起，不限时";
      return;
    }
    var endUtc = endTarget ? new Date(endTarget.getTime() - offset * 60 * 60 * 1000) : null;
    els.utcBaseTime.textContent = formatInOffset(startUtc, 0) + " - " + formatInOffset(endUtc, 0);
    els.targetZoneTime.textContent = formatInOffset(startUtc, offset) + " - " + formatInOffset(endUtc, offset);
  }

  function refreshSummary() {
    refreshScopeArea();
    els.effectMode.value = "立即维护";
    els.form.classList.add("is-immediate");
    els.start.readOnly = true;
    els.start.value = currentTargetTimeValue();
    refreshTimezoneCompare();
  }

  function scopeDesc() {
    var scope = currentScope();
    if (scope === "指定商户") {
      if (selectedMerchants.indexOf(ALL_MERCHANTS) > -1) return "所有商户访问";
      return selectedMerchants.length ? selectedMerchants.length + " 个指定商户访问" : "指定商户访问";
    }
    if (selectedSites.indexOf(ALL_SITES) > -1) return "所有站点访问";
    if (selectedSites.length) return selectedSites.length + " 个指定站点访问";
    return "指定站点访问";
  }

  function selectedTargetText() {
    var scope = currentScope();
    if (scope === "指定商户") return els.targetMerchant.value.trim() || "未选择商户";
    return els.targetSite.value.trim() || "未选择站点";
  }

  function maintenanceTimeText() {
    var startText = formatLocalDisplay(parseDateTime(els.start.value));
    if (els.duration.value === "unlimited") return startText + " 起，不限时";
    return startText + " 至 " + (els.end.value || "--");
  }

  function setConfirmSummary(action) {
    var rows = action === "recover" ? [
      ["恢复范围", scopeDesc()],
      ["目标对象", selectedTargetText()],
      ["恢复结果", "立即恢复访问"]
    ] : [
      ["维护范围", scopeDesc()],
      ["目标对象", selectedTargetText()],
      ["生效方式", els.effectMode.value],
      ["维护时间", maintenanceTimeText()],
      ["维护时长", els.duration.options[els.duration.selectedIndex].text],
      [els.utcBaseLabel.textContent, els.utcBaseTime.textContent]
    ];
    els.confirmSummary.innerHTML = rows.map(function (row) {
      return "<div><dt>" + escapeHtml(row[0]) + "</dt><dd>" + escapeHtml(row[1]) + "</dd></div>";
    }).join("");
  }

  function openDialog(action) {
    pendingAction = action;
    setConfirmSummary(action);
    if (action === "recover") {
      els.dialogTitle.textContent = "确认一键恢复";
      els.dialogContent.textContent = "确认恢复后，当前维护范围将立即恢复访问。";
    } else {
      els.dialogTitle.textContent = "确认提交维护";
      els.dialogContent.textContent = "提交后将按当前配置变更维护状态，请确认以下影响信息。";
    }
    els.dialog.classList.remove("is-hidden");
  }

  function closeDialog() {
    els.dialog.classList.add("is-hidden");
  }

  function submitMaintenance(event) {
    event.preventDefault();
    openDialog("submit");
  }

  function confirmAction() {
    refreshSummary();
    closeDialog();
  }

  function resetForm() {
    els.form.reset();
    selectedMerchants = [];
    selectedSiteMerchant = "";
    selectedSites = [];
    els.merchantSearch.value = "";
    els.siteMerchantSearch.value = "";
    syncMerchantTarget();
    renderMerchantOptions();
    renderSiteMerchantOptions();
    renderSiteOptions();
    els.effectMode.value = "立即维护";
    els.duration.value = "120";
    els.targetTimeZone.value = "8";
    els.start.value = currentTargetTimeValue();
    refreshSummary();
  }

  function bind() {
    els.form.addEventListener("submit", submitMaintenance);
    els.recover.addEventListener("click", function () { openDialog("recover"); });
    els.reset.addEventListener("click", resetForm);
    els.close.addEventListener("click", closeDialog);
    els.cancel.addEventListener("click", closeDialog);
    els.confirm.addEventListener("click", confirmAction);
    els.form.addEventListener("input", refreshSummary);
    els.form.addEventListener("change", refreshSummary);
    els.merchantPickerTrigger.addEventListener("click", function () {
      els.merchantDropdown.classList.toggle("is-hidden");
      els.merchantSearch.focus();
    });
    els.merchantSearch.addEventListener("input", renderMerchantOptions);
    els.merchantOptions.addEventListener("change", function (event) {
      if (event.target.type !== "checkbox") return;
      if (event.target.value === ALL_MERCHANTS) {
        selectedMerchants = event.target.checked ? [ALL_MERCHANTS] : [];
        renderMerchantOptions();
        syncMerchantTarget();
        refreshSummary();
        return;
      }
      selectedMerchants = selectedMerchants.filter(function (id) {
        return id !== ALL_MERCHANTS;
      });
      if (event.target.checked && selectedMerchants.indexOf(event.target.value) === -1) {
        selectedMerchants.push(event.target.value);
      }
      if (!event.target.checked) {
        selectedMerchants = selectedMerchants.filter(function (id) {
          return id !== event.target.value;
        });
      }
      renderMerchantOptions();
      syncMerchantTarget();
      refreshSummary();
    });
    els.siteMerchantPickerTrigger.addEventListener("click", function () {
      els.siteMerchantDropdown.classList.toggle("is-hidden");
      els.siteMerchantSearch.focus();
    });
    els.siteMerchantSearch.addEventListener("input", renderSiteMerchantOptions);
    els.siteMerchantOptions.addEventListener("change", function (event) {
      if (event.target.type !== "radio") return;
      selectedSiteMerchant = event.target.value;
      selectedSites = [];
      renderSiteMerchantOptions();
      renderSiteOptions();
      refreshSummary();
      els.siteMerchantDropdown.classList.add("is-hidden");
    });
    els.siteOptions.addEventListener("change", function (event) {
      if (event.target.type !== "checkbox") return;
      if (event.target.value === ALL_SITES) {
        selectedSites = event.target.checked ? [ALL_SITES] : [];
        renderSiteOptions();
        refreshSummary();
        return;
      }
      selectedSites = selectedSites.filter(function (site) {
        return site !== ALL_SITES;
      });
      if (event.target.checked && selectedSites.indexOf(event.target.value) === -1) {
        selectedSites.push(event.target.value);
      }
      if (!event.target.checked) {
        selectedSites = selectedSites.filter(function (site) {
          return site !== event.target.value;
        });
      }
      renderSiteOptions();
      refreshSummary();
    });
    document.addEventListener("click", function (event) {
      if (!els.merchantPicker.contains(event.target)) {
        els.merchantDropdown.classList.add("is-hidden");
      }
      if (!els.siteMerchantPicker.contains(event.target)) {
        els.siteMerchantDropdown.classList.add("is-hidden");
      }
    });
  }

  function init() {
    els = {
      form: document.getElementById("maintenanceForm"),
      effectMode: document.getElementById("effectMode"),
      duration: document.getElementById("durationSelect"),
      targetTimeZone: document.getElementById("targetTimeZone"),
      start: document.getElementById("startTime"),
      end: document.getElementById("endTime"),
      message: document.getElementById("messageInput"),
      scopeImpact: document.getElementById("scopeImpactText"),
      merchantTargetArea: document.getElementById("merchantTargetArea"),
      siteTargetArea: document.getElementById("siteTargetArea"),
      merchantPicker: document.getElementById("merchantPicker"),
      merchantPickerTrigger: document.getElementById("merchantPickerTrigger"),
      merchantPickerText: document.getElementById("merchantPickerText"),
      merchantDropdown: document.getElementById("merchantDropdown"),
      merchantSearch: document.getElementById("merchantSearch"),
      merchantOptions: document.getElementById("merchantOptions"),
      targetMerchant: document.getElementById("targetMerchantInput"),
      siteMerchantPicker: document.getElementById("siteMerchantPicker"),
      siteMerchantPickerTrigger: document.getElementById("siteMerchantPickerTrigger"),
      siteMerchantPickerText: document.getElementById("siteMerchantPickerText"),
      siteMerchantDropdown: document.getElementById("siteMerchantDropdown"),
      siteMerchantSearch: document.getElementById("siteMerchantSearch"),
      siteMerchantOptions: document.getElementById("siteMerchantOptions"),
      siteOptions: document.getElementById("siteOptions"),
      targetSite: document.getElementById("targetSiteInput"),
      utcBaseTime: document.getElementById("utcBaseTime"),
      utcBaseLabel: document.getElementById("utcBaseLabel"),
      targetZoneTime: document.getElementById("targetZoneTime"),
      targetZoneLabel: document.getElementById("targetZoneLabel"),
      recover: document.getElementById("recoverBtn"),
      reset: document.getElementById("resetBtn"),
      dialog: document.getElementById("confirmDialog"),
      dialogTitle: document.getElementById("dialogTitle"),
      dialogContent: document.getElementById("dialogContent"),
      confirmSummary: document.getElementById("confirmSummary"),
      close: document.getElementById("closeDialog"),
      cancel: document.getElementById("cancelDialog"),
      confirm: document.getElementById("confirmAction")
    };
    bind();
    renderMerchantOptions();
    renderSiteMerchantOptions();
    renderSiteOptions();
    refreshSummary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
