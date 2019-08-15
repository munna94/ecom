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

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).send(req.profile);
}
const update = (req, res) => {
    User.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        }, {
            new: true,
            useFindAndModify: false
        },
        (err, updatedProfile) => {
            if (err || !updatedProfile) {
                return res.status(400).send({
                    status: 'failed',
                    message: 'not authorized..'
                })
            }
            updatedProfile.hashed_password = undefined;
            updatedProfile.salt = undefined;
            return res.status(202).send({
                updatedProfile
            })
        })
}

module.exports = {
    userById,
    read,
    update
};