let express = require('express');
let router = express.Router();

const shippingController = require('./controller');
const authController = require('../auth/controller')


router.get('/', authController.isLogin, shippingController.index);
//router.post('/', authController.isLogin, shippingController.delete);

router.get('/add', authController.isLogin, shippingController.add);
//router.post('/add',authController.isLogin, shippingController.confirmAdd);

router.get('/update/:id', authController.isLogin, shippingController.update);
//router.post('/update/:id', authController.isLogin, shippingController.confirmUpdate);

module.exports = router;