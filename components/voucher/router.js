let express = require('express');
let router = express.Router();

const voucherRouter = require('./controller');
const authController = require('../auth/controller')


router.get('/', authController.isLogin, voucherRouter.index);
router.post('/', authController.isLogin, voucherRouter.delete);

router.get('/add', authController.isLogin, voucherRouter.add);
router.post('/add',authController.isLogin, voucherRouter.confirmAdd);

router.get('/update/:id', authController.isLogin, voucherRouter.update);
router.post('/update/:id', authController.isLogin, voucherRouter.confirmUpdate);

module.exports = router;