const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category')
const authController = require('../controllers/auth')
const userController = require('../controllers/user')



categoryRouter.route("/category/create/:userId").post(authController.requireSignin, authController.isAuth, authController.isAdmin, categoryController.create)
//check parameter
categoryRouter.param("userId", userController.userById)

module.exports = categoryRouter;