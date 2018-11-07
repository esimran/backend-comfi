const db = require("./../database.js");

const CATEGORIES = ["Budgeting", "Investing", "Saving", "Debt", "Credit", "Taxes"];

module.exports = async (req, res) => {
    const myFBID = req.body.fbid;
    const allUsers = await db.ref("user").once('value')
        .then(snapshot => { 
            return snapshot.val(); 
        });
    const requestUser = allUsers[myFBID];
    const canHelp = [];
    const getHelp = [];
    const myStrengthSet = new Set(requestUser.strengths);
    const myWeakSet = new Set(requestUser.weaknesses);
    for (const fbid of Object.keys(allUsers)) {
        if (myFBID == fbid) { continue; }
        const currentUser = allUsers[fbid];
        canHelp.push({
            fbid: fbid,
            categories: currentUser.weaknesses.filter(x => myStrengthSet.has(x)),
        });
        getHelp.push({
            fbid: fbid,
            categories: currentUser.strengths.filter(x => myWeakSet.has(x)),
        });
    }
    return res.status(200).json({
        self_can_help: canHelp, 
        self_gets_help: getHelp,
        strengths: requestUser.strengths,
        weaknesses: requestUser.weaknesses,
        all_categories: CATEGORIES,
    });
};
