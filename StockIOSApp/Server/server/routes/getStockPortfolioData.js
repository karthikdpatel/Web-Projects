const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const walletCollection = require('../models/wallet')
const tickerCollection = require('../models/watchList')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

function unixTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function unixTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

router.get("/api/getStockPortfolioData", async (req, res) => {
    const tickerSymbol = req.query.tickerSymbol;
    let i
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";

    const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestQuote = await axios.get(baseUrlQuote)
    const quotedata = requestQuote.data

    const portfolioMongoDB = await portfolioCollection.findOne({tickerValue:tickerSymbol})

    let shareQuantity = 0, shareTotalCost = 0, shareBroughtFlag = false

    if (portfolioMongoDB != null) {
        for (i=0;i<portfolioMongoDB.quantity.length;i++){
            shareQuantity += Number(portfolioMongoDB.quantity[i])
            shareTotalCost += (Number(portfolioMongoDB.quantity[i]) * Number(portfolioMongoDB.costPerStock[i]))
        }
    }
    if (shareQuantity > 0) {
        shareBroughtFlag = true
    }

    const portFolioData = {
        'stockBroughtFlag' : shareBroughtFlag,
        'stocksOwnedQuantity' : shareQuantity,
        'AvgCostPerShare' : (shareTotalCost/shareQuantity).toFixed(2),
        'TotalCost' : (shareTotalCost).toFixed(2),
        'Change' : (shareQuantity * parseFloat(quotedata['c']) - shareTotalCost).toFixed(2),
        'MarketValue' : (shareQuantity * parseFloat(quotedata['c'])).toFixed(2),
        'CurrentPrice' : (quotedata['c']).toFixed(2),
        "changeInPrice": parseFloat(quotedata['d']).toFixed(2),
        "changeInPricePercent":parseFloat(quotedata['dp']).toFixed(2)
    }

    const jsonData = {
        'stockBroughtFlag' : shareBroughtFlag,
        'stocksOwnedQuantity' : shareQuantity,
        'AvgCostPerShare' : (shareTotalCost/shareQuantity).toFixed(2),
        'TotalCost' : (shareTotalCost).toFixed(2),
        'Change' : (shareQuantity * parseFloat(quotedata['c']) - shareTotalCost).toFixed(2),
        'MarketValue' : (shareQuantity * parseFloat(quotedata['c'])).toFixed(2),
        'CurrentPrice' : (quotedata['c']).toFixed(2),
        "changeInPrice": parseFloat(quotedata['d']).toFixed(2),
        "changeInPricePercent":parseFloat(quotedata['dp']).toFixed(2)
    }
    res.json(jsonData)

})

module.exports = router;