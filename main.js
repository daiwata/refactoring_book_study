const fs = require('fs');

function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    result += `  ${play.name}: ${usd(amountFor(play, perf))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(appleSouce())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result
}

function appleSouce() {
  let result = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    result += amountFor(play, perf);
  }
  return result
}

function totalVolumeCredits() {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += volumeCreditsFor(play, perf)
  }
  return volumeCredits
}

function volumeCreditsFor(play, perf) {
  let result = Math.max(perf.audience - 30, 0);
  if (play.type === "comedy") {
    result += Math.floor(perf.audience / 5);
  }
  return result
}

function usd(amount) {
  return new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
}

function amountFor(play, perf) {

  let thisAmount = 0
  switch (play.type) {
    case "tragedy":
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount
}

let plays = JSON.parse(fs.readFileSync("plays.json"))
let invoice = JSON.parse(fs.readFileSync("invoices.json"))[0]
let result = statement(invoice, plays)

let expect = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`
console.log(result == expect)
