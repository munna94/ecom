const User = require('../models/user')
require('dotenv').config();
const {
    errorHandler
} = require('../helpers/dbErrorHandler')

const userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).send({
                status: 'failed',
                message: 'user not found'
            })
        }
        req.profile = user;
        next();
    })
}

module.exports = {
    userById
};