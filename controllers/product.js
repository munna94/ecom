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
    let product = req.product; //monggose works on result of find model.find().remove or update since req.product is result of find so it will work.because is js object has refrence
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

//by sell=/products?sortBy=sold&order=desc&limit=4;
//if no param send all
const list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let size = req.query.size ? parseInt(req.query.size) : 10;
    let skip = size * (page - 1);
    let limit = size;

    Product.find({}, {
            "photo": 0
        })
        .populate('category')
        .sort([
            [sortBy, order]
        ])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).send({
                    status: 'failed',
                    message: 'product not found'
                })
            }
            res.status(200).send(products)

        })

}

/**
 * it will find the products based on the req product category
 * and the product which has same category get returned
 * 
 */
const listRelated = (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let size = req.query.size ? parseInt(req.query.size) : 10;
    let skip = size * (page - 1);
    let limit = size;
    Product.find({
            _id: {
                $ne: req.product //this is for other than current produt _Id
            },
            category: req.product.category
        }, {
            photo: 0
        })
        .skip(skip)
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, productOtherthanCurrent) => {
            if (err) {
                return res.status(400).send({
                    status: 'failed',
                    message: 'product not found'
                })
            }
            res.status(200).send(productOtherthanCurrent)
        })

}

const listcategories = (req, res) => {
    Product.distinct("category", {}).populate('category').exec((err, categories) => {
        if (err) {
            return res.status(500).send({
                status: 'failed',
                message: errorHandler(err)
            })
        }
        res.status(200).send({
            categories
        })
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

const listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 2;
    let skip = req.body.skip ? parseInt(req.body.limit) : 0;
    let findArgs = {};


    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


const photo = (req, res) => {
    console.log(req.product.photo.contentType);

    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.status(200).send(req.product.photo.data)

    }
}

module.exports = {
    create,
    read,
    remove,
    update,
    productById,
    list,
    listRelated,
    listcategories,
    listBySearch,
    photo
};