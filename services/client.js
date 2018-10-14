const plaid = require('plaid');
const CONFIG = require("./../config.js");

const client = new plaid.Client(
    CONFIG.PLAID_CLIENT_ID,
    CONFIG.PLAID_SECRET,

    CONFIG.PLAID_PUBLIC_KEY,
    plaid.environments[CONFIG.PLAID_ENV],
);

module.exports = client; 
