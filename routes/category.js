const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category')
const authController = require('../controllers/auth')
const userController = require('../controllers/user')


categoryRouter.route("/category/:categoryId").get(categoryController.read)
categoryRouter.route("/categories").get(categoryController.list)
categoryRouter.route("/category/:categoryId/:userId").put(authController.requireSignin, authController.isAuth, authController.isAdmin, categoryController.update)
categoryRouter.route("/category/:categoryId/:userId").delete(authController.requireSignin, authController.isAuth, authController.isAdmin, categoryController.remove)

categoryRouter.route("/category/create/:userId").post(authController.requireSignin, authController.isAuth, authController.isAdmin, categoryController.create)
//check parameter
categoryRouter.param("userId", userController.userById)
categoryRouter.param("categoryId", categoryController.categoryId)

module.exports = categoryRouter;