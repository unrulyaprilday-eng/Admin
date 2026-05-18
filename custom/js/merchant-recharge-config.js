(function() {
  var baseConfig = {
    ratio: 1,
    min: 100,
    max: 200000
  };

  var tiers = [
    { amount: 1000, ratio: 2, bonus: 0 },
    { amount: 2000, ratio: 0, bonus: 2 },
    { amount: 5000, ratio: 0, bonus: 2 },
    { amount: 10000, ratio: 2, bonus: 0 },
    { amount: 20000, ratio: 0, bonus: 2 },
    { amount: 50000, ratio: 2, bonus: 0 }
  ];

  var draftTiers = [];

  function $(id) {
    return document.getElementById(id);
  }

  function toNumber(value) {
    var next = Number(value);
    return Number.isFinite(next) && next > 0 ? next : 0;
  }

  function clamp(value) {
    return Math.max(0, toNumber(value));
  }

  function renderTable() {
    $("tierTable").innerHTML = tiers.map(function(tier) {
      return [
        "<tr>",
        "<td>" + tier.amount + "</td>",
        "<td>" + (tier.ratio > 0 ? '<span class=\"ratio-text\">' + tier.ratio + "%</span>" : '<span class=\"empty-text\">-</span>') + "</td>",
        "<td>" + (tier.bonus > 0 ? '<span class=\"amount-text\">' + tier.bonus + "</span>" : '<span class=\"empty-text\">-</span>') + "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function syncBaseInputs() {
    $("quickRatio").value = baseConfig.ratio;
    $("quickMin").value = baseConfig.min;
    $("quickMax").value = baseConfig.max;
    $("modalRatio").value = baseConfig.ratio;
    $("modalMin").value = baseConfig.min;
    $("modalMax").value = baseConfig.max;
  }

  function statusFor(tier) {
    if (tier.ratio > 0) {
      return { text: "按比例", className: "ratio" };
    }
    if (tier.bonus > 0) {
      return { text: "固定金额", className: "amount" };
    }
    return { text: "未配置", className: "empty" };
  }

  function renderEditor() {
    $("tierEditor").innerHTML = draftTiers.map(function(tier, index) {
      var status = statusFor(tier);
      return [
        '<div class="tier-row" data-index="' + index + '">',
        "<strong>档位 " + (index + 1) + "</strong>",
        '<span class="label">充值额度</span>',
        stepperMarkup("amount", tier.amount, 1000, "amount-step"),
        "<b>U</b>",
        '<span class="label">赠送比例</span>',
        stepperMarkup("ratio", tier.ratio, 1, ""),
        "<b>%</b>",
        '<span class="label">赠送额度</span>',
        stepperMarkup("bonus", tier.bonus, 1, ""),
        "<b>U</b>",
        '<span class="tier-status ' + status.className + '">' + status.text + "</span>",
        "</div>"
      ].join("");
    }).join("");
    updateMutualButtons();
  }

  function stepperMarkup(field, value, delta, extraClass) {
    return [
      '<span class="stepper ' + extraClass + '" data-field="' + field + '">',
      '<input type="number" min="0" value="' + value + '" data-field="' + field + '" />',
      '<button type="button" data-field="' + field + '" data-delta="' + delta + '">+</button>',
      '<button type="button" data-field="' + field + '" data-delta="-' + delta + '">−</button>',
      "</span>"
    ].join("");
  }

  function updateMutualButtons() {
    Array.prototype.forEach.call(document.querySelectorAll(".tier-row"), function(row) {
      var tier = draftTiers[Number(row.dataset.index)];
      var ratioPlus = row.querySelector('[data-field="ratio"][data-delta="1"]');
      var bonusPlus = row.querySelector('[data-field="bonus"][data-delta="1"]');
      if (ratioPlus) {
        ratioPlus.disabled = tier.bonus > 0;
      }
      if (bonusPlus) {
        bonusPlus.disabled = tier.ratio > 0;
      }
    });
  }

  function openModal() {
    draftTiers = tiers.map(function(tier) {
      return Object.assign({}, tier);
    });
    syncBaseInputs();
    renderEditor();
    $("configModal").classList.add("open");
    $("configModal").setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    $("configModal").classList.remove("open");
    $("configModal").setAttribute("aria-hidden", "true");
  }

  function saveConfig() {
    baseConfig.ratio = clamp($("modalRatio").value);
    baseConfig.min = clamp($("modalMin").value);
    baseConfig.max = clamp($("modalMax").value);
    tiers = draftTiers.map(function(tier) {
      return Object.assign({}, tier);
    });
    syncBaseInputs();
    renderTable();
    closeModal();
  }

  function handleBasicStepper(event) {
    var button = event.target.closest("button[data-target]");
    if (!button) {
      return;
    }
    var input = $(button.dataset.target);
    input.value = clamp(Number(input.value) + Number(button.dataset.delta));
  }

  function handleTierInput(event) {
    var row = event.target.closest(".tier-row");
    if (!row || !event.target.matches("input[data-field]")) {
      return;
    }
    var tier = draftTiers[Number(row.dataset.index)];
    var field = event.target.dataset.field;
    tier[field] = clamp(event.target.value);
    if (field === "ratio" && tier.ratio > 0) {
      tier.bonus = 0;
    }
    if (field === "bonus" && tier.bonus > 0) {
      tier.ratio = 0;
    }
    renderEditor();
  }

  function handleTierStepper(event) {
    var button = event.target.closest(".tier-row button[data-field]");
    if (!button || button.disabled) {
      return;
    }
    var row = button.closest(".tier-row");
    var tier = draftTiers[Number(row.dataset.index)];
    var field = button.dataset.field;
    var delta = Number(button.dataset.delta);
    tier[field] = clamp(tier[field] + delta);
    if (field === "ratio" && tier.ratio > 0) {
      tier.bonus = 0;
    }
    if (field === "bonus" && tier.bonus > 0) {
      tier.ratio = 0;
    }
    renderEditor();
  }

  function bind() {
    $("editBtn").addEventListener("click", openModal);
    $("closeBtn").addEventListener("click", closeModal);
    $("cancelBtn").addEventListener("click", closeModal);
    $("saveBtn").addEventListener("click", saveConfig);
    $("configModal").addEventListener("click", function(event) {
      if (event.target === $("configModal")) {
        closeModal();
      }
    });
    document.addEventListener("click", handleBasicStepper);
    $("tierEditor").addEventListener("input", handleTierInput);
    $("tierEditor").addEventListener("click", handleTierStepper);
  }

  renderTable();
  syncBaseInputs();
  bind();
})();
