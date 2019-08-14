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

const categoryId = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).send({
                status: 'failed',
                message: 'invalid product id'
            })
        }
        req.category = category;
        next();
    })
}

const read = (req, res) => {
    res.status(200).send({
        status: 'success',
        message: req.category
    })
}

const remove = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.remove((err, data) => {
        if (err) {
            return res.status(500).send({
                sttaus: 'failed',
                message: errorHandler(err)
            })
        }
        res.status(200).send({
            status: 'suceess',
            message: 'deleted successfully. '
        });
    })


}
const update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(500).send({
                sttaus: 'failed',
                message: errorHandler(err)
            })
        }
        res.status(200).send(data);
    })

}
const list = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(500).send({
                sttaus: 'failed',
                message: errorHandler(err)
            })
        }
        res.status(200).send({
            status: 'success',
            message: categories
        })
    })

}
module.exports = {
    create,
    categoryId,
    read,
    remove,
    update,
    list
};