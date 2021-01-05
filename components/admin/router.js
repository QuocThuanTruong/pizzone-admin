var express = require('express');
var router = express.Router();
const adminController = require('./controller');
const api = require('./api')

/* GET home page. */
router.get('/', adminController.index);

router.get('/profile', adminController.profile);

module.exports = router;
