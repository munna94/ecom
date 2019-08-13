const Category = require('../models/category')
require('dotenv').config();
const {
    errorHandler
} = require('../helpers/dbErrorHandler')

const create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) return res.status(500).send({
            status: 'failed',
            message: errorHandler(err),
            data: req.body
        })
        res.status(200).send({
            data
        });


    })
}


module.exports = {
    create
};