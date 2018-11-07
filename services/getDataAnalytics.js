const client = require('./client.js');
const db = require("./../database.js");
const moment = require('moment');

const MONTHS = 36;

function format(transactions) {
    const data = [];
    var incomeSum = 0;
    var past = moment();
    var outSum = 0;
    for (const transaction of transactions) {
        const amount = transaction.amount;
        const date = moment(transaction.date);
        while(past.diff(date) > 0) {
            past.subtract(1, 'month');
            data.push({ monthly_spending: 0 });
        }
        if (amount < 0) { incomeSum = incomeSum + amount; }
        else { 
            outSum = outSum + amount;
            data[data.length-1].monthly_spending = data[data.length-1].monthly_spending + amount; 
        }
    }
    const averageMonthly = incomeSum/data.length*-1;
    const scaled = data.map(month => {
        const scaledMS = month.monthly_spending/averageMonthly;
        return {
            scaled_monthly_spending: scaledMS,
            scaled_monthly_saving: 1 - scaledMS,
        }
    })
    return {
        average_monthly_income: averageMonthly,
        data: scaled,
    };
}

function getTransactions(plaidInfo) {
  const accessToken = plaidInfo.access_token;
  const accountID = plaidInfo.account_id;
  var startDate = moment().subtract(MONTHS, 'months').format('YYYY-MM-DD');
//   var startDate = moment().subtract(8, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
      client.getTransactions(accessToken, startDate, endDate, {
          account_ids: [ accountID ],
      }, (error, transactionsResponse) => {
              if (error != null) { reject({ error: error }); } 
              resolve(transactionsResponse);
          }
      );
  })
}

async function getDataAnalytics() {
  const fbid = "1172074312944659";
  const plaidInfo = await db.ref("user/" + fbid).once('value')
      .then(snapshot => { return snapshot.val(); })
  const transactionsResponse = await getTransactions(plaidInfo);
  const transactions = transactionsResponse.transactions;
  const formattedData = format(transactions);
//   console.log(JSON.stringify(formattedData));
  return formattedData;
}

module.exports = getDataAnalytics;
