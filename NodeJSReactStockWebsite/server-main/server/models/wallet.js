const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    money : {type:Number, require:true}
});

const walletCollection = mongoose.model('wallet', itemSchema)

module.exports = walletCollection;
