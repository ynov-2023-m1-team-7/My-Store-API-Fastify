const Product = require("../models/product.model");

//CRUD

//Create
exports.createProduct = async (req, res) => {
  const productToCreate = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    active: req.body.active,
    thumbnail: req.body.thumbnail,
    packshot: req.body.packshot,
  });
  try {
    const productToSave = await productToCreate.save();
    res.send({
      success: true,
      message: "Product successfully created",
      product: productToSave,
    });
  } catch (error) {
    console.log(error);
  }
};

//Read
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.send({
      success: true,
      message: "Products successfully found",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

//Update
exports.updateProduct = async (req, res) => {
  try {
    const productToUpdate = Product.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      active: req.body.active,
      thumbnail: req.body.thumbnail,
      packshot: req.body.packshot,
    });
    const result = await productToUpdate.exec();
    res.send({
      success: true,
      message: "Product successfully updated",
      product: result,
    });
  } catch (error) {
    console.log(error);
  }
};

//Delete
exports.deleteProduct = async (req, res) => {
  try {
    const productToDelete = Product.findByIdAndDelete(req.body._id);
    const result = await productToDelete.exec();
    res.send({
      success: true,
      message: "Product successfully deleted",
      product: result,
    });
  } catch (error) {
    console.log(error);
  }
};

//Get one product
exports.getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send({
      success: true,
      message: "Product successfully found",
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};
