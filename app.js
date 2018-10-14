var express = require("express");
var port = process.env.PORT || 3000;
var app = express();

app.get("/", function (req, res) {
    res.status(200).json({ Hello: "test"});
});

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});
