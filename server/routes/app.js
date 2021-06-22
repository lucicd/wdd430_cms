const INDEX_PATH = "dist/cms/index.html";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, INDEX_PATH));
});

module.exports = { router: router, path: INDEX_PATH };
