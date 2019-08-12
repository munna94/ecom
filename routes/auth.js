const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth')
const {
    userSignupValidator
} = require('../validators/userValidator');

authRouter.route("/signup").post(userSignupValidator, authController.signup);
authRouter.route("/signin").post(authController.signin);
authRouter.route("/signout").get(authController.signout)








module.exports = authRouter;