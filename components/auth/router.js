var express = require('express');
var router = express.Router();
const authController = require('./controller');

/* GET home page. */
router.get('/', authController.signIn);
router.get('/recover-password', authController.recoverPassword);


module.exports = router;
