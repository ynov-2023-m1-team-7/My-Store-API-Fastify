const mongoose = require('mongoose');

// filter model

const filterSchema = new mongoose.Schema({
    minPrice: Number,
    maxPrice: Number
});

module.exports = mongoose.model('Filter', filterSchema);