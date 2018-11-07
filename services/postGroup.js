const db = require("./../database.js");
const client = require('./client.js');
const moment = require('moment');

const MONTHS = 3;

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
    const allUsers = await db.ref("user").once('value')
        .then(snapshot => { return snapshot.val(); })
    const categorySet = new Set();
    const categories = {};
    const individualCategoryCount = {};
    const allFBID = Object.keys(allUsers);
    for (const fbid of allFBID) {
        const plaidInfo = allUsers[fbid];
        const transactionsResponse = await getTransactions(plaidInfo);
        const transactions = transactionsResponse.transactions;
        for (const transaction of transactions) {
            const category = transaction.category[0];
            if (!categories[fbid]) { categories[fbid] = {}; }
            if (!categories[fbid][category]) { categories[fbid][category] = 1}
            else { categories[fbid][category] = categories[fbid][category] + 1; }
            if(!individualCategoryCount[fbid]) { individualCategoryCount[fbid] = 1; }
            else { individualCategoryCount[fbid] = individualCategoryCount[fbid] + 1; }
            categorySet.add(category);
        }
    }
    const categoryArray =  Array.from(categorySet);
    const categoryPercents = {};
    const pieGraph = [];
    const other = {
        percent: 0,
        category: "Other",
    };
    for (const category of categoryArray) {
        const individualPercents = [];
        var sum = 0;
        for (const fbid of allFBID) {
            const seenExpenditures = categories[fbid][category];
            const numberOfSeenExpenditures = seenExpenditures ? seenExpenditures : 0;
            const percent = numberOfSeenExpenditures/individualCategoryCount[fbid];
            sum = sum + percent;
            individualPercents.push({
                fbid: fbid,
                percent: percent,
            });
        }
        categoryPercents[category] = individualPercents.sort((a, b) => {
            return b.percent - a.percent;
        });
        const percent = sum/individualPercents.length;
        if (percent < .05) { other.percent = other.percent + percent; } 
        else {
            pieGraph.push({
                category: category,
                percent: percent,
            });
        }
    }
    pieGraph.push(other);
    return res.status(200).json({
        categoryPercents,
        categories: categoryArray,
        pie_graph: pieGraph,
    });  
};
