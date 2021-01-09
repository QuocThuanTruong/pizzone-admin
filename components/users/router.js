let express = require('express');
let router = express.Router();
const userController = require('./controller');
const authController = require('../auth/controller')
/* GET home page. */
router.get('/', authController.isLogin, userController.index);
router.post('/', authController.isLogin, userController.delete)

router.get('/detail/:id', authController.isLogin, userController.detail);
router.get('/lock/:id', authController.isLogin, userController.lockAccount);
router.get('/unlock/:id', authController.isLogin, userController.unlockAccount);

module.exports = router;
