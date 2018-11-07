const middleware = require("./middleware");
const postPlaid = require("./postPlaid");
const postHome = require("./postHome");
const postGroup = require("./postGroup");
const postCommunity = require("./postCommunity");
const getDataAnalytics = require("./getDataAnalytics");

module.exports = {
    middleware,
    postPlaid,
    postHome,
    postGroup,
    postCommunity,
    getDataAnalytics,
};
