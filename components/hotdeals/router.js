let express = require('express');
let router = express.Router();
const hotDealsRouter = require('./controller');
const authController = require('../auth/controller')

router.get('/', authController.isLogin, hotDealsRouter.index);
router.post('/', authController.isLogin, hotDealsRouter.delete);

router.get('/add', authController.isLogin, hotDealsRouter.add);
router.post('/add', authController.isLogin, hotDealsRouter.confirmAdd);

router.get('/update/:id', authController.isLogin, hotDealsRouter.update);
router.post('/update/:id', authController.isLogin, hotDealsRouter.confirmUpdate);

module.exports = router;