var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
require('dotenv').config();
const CryptoJS = require("crypto-js");

console.log("env", process.env.MONGO_SRV);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var categoriesRouter = require('./routes/categories');
const { log } = require('console');

var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(process.env.MONGO_SRV)
.then(client => {
    console.log("Connected!");

    const db = client.db("victoria-lundberg");
    app.locals.db = db;
})

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoriesRouter);


module.exports = app;
