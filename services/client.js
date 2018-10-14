const plaid = require('plaid');
const CONFIG = require("./../config.js");

const client = new plaid.Client(
    CONFIG.PLAID.CLIENT_ID,
    CONFIG.PLAID.SECRET,

    CONFIG.PLAID.PUBLIC_KEY,
    plaid.environments[CONFIG.PLAID.ENV],
);

module.exports = client; 
