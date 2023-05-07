const fs = require('fs');

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let eachAmounts = []

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let playType = play.type
    let playName = play.name
    let perfAudience = perf.audience

    let thisAmount = calculateThisAmount(playType, perfAudience);
    let eachAmountObj = { thisAmount, playName, perfAudience }
    eachAmounts.push(eachAmountObj)

    volumeCredits += Math.max(perfAudience - 30, 0);
    // add extra credit for every five comedy attendees
    if (playType === "comedy") {
      volumeCredits += Math.floor(perfAudience / 5);
    }

    totalAmount += thisAmount;
  }
  let result = formatResult(eachAmounts, totalAmount, volumeCredits)
  return result
}

function formatResult(eachAmounts, totalAmount, volumeCredits) {
  const currencyFormat = new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format;

  let result = `Statement for ${invoice.customer}\n`;
  for (let eachAmountObj of eachAmounts) {
    let { playName, thisAmount, perfAudience } = eachAmountObj
    result += `  ${playName}: ${currencyFormat(thisAmount / 100)} (${perfAudience} seats)\n`;
  }
  result += `Amount owed is ${currencyFormat(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result
}


function calculateThisAmount(playType, perfAudience) {
  let thisAmount = 0
  switch (playType) {
    case "tragedy":
      thisAmount = 40000;
      if (perfAudience > 30) {
        thisAmount += 1000 * (perfAudience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (perfAudience > 20) {
        thisAmount += 10000 + 500 * (perfAudience - 20);
      }
      thisAmount += 300 * perfAudience;
      break;
    default:
      throw new Error(`unknown type: ${playType}`);
  }
  return thisAmount
}

let plays = JSON.parse(fs.readFileSync("plays.json"))
let invoice = JSON.parse(fs.readFileSync("invoices.json"))[0]
let result = statement(invoice, plays)
console.log(result)
