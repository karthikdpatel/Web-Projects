const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

const router = express.Router();

router.get("/api/getStockTickerSuggestion",
    async (req, res) => {
    const tickerSymbol = req.query.tickerSymbol;
    const baseUrl = "https://finnhub.io/api/v1/search";
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";
    let suggestions = [];

    const params = {
      q: tickerSymbol,
      token: apiKey
    };

    const request = await axios.get(baseUrl, {
      params: params,
    });

    if (request.status !== 200) {
        console.log("API Connection Error")
    }

    const data = request.data;

    for (let i=0; i < data.result.length; i++) {
        let symbol = data.result[i].displaySymbol
        if (symbol.indexOf('.') === -1) {
            //suggestions.push(symbol + ' | ' + data.result[i].description)
            suggestions.push({'tickerSymbol' : symbol, 'tickerName' : data.result[i].description})
        }
    }

    res.json({'suggestions': suggestions});
    }
)

module.exports = router;
