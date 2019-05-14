
const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          const { _id, name, price, productImage } = doc;
          return {
            _id,
            name,
            price,
            productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + _id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
};

exports.products_post_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST"
          }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log(doc);

      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_udpate_product = (req, res, next) => {
  const _id = req.params.productId;

  const props = req.body;
  Product.update({ _id }, props)
    .exec()
    .then(result =>
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "PATCH"
        }
      })
    )
    .catch(error => res.status(500).json(error));
};

exports.products_delete_product = (req, res, next) => {
  const _id = req.params.productId;
  Product.deleteMany({ _id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "DELETE"
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};
