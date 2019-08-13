const express = require('express');
const productRouter = express.Router();
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const productController = require('../controllers/product')




productRouter.route("/product/create/:userId").post(authController.requireSignin, authController.isAuth, authController.isAdmin, productController.create)
//check parameter
productRouter.param("userId", userController.userById)

module.exports = productRouter;