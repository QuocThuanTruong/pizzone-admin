var express = require('express');
var router = express.Router();
const adminController = require('./controller');

/* GET home page. */
router.get('/', adminController.index);

module.exports = router;
