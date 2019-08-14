const express = require('express');
const productRouter = express.Router();
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const productController = require('../controllers/product')


productRouter.route("/products").get(productController.list);
productRouter.route("/product/related/:productId").get(productController.listRelated);
productRouter.route("/product/:productId").get(productController.read);
productRouter.route("/product/:productId/:userId").delete(authController.requireSignin, authController.isAuth, authController.isAdmin, productController.remove);
productRouter.route("/product/:productId/:userId").put(authController.requireSignin, authController.isAuth, authController.isAdmin, productController.update);
productRouter.route("/product/create/:userId").post(authController.requireSignin, authController.isAuth, authController.isAdmin, productController.create)
//check parameter
productRouter.param("userId", userController.userById)
productRouter.param("productId", productController.productById)

module.exports = productRouter;