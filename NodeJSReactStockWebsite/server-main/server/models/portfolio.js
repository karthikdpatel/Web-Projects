const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    tickerValue : {type:String, require:true},
    quantity : {type:Array, require: true},
    costPerStock: {type:Array, require: true}
});

const portfolioCollection = mongoose.model('portfolio', itemSchema)

module.exports = portfolioCollection;
