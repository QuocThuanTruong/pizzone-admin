let express = require('express');
let router = express.Router();
const userController = require('./controller');
const authController = require('../auth/controller')
/* GET home page. */
router.get('/', authController.isLogin, userController.index);

router.get('/detail/:id', authController.isLogin, userController.detail);

module.exports = router;
