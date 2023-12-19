const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true, default: false },
    thumbnail: { type: String, required: true },
    packshot: { type: String, required: true, default: "/uploads/" }
});

module.exports = mongoose.model("Product", productSchema);