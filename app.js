var express = require("express");
var bodyParser = require("body-parser");
const services = require("./services");

var port = process.env.PORT || 3000;
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(services.middleware);
app.post("/plaid", services.postPlaid);
app.get("/", function (req, res) {
    res.status(200).json({ hello: "world"});
});
app.post("/home", services.postHome);
app.post("/group", services.postGroup);
app.post("/community", services.postCommunity);

app.listen(port, function () {
 console.log("Starting!");
});

services.getDataAnalytics().then().catch();
