var express = require('express');
var router = express.Router();
const ordersController = require('./controller');

/* GET home page. */
router.get('/', ordersController.index);

router.get('/update/:id', ordersController.update);

module.exports = router;
