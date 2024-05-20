const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

const router = express.Router();

function unixTimestampToDateTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function isOpen(lastStockUpdateTimestamp) {
    const currentUnixTimestamp = Date.now()
    const currentUnixTimestampSecond = Math.floor(currentUnixTimestamp/ 1000)
    if ((currentUnixTimestampSecond - lastStockUpdateTimestamp) > 300) {
        return false;
    } else {
        return true;
    }
}

router.get("/api/getStockOverview", async (req, res) => {
    const tickerSymbol  = req.query.tickerValue
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";

    const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestProfile = await axios.get(baseUrlProfile);
    const profiledata = requestProfile.data;

    const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestQuote = await axios.get(baseUrlQuote)
    const quotedata = requestQuote.data



    const jsonData = [{
        "companyCode" : profiledata['ticker'],
        "companyName" : profiledata['name'],
        "tradingExchangeCode" : profiledata['exchange'],
        "companyLogo" : profiledata['logo'],
        "lastPrice" : parseFloat(quotedata['c']).toFixed(2),
        "change" : parseFloat(quotedata['d']).toFixed(2),
        "changePercent" : parseFloat(quotedata['dp']).toFixed(2),
        "stockLastUpdatedTimestamp" : quotedata['t'],
        "marketStatus" : isOpen(quotedata['t'])
    }]

    res.json(jsonData);

})

module.exports = router;
