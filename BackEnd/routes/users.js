var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/yyy', function(req, res, next) {
  res.send('My name Tim Rau');
});

module.exports = router;
