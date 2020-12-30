var express = require('express');
var router = express.Router();
const subcategoriesController = require('./controller');

/* GET home page. */
router.get('/', subcategoriesController.index);
router.get('/add', subcategoriesController.add);
router.get('/update/:id', subcategoriesController.update);
module.exports = router;
