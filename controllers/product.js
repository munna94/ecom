const Product = require('../models/product')
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
require('dotenv').config();
const {
    errorHandler
} = require('../helpers/dbErrorHandler')

const create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send({
                status: 'failed',
                message: "image could't be uploaded"
            })
        }
        //retrive all fields
        let {
            name,
            price,
            description,
            shipping,
            category,
            quantity
        } = fields;
        if (!name || !price || !description || !shipping || !category || !quantity) {
            return res.status(400).send({
                status: 'failed',
                message: "invalid fiels.Please check all mandetory field."
            })
        }
        let product = new Product(fields); //this will give all the fiels except the file in JSON sent from postman or UI
        //it will take the file from given path as it stores at some loaction by default
        if (files.photo) { //photo is key name of the file which has been sent from postman or UI
            if (files.photo.size > (1000) * 1000) { //1kb*1000=1mb
                return res.status(400).send({
                    status: 'failed',
                    message: "image size can't be more than 1 mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path); //making data as model construct to save
            product.photo.contentType = files.photo.type; //making data as model construct to save
        }
        product.save((err, productResult) => {
            if (err) {
                return res.status(500).send({
                    status: 'failed',
                    message: errorHandler(err)
                })
            }
            res.status(200).send({
                productResult
            });
        })
    })
}

const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).send({
                status: 'failed',
                message: 'invalid product id'
            })
        }
        req.product = product;
        next();
    })
}

const read = (req, res) => {
    //set req.product.photo to undefind b/w of big size
    req.product.photo = undefined;
    res.status(200).send({
        status: 'success',
        message: req.product
    })
}

const remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(500).send({
                status: 'failed',
                message: errorHandler(err)
            })
        }
        res.status(200).send({
            status: 'success',
            message: 'deleted succesfully.'
        })
    })
}

const update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send({
                status: 'failed',
                message: "image could't be uploaded"
            })
        }
        //retrive all fields
        let {
            name,
            price,
            description,
            shipping,
            category,
            quantity
        } = fields;
        if (!name || !price || !description || !shipping || !category || !quantity) {
            return res.status(400).send({
                status: 'failed',
                message: "invalid fiels.Please check all mandetory field."
            })
        }
        let product = req.product;
        product = _.extend(product, fields); //replace old key with only new one key  same as object.assign
        //it will take the file from given path as it stores at some loaction by default
        if (files.photo) { //photo is key name of the file which has been sent from postman or UI
            if (files.photo.size > (1000) * 1000) { //1kb*1000=1mb
                return res.status(400).send({
                    status: 'failed',
                    message: "image size can't be more than 1 mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path); //making data as model construct to save
            product.photo.contentType = files.photo.type; //making data as model construct to save
        }
        product.save((err, productResult) => {
            if (err) {
                return res.status(500).send({
                    status: 'failed',
                    message: errorHandler(err)
                })
            }
            res.status(200).send({
                productResult
            });
        })
    })
}


module.exports = {
    create,
    read,
    remove,
    update,
    productById
};