var express = require('express');
var router = express.Router();
var conn = require('../config/db');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('homepage');
});


module.exports = router;
