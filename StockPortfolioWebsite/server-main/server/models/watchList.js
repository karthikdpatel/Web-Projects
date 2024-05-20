const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    tickerValue : {type:String, require:true, unique:true}
});

const tickerCollection = mongoose.model('ticker', itemSchema)

module.exports = tickerCollection;
