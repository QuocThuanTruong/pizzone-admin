var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

require("dotenv").config();
require('./components/admin/helper')(hbs);
require('./components/dishes/helper')(hbs);

const authRouter = require('./components/auth/router')
const adminRouter = require('./components/admin/router');
const dishesRouter = require('./components/dishes/router');
const usersRouter = require('./components/users/router')
const ordersRouter = require('./components/orders/router')
const categoriesRouter = require('./components/categories/router')
const subcategoriesRouter = require('./components/subcategories/router')

var app = express();

// register partials
hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/dashboard', adminRouter);
app.use('/admin/profile', adminRouter);
app.use('/manage-dishes', dishesRouter);
app.use('/manage-users', usersRouter);
app.use('/manage-orders', ordersRouter);
app.use('/manage-categories/dishes-categories', categoriesRouter);
app.use('/manage-categories/dishes-subcategories', subcategoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errors/error');
});

module.exports = app;
