var firebase = require("firebase-admin");
var serviceAccount = require("./firebase_settings.js");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://hackduke-comfi.firebaseio.com"
});

const db = firebase.database();

module.exports = db;
