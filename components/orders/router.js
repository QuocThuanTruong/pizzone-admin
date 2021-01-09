let express = require('express');
let router = express.Router();
const ordersController = require('./controller');
const authController = require('../auth/controller')

/* GET home page. */
router.get('/',  /*authController.isLogin, */ordersController.index);
router.post('/', /*authController.isLogin, */ordersController.delete)

router.get('/update/:id',  /*authController.isLogin, */ordersController.update);

module.exports = router;
