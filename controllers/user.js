const User = require('../models/user')
const {
    errorHandler
} = require('../helpers/dbErrorHandler')

const jwt = require('jsonwebtoken'); //require to generate signed token
const expressJwt = require('express-jwt'); // to authorize check

const signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save((err, savedUserResult) => {
        if (err) res.status(500).send({
            staus: 'failed',
            message: errorHandler(err)
        })
        else {
            savedUserResult.salt = undefined;
            savedUserResult.hashed_password = undefined;
            res.status(200).send({
                status: 'success',
                message: 'signup successfully',
                data: savedUserResult
            })
        }

    })

}
let signin = (req, res) => {
    const {
        email,
        password
    } = req.body;
    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            res.status(400).send({
                status: 'failed',
                message: 'user with this email not exists.Please signup first.'
            })
        } //if found then make sure username and password matched
        else if (!user.authenticate(password)) {
            return res.status(401).send({
                status: 'failed',
                message: 'unauthorized user.'
            })
        } else {
            //generate signed token with user id and secret
            const token = jwt.sign({
                _id: user._id
            }, process.env.JWT_SECRET);
            //persisit the token in cookie with expiry as t
            res.cookie('t', token, {
                expire: new Date() + 600
            }); //600 sec
            const {
                _id,
                email,
                name,
                role
            } = user;
            //then return response with user and token to frontend client
            res.status(200).send({
                token,
                user: {
                    _id,
                    email,
                    name,
                    role
                }
            })

        }
    })

}

module.exports = {
    signup,
    signin
};