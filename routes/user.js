const express = require('express');
const masterRouter = express.Router();
const userController = require('../controllers/user')
const {
    userSignupValidator
} = require('../validators/userValidator');

masterRouter.route("/signup").post(userSignupValidator, userController.signup);
masterRouter.route("/signin").post(userSignupValidator, userController.signin)








module.exports = masterRouter;