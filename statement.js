import fs from 'fs'
import createStatementData from './createStatementData.js'

function statement(invoic, plays) {
  return renderPlainText(createStatementData(invoice, plays))
}

export function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}
function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(amount) {
  return new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
}


let plays = JSON.parse(fs.readFileSync("plays.json"))
let invoice = JSON.parse(fs.readFileSync("invoices.json"))[0]
let result = htmlStatement(invoice, plays)

// let expect = `Statement for BigCo
//   Hamlet: $650.00 (55 seats)
//   As You Like It: $580.00 (35 seats)
//   Othello: $500.00 (40 seats)
// Amount owed is $1,730.00
// You earned 47 credits
// `
// console.log(result == expect)
console.log(result)
