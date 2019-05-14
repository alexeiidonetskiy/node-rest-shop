const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ message: "Email exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json(err);
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            console.log(user);
            user
              .save()
              .then(result => res.status(201).json({ message: "User created" }))
              .catch(error => res.status(500).json(error));
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      //Search if user are exist
      if (user.length < 1) {
        return res.status(401).json({ message: "Auth failed" });
      } else {
        //If user exist, then create crypted password
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          console.log("result", result);
          console.log("err", err);

          //If no have rusult of faced with an error - make exeption
          if (!result || err) {
            return res.status(401).json({ message: "Auth failed" });
          }

          //If have result, then make token
          if (result) {
            const { email, _id: userId } = user[0];
            const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
              expiresIn: "1h"
            });

            return res.status(200).json({ message: "Auth successful", token });
          }
        });
      }
    })
    .catch(err => res.status(500).json(err));
};

exports.user_delete = (req, res, next) => {
  User.deleteMany({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({ message: "User deleted" });
    })
    .catch(err => res.status(500).json(err));
};
