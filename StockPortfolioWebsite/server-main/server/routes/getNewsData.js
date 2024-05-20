const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

const router = express.Router();

router.get('/api/getNewsData', async (req, res) => {
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";

    const tickerSymbol  = req.query.tickerValue
    const date = new Date()
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const toDate = `${year}-${month}-${day}`

    const sevenDaysAgo = new Date(date.getTime() - 7*24*60*60*1000)
    const sevenDaysAgoYear = sevenDaysAgo.getFullYear()
    const sevenDaysAgoMonth = ('0' + (sevenDaysAgo.getMonth() + 1)).slice(-2);
    const sevenDaysAgoDay = ('0' + sevenDaysAgo.getDate()).slice(-2);
    const fromDate = `${sevenDaysAgoYear}-${sevenDaysAgoMonth}-${sevenDaysAgoDay}`

    const baseUrl = `https://finnhub.io/api/v1/company-news?symbol=${tickerSymbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`;
    const request = await axios.get(baseUrl)
    const data = request.data

    const newsData = []
    let i = 0;

    while ((newsData.length < 20) & (i < data.length)) {
        if ((data[i]['headline'] !== '') & (data[i]['image'] !== '') & (data[i]['datetime'] !== '') & (data[i]['source'] !== '') & (data[i]['summary'] !== '') & (data[i]['url'] !== '') ) {
            newsData.push(data[i])
        }
        i += 1
    }

    res.json(newsData)
});

module.exports = router;
