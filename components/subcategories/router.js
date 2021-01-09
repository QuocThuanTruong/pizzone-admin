let express = require('express');
let router = express.Router();
const subcategoriesController = require('./controller');
const authController = require('../auth/controller')

router.get('/', authController.isLogin, subcategoriesController.index);
router.get('/add', authController.isLogin, subcategoriesController.add);
router.get('/update/:id', authController.isLogin, subcategoriesController.update);
module.exports = router;
