let express = require('express');
let router = express.Router();
const hotDealsRouter = require('./controller');
const authController = require('../auth/controller')

router.get('/', authController.isLogin, hotDealsRouter.index);
router.get('/add', authController.isLogin, hotDealsRouter.add);
router.get('/update/:id', authController.isLogin, hotDealsRouter.update);
module.exports = router;