var express = require('express');
var router = express.Router();
const userController = require('./controller');

/* GET home page. */
router.get('/', userController.index);

router.get('/detail/:id', userController.detail);

module.exports = router;
