(function () {
  var rowMap = [
    { merchantId: "AAA", merchantName: "ABCABC", actionTextId: "u2068_text", auditTextId: "u2069_text" },
    { merchantId: "BBB", merchantName: "ABCABC", actionTextId: "u2071_text", auditTextId: "u2072_text" },
    { merchantId: "CCC", merchantName: "ABCABC", actionTextId: "u2074_text", auditTextId: "u2075_text" },
    { merchantId: "DDD", merchantName: "ABCABC", actionTextId: "u2077_text", auditTextId: "u2078_text" },
    { merchantId: "EEE", merchantName: "ABCABC", actionTextId: "u2080_text", auditTextId: "u2081_text" }
  ];

  function createActionLinks(row) {
    var actionCell = document.getElementById(row.actionTextId);
    var auditCell = document.getElementById(row.auditTextId);

    if (actionCell) {
      actionCell.innerHTML = [
        '<button class="merchant-inline-action" type="button" data-dialog="site" data-merchant-id="' + row.merchantId + '" data-merchant-name="' + row.merchantName + '">修改站点状态</button>',
        '<button class="merchant-inline-action" type="button" data-dialog="merchant" data-merchant-id="' + row.merchantId + '" data-merchant-name="' + row.merchantName + '">修改商户状态</button>',
        '<a class="merchant-inline-action" href="支付ip管理.html?merchantId=' + encodeURIComponent(row.merchantId) + '">配置支付IP</a>'
      ].join("");
    }

    if (auditCell) {
      auditCell.innerHTML = '<a class="merchant-inline-action merchant-inline-action--audit" href="商户账单稽核.html?merchantId=' + encodeURIComponent(row.merchantId) + '">对账</a>';
    }
  }

  function createDialog() {
    var dialog = document.createElement("div");
    dialog.className = "merchant-status-dialog";
    dialog.hidden = true;
    dialog.innerHTML = [
      '<div class="merchant-status-dialog__mask" data-close-dialog="true"></div>',
      '<div class="merchant-status-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="merchantStatusDialogTitle">',
      '<div class="merchant-status-dialog__header">',
      '<div>',
      '<h2 id="merchantStatusDialogTitle">修改状态</h2>',
      '<p id="merchantStatusDialogMerchant"></p>',
      '</div>',
      '<button class="merchant-status-dialog__close" type="button" data-close-dialog="true">×</button>',
      '</div>',
      '<div class="merchant-status-dialog__body">',
      '<label class="merchant-status-dialog__field" id="siteSelectField">',
      '<span>站点</span>',
      '<select id="merchantStatusSite">',
      '<option value="主站">主站</option>',
      '<option value="体育站">体育站</option>',
      '<option value="电子站">电子站</option>',
      '<option value="棋牌站">棋牌站</option>',
      '</select>',
      '</label>',
      '<div class="merchant-status-dialog__field">',
      '<span>状态</span>',
      '<div class="merchant-status-dialog__radios">',
      '<label><input type="radio" name="merchantStatusValue" value="正常" checked> 正常</label>',
      '<label><input type="radio" name="merchantStatusValue" value="维护"> 维护</label>',
      '<label><input type="radio" name="merchantStatusValue" value="注销"> 注销</label>',
      '</div>',
      '</div>',
      '<div class="merchant-status-dialog__note" id="merchantStatusDialogNote"></div>',
      '</div>',
      '<div class="merchant-status-dialog__footer">',
      '<button class="merchant-status-dialog__btn" type="button" data-close-dialog="true">取消</button>',
      '<button class="merchant-status-dialog__btn merchant-status-dialog__btn--primary" type="button" id="merchantStatusConfirm">确认修改</button>',
      '</div>',
      '</div>'
    ].join("");
    document.body.appendChild(dialog);
    return dialog;
  }

  function openDialog(type, merchantId, merchantName) {
    var dialog = document.querySelector(".merchant-status-dialog") || createDialog();
    var title = document.getElementById("merchantStatusDialogTitle");
    var merchant = document.getElementById("merchantStatusDialogMerchant");
    var siteField = document.getElementById("siteSelectField");
    var note = document.getElementById("merchantStatusDialogNote");
    var confirm = document.getElementById("merchantStatusConfirm");
    var checked = dialog.querySelector('input[name="merchantStatusValue"][value="正常"]');

    title.textContent = type === "site" ? "修改站点状态" : "修改商户状态";
    merchant.textContent = "当前商户：" + merchantId + " / " + merchantName;
    siteField.hidden = type !== "site";
    note.textContent = type === "site"
      ? "选择站点后，仅调整该商户下对应站点状态。"
      : "仅调整当前行商户状态，不影响其他商户。";
    confirm.setAttribute("data-dialog-type", type);
    confirm.setAttribute("data-merchant-id", merchantId);
    if (checked) {
      checked.checked = true;
    }
    dialog.hidden = false;
  }

  function closeDialog() {
    var dialog = document.querySelector(".merchant-status-dialog");
    if (dialog) {
      dialog.hidden = true;
    }
  }

  function showToast(message) {
    var oldToast = document.querySelector(".merchant-list-action-toast");
    if (oldToast) {
      oldToast.remove();
    }

    var toast = document.createElement("div");
    toast.className = "merchant-list-action-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
    }, 2200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    rowMap.forEach(createActionLinks);
    createDialog();

    document.addEventListener("click", function (event) {
      var dialogButton = event.target.closest("[data-dialog]");
      var closeButton = event.target.closest("[data-close-dialog]");
      var confirmButton = event.target.closest("#merchantStatusConfirm");

      if (dialogButton) {
        openDialog(
          dialogButton.getAttribute("data-dialog"),
          dialogButton.getAttribute("data-merchant-id"),
          dialogButton.getAttribute("data-merchant-name")
        );
      }

      if (closeButton) {
        closeDialog();
      }

      if (confirmButton) {
        var type = confirmButton.getAttribute("data-dialog-type");
        var merchantId = confirmButton.getAttribute("data-merchant-id");
        var statusInput = document.querySelector('input[name="merchantStatusValue"]:checked');
        var siteSelect = document.getElementById("merchantStatusSite");
        var status = statusInput ? statusInput.value : "正常";
        var siteText = type === "site" ? "，站点：" + siteSelect.value : "";
        showToast("已提交 " + merchantId + siteText + "，状态：" + status);
        closeDialog();
      }
    });
  });
})();
