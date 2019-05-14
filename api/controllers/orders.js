const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    //@TODO Find solution, why populate isn't working
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: { ...doc.product, hardcode: "foo" },
            quantity: doc.quantity
          };
        })
      });
    })
    .catch(error => res.status(500).json(error));
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product ID is invalid" });
      }

      const { productId, quantity } = req.body;
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId,
        quantity
      });

      return order.save();
    })
    .then(order =>
      res.status(201).json({ message: "Order were fetched", order })
    )
    .catch(error =>
      res.status(500).json({ message: "Order not found ", error })
    );
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order detail", order });
    })
    .catch(error => res.status(500).json(error));
};

exports.orders_delete_order = (req, res, next) => {
  const _id = req.body.orderId;
  Order.deleteMany({ _id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted"
      });
    })
    .catch(error => res.status(500).json(error));
};
