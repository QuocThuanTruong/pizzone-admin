let express = require('express');
let router = express.Router();
const adminController = require('./controller');
const authController = require('../auth/controller')
const api = require('./api')

/* GET home page. */
router.get('/', authController.isLogin, adminController.index);

router.get('/profile', authController.isLogin, adminController.profile);
router.post('/profile', authController.isLogin, adminController.updateProfile);

module.exports = router;
