const db = require("./../database.js");
const client = require('./client.js');
const moment = require('moment');

const MONTHS = 3;

function format(transactions) {
    const formattedTransactions = [];
    const categories = {};
    var comingIn = 0;
    var goingOut = 0;
    var totalCategoryCount = 0;
    for(const transaction of transactions) {
        for(const category of transaction.category) {
            if (!categories[category]) { categories[category] = 1; }
            else { categories[category] = categories[category] + 1; }
            totalCategoryCount = totalCategoryCount + 1;
        }
        const rawAmount = transaction.amount;
        if(rawAmount > 0) { goingOut = goingOut + rawAmount; }
        else { comingIn = comingIn + rawAmount; }
        formattedTransactions.push({
            name: transaction.name,
            amount: Number(rawAmount).toFixed(2),
            date: transaction.date,
        }); 
    }
    const pieGraph = [];
    for (const category of Object.keys(categories)) {
        const percent = categories[category]/totalCategoryCount;
        pieGraph.push({
            category: category,
            percent: percent,
            amount: percent*goingOut,
        });
    }
    return {
        saving: comingIn-goingOut,
        pieGraph: pieGraph,
        transactions: formattedTransactions,
    };
}

function getTransactions(plaidInfo) {
    const accessToken = plaidInfo.access_token;
    const accountID = plaidInfo.account_id;
    var startDate = moment().subtract(MONTHS, 'months').format('YYYY-MM-DD');
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

module.exports = async (req, res) => {
    const fbid = req.body.fbid;
    const plaidInfo = await db.ref("user/" + fbid).once('value')
        .then(snapshot => { return snapshot.val(); })
    const transactionsResponse = await getTransactions(plaidInfo);
    const transactions = transactionsResponse.transactions;
    const formattedData = format(transactions);
    res.status(200).json({
        monthly_saving: Number(formattedData.saving/MONTHS).toFixed(2),
        account_balance: Number(transactionsResponse.accounts[0].balances.available).toFixed(2),
        pie_graph: formattedData.pieGraph,
        transactions: formattedData.transactions,
    });  
};