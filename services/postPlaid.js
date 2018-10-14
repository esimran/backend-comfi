const db = require("./../database.js");
const dbUser = db.ref("user");
const client = require('./client.js');

module.exports = (req, res) => {
    const data = req.body;
    const publicToken = data.public_token;
    const accountID = data.account_id;
    client.exchangePublicToken(publicToken, function(error, tokenResponse) {
        if (error != null) { return res.json({ error: error }); }
        accessToken = tokenResponse.access_token;
        const update = { [data.fbid]: {
                account_id: accountID,
                access_token: accessToken,
            },
        };
        dbUser.update(update);
        res.status(200).json({ hello: "world" });  
    }); 
};
