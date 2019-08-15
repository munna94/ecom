const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user')
const authController = require('../controllers/auth')

// const {
//     userSignupValidator
// } = require('../validators/userValidator');
//to access this we need to be authenticate means we can't get details by using others token
//and also it should be admin
userRouter.get("/secret/:userId", authController.requireSignin, authController.isAuth, authController.isAdmin, (req, res) => {
    res.send({
        profile: req.profile
    })
})

userRouter.route("/user/:userId").get(authController.requireSignin, authController.isAuth, userController.read);
userRouter.route("/user/:userId").put(authController.requireSignin, authController.isAuth, userController.update)
//check parameter
userRouter.param("userId", userController.userById)



module.exports = userRouter;