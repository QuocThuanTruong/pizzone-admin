let express = require('express');
let router = express.Router();
const categoriesController = require('./controller');
const authController = require('../auth/controller')

/* GET home page. */
router.get('/',  authController.isLogin, categoriesController.index);
router.post('/',  authController.isLogin, categoriesController.delete);

router.get('/add',authController.isLogin,categoriesController.add);
router.post('/add', authController.isLogin, categoriesController.confirmAdd);

router.get('/update/:id', authController.isLogin, categoriesController.update);
router.post('/update/:id', authController.isLogin, categoriesController.confirmUpdate);

module.exports = router;
