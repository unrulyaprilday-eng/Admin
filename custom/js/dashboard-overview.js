(function () {
  var overview = {
    monthNewMerchants: 38,
    merchantTotal: 286,
    todayMerchantRecharge: 186000,
    monthMerchantRecharge: 4268000,
    merchantBalance: 2386420,
    serverFee: 184600
  };

  var income = {
    setup: 228000,
    server: 184600,
    vendorDiff: 286400,
    deduction: 48600,
    wait: 286900
  };

  var gameRows = [
    { supplier: "Asia Matrix", vendor: "PG Soft", type: "Slots", users: 11680, bets: 183224, totalBet: 4869200, validBet: 4621800, payout: 4310250, rtp: "88.52%", loss: 555950, change: "+6.8%" },
    { supplier: "BetLink", vendor: "Evolution", type: "Live", users: 8420, bets: 78310, totalBet: 6420500, validBet: 6124700, payout: 5892200, rtp: "91.77%", loss: 528300, change: "+3.2%" },
    { supplier: "Blue Ocean", vendor: "BTI", type: "Sports", users: 4980, bets: 139808, totalBet: 7823400, validBet: 7518200, payout: 7200400, rtp: "92.04%", loss: 623000, change: "-1.4%" },
    { supplier: "Asia Matrix", vendor: "JILI", type: "Arcade", users: 1840, bets: 59023, totalBet: 1160200, validBet: 1098800, payout: 1025600, rtp: "88.40%", loss: 134600, change: "+2.6%" }
  ];

  var merchantRows = [
    { id: "M10001", name: "星河娱乐城", recharge: 1586000, balance: 864220, income: 186400, totalBet: 6412000, loss: 446000, members: 12840, status: "正常" },
    { id: "M10002", name: "蓝海国际", recharge: 1129000, balance: 526800, income: 149800, totalBet: 4629000, loss: 333000, members: 9160, status: "关注" },
    { id: "M10003", name: "极光娱乐", recharge: 724000, balance: 286400, income: 98200, totalBet: 2962000, loss: 213000, members: 5720, status: "正常" },
    { id: "M10004", name: "银石游戏", recharge: 318000, balance: 188900, income: 35600, totalBet: 1095000, loss: 21880, members: 2210, status: "高风险" }
  ];

  var todos = [
    { label: "待确认收入账单", value: "4", level: "warning" },
    { label: "待结算厂商账单", value: "3", level: "warning" },
    { label: "差异待核账单", value: "1", level: "danger" },
    { label: "余额不足商户", value: "9", level: "danger" },
    { label: "待处理账单", value: "7", level: "warning" },
    { label: "高风险商户", value: "1", level: "danger" }
  ];

  function money(value) {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function statusClass(value) {
    if (value === "高风险" || value === "差异待核") {
      return "risk";
    }
    if (value === "待确认" || value === "待结算" || value === "关注") {
      return "wait";
    }
    return "ok";
  }

  function platformIncome() {
    return income.setup + income.server + income.vendorDiff - income.deduction;
  }

  function renderOverview() {
    setText("monthNewMerchants", intText(overview.monthNewMerchants));
    setText("merchantTotal", intText(overview.merchantTotal));
    setText("todayMerchantRecharge", "$" + money(overview.todayMerchantRecharge));
    setText("monthMerchantRecharge", "$" + money(overview.monthMerchantRecharge));
    setText("merchantBalance", "$" + money(overview.merchantBalance));
    setText("serverFee", "$" + money(overview.serverFee));
    setText("actualIncome", "$" + money(platformIncome()));
    setText("incomeActual", "$" + money(platformIncome()));
    setText("incomeSetup", "$" + money(income.setup));
    setText("incomeServer", "$" + money(income.server));
    setText("incomeVendorDiff", "$" + money(income.vendorDiff));
    setText("incomeDeduction", "-$" + money(income.deduction));
    setText("incomeWait", "$" + money(income.wait));
  }

  function renderGameRows() {
    var html = gameRows.map(function (row) {
      var changeClass = row.change.indexOf("-") === 0 ? "negative-text" : "positive";
      return "<tr>"
        + "<td>" + row.supplier + "</td>"
        + "<td>" + row.vendor + "</td>"
        + "<td>" + row.type + "</td>"
        + "<td>" + intText(row.users) + "</td>"
        + "<td>" + intText(row.bets) + "</td>"
        + "<td class=\"money\">$" + money(row.totalBet) + "</td>"
        + "<td class=\"money\">$" + money(row.validBet) + "</td>"
        + "<td>$" + money(row.payout) + "</td>"
        + "<td>" + row.rtp + "</td>"
        + "<td class=\"money\">$" + money(row.loss) + "</td>"
        + "<td class=\"" + changeClass + "\">" + row.change + "</td>"
        + "</tr>";
    }).join("");
    document.getElementById("gameBody").innerHTML = html;
  }

  function renderMerchantRows() {
    var html = merchantRows.map(function (row, index) {
      return "<tr>"
        + "<td>" + (index + 1) + "</td>"
        + "<td>" + row.id + "</td>"
        + "<td><strong>" + row.name + "</strong></td>"
        + "<td class=\"money\">$" + money(row.recharge) + "</td>"
        + "<td>$" + money(row.balance) + "</td>"
        + "<td class=\"money\">$" + money(row.income) + "</td>"
        + "<td>$" + money(row.totalBet) + "</td>"
        + "<td>$" + money(row.loss) + "</td>"
        + "<td>" + intText(row.members) + "</td>"
        + "<td><span class=\"status " + statusClass(row.status) + "\">" + row.status + "</span></td>"
        + "</tr>";
    }).join("");
    document.getElementById("merchantRankBody").innerHTML = html;
  }

  function renderTodos() {
    var html = todos.map(function (item) {
      return "<div class=\"todo-item " + item.level + "\"><span>" + item.label + "</span><strong>" + item.value + "</strong></div>";
    }).join("");
    document.getElementById("todoList").innerHTML = html;
  }

  function bindTabs() {
    var groups = document.querySelectorAll(".period-tabs");
    Array.prototype.forEach.call(groups, function (group) {
      group.addEventListener("click", function (event) {
        if (event.target.tagName !== "BUTTON") {
          return;
        }
        Array.prototype.forEach.call(group.querySelectorAll("button"), function (button) {
          button.classList.toggle("active", button === event.target);
        });
      });
    });
  }

  function init() {
    renderOverview();
    renderGameRows();
    renderMerchantRows();
    renderTodos();
    bindTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
