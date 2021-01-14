let express = require('express');
let router = express.Router();
const dishesController = require('./controller');
const authController = require('../auth/controller')
/* GET home page. */
router.get('/', authController.isLogin, dishesController.index);
router.post('/',authController.isLogin, dishesController.delete)

router.get('/update/:id', authController.isLogin, dishesController.update)
router.post('/update/:id',authController.isLogin, dishesController.updateInfo)

router.get('/add', authController.isLogin, dishesController.add)
router.post('/add', authController.isLogin, dishesController.addInfo)

module.exports = router;
