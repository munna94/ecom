const Product = require('../models/product')
const formidable = require('formidable');
const _ = require('lodash ');
require('dotenv').config();
const {
    errorHandler
} = require('../helpers/dbErrorHandler')

const create = (req, res) => {
    const category = new Product(req.body);
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