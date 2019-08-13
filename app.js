const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

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

//this is used to remove cors error while calling the api from clients
let cors = require("cors");
app.use(cors());
//app.use(express.bodyParser({limit: '50mb'}));
app.use(express.urlencoded({
    extended: false,
    limit: "500mb"
}));
app.use(express.json({
    limit: "50mb"
}));

//middleware to accept CORs
app.use(function (req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});



//middleware
app.use(morgan('dev'));
//middleware to create json data from request body
app.use(bodyParser.json());
//middleware to use cookie-parse to save details in cookie
app.use(cookieParser());
//middleware to validate
app.use(expressvalidator());
//middleware for user router
app.use("/api", authRoutes, userRoutes, categoryRoutes, productRoutes)
app.listen(process.env.PORT, (err, result) => {
    console.log(`server is running on port ${process.env.PORT}`);
});