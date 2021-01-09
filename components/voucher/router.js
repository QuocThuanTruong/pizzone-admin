let express = require('express');
let router = express.Router();
const voucherRouter = require('./controller');
const authController = require('../auth/controller')

router.get('/', authController.isLogin, voucherRouter.index);
router.get('/add', authController.isLogin, voucherRouter.add);
router.get('/update/:id', authController.isLogin, voucherRouter.update);
module.exports = router;