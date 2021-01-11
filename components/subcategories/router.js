let express = require('express');
let router = express.Router();
const subcategoriesController = require('./controller');
const authController = require('../auth/controller')

router.get('/', /*authController.isLogin, */subcategoriesController.index);
router.post('/', /*authController.isLogin, */subcategoriesController.delete);

router.get('/add', /*authController.isLogin,*/ subcategoriesController.add);
router.post('/add', /*authController.isLogin,*/ subcategoriesController.confirmAdd);

router.get('/update/:id', /*authController.isLogin,*/ subcategoriesController.update);
router.post('/update/:id', /*authController.isLogin,*/ subcategoriesController.confirmUpdate);


module.exports = router;
