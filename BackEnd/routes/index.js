var express = require('express');
var router = express.Router();

// const admin = require('firebase-admin');
// var serviceAccount = require("../think-e7103-firebase-adminsdk-nbs6z-9edf16214e.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "think-e7103.appspot.com"
// });

// /* config something */
// var db = admin.firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// db.settings(settings);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
