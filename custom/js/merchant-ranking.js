(function () {
  var rows = [
    { id: "M10001", name: "星河娱乐城", recharge: 1586000, withdraw: 1194200, contribution: 186400, totalBet: 6412000, bonus: 32200, members: 12840, rechargeUsers: 8730, adCost: 68000, betUsers: 11680 },
    { id: "M10002", name: "蓝海国际", recharge: 1129000, withdraw: 842600, contribution: 149800, totalBet: 4629000, bonus: 22400, members: 9160, rechargeUsers: 6120, adCost: 52000, betUsers: 8420 },
    { id: "M10003", name: "极光娱乐", recharge: 724000, withdraw: 538600, contribution: 98200, totalBet: 2962000, bonus: 13600, members: 5720, rechargeUsers: 3510, adCost: 28600, betUsers: 4980 },
    { id: "M10004", name: "银石游戏", recharge: 318000, withdraw: 302600, contribution: 35600, totalBet: 1095000, bonus: 8200, members: 2210, rechargeUsers: 1210, adCost: 11200, betUsers: 1840 }
  ];

  function money(value) {
    return Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function intText(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function render() {
    var html = rows.map(function (row, index) {
      var diff = row.recharge - row.withdraw;
      return "<tr>"
        + "<td>" + (index + 1) + "</td>"
        + "<td>" + row.id + "</td>"
        + "<td><strong>" + row.name + "</strong></td>"
        + "<td class=\"money\">$" + money(row.recharge) + "</td>"
        + "<td class=\"money\">$" + money(row.withdraw) + "</td>"
        + "<td class=\"money\">$" + money(diff) + "</td>"
        + "<td class=\"money\">$" + money(row.contribution) + "</td>"
        + "<td class=\"money\">$" + money(row.totalBet) + "</td>"
        + "<td class=\"money\">$" + money(row.bonus) + "</td>"
        + "<td class=\"number\">" + intText(row.members) + "</td>"
        + "<td class=\"number\">" + intText(row.rechargeUsers) + "</td>"
        + "<td class=\"money\">$" + money(row.adCost) + "</td>"
        + "<td class=\"number\">" + intText(row.betUsers) + "</td>"
        + "</tr>";
    }).join("");
    document.getElementById("rankingBody").innerHTML = html || "<tr class=\"empty-row\"><td colspan=\"13\">暂无数据</td></tr>";
  }

  function downloadCsv() {
    var header = ["排名", "商户ID", "商户名称", "商户充值金额", "商户提现金额", "商户充提差额", "商户贡献", "商户总投注", "商户优惠总赠送", "商户总注册人数", "商户总充值人数", "商户广告消耗", "商户投注人数"];
    var lines = rows.map(function (row, index) {
      return [index + 1, row.id, row.name, money(row.recharge), money(row.withdraw), money(row.recharge - row.withdraw), money(row.contribution), money(row.totalBet), money(row.bonus), row.members, row.rechargeUsers, money(row.adCost), row.betUsers];
    });
    var csv = [header].concat(lines).map(function (line) {
      return line.map(function (item) { return "\"" + String(item).replace(/"/g, "\"\"") + "\""; }).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "商户排行.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    document.getElementById("searchBtn").addEventListener("click", render);
    document.getElementById("exportBtn").addEventListener("click", downloadCsv);
  });
})();
