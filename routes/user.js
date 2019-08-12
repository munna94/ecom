const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user')
const authController = require('../controllers/auth')

// const {
//     userSignupValidator
// } = require('../validators/userValidator');
userRouter.get("/secret/:userId", authController.requireSignin, authController.isAuth, authController.isAdmin, (req, res) => {
    res.send({
        profile: req.profile
    })
})
//check parameter
userRouter.param("userId", userController.userById)



module.exports = userRouter;