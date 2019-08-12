const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
require('dotenv').config();
const expressvalidator = require('express-validator');
//db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then((err, result) => {
    //if (err) console.log(err);
    console.log('db connected');
})
//middleware
app.use(morgan('dev'));
//middleware to create json data from request body
app.use(bodyParser.json());
//middleware to use cookie-parse to save details in cookie
app.use(cookieParser());
//middleware to validate
app.use(expressvalidator());
//middleware for user router
app.use("/api", userRoutes)
app.listen(process.env.PORT, (err, result) => {
    console.log(`server is running on port ${process.env.PORT}`);
});