const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRoutes = require("./api/routes/users");

mongoose.connect(
  `mongodb+srv://admin:${
    process.env.MONGO_ATLAS_PW
  }@node-rest-shop-f4pao.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
);

// Logger middleware
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'))
//Request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Autorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

//Erors middleware
app.use((req, res, next) => {
  const error = new Error("Non found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
