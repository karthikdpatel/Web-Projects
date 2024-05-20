const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

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

const router = express.Router();

router.get('/api/getSummaryDetails', async (req, res) => {
    const tickerSymbol  = req.query.tickerValue
    const isOpen = req.query.isOpen
    const stockLastUpdatedUNIXTimeStamp = req.query.stockLastUpdatedUNIXTimeStamp

    console.log(stockLastUpdatedUNIXTimeStamp)

    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";

    const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestQuote = await axios.get(baseUrlQuote)
    const quotedata = requestQuote.data

    const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestProfile = await axios.get(baseUrlProfile);
    const profiledata = requestProfile.data;

    const baseURLPeers = `https://finnhub.io/api/v1/stock/peers?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestPeers = await axios.get(baseURLPeers);
    const profilePeers = requestPeers.data;

    let toDate, fromDate
    if (isOpen === 'true') {
        console.log(true)
        const date = new Date()
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        toDate = `${year}-${month}-${day}`

        const oneDayinMilli = 24*60*60*1000
        const previousDay = new Date(date.getTime() - oneDayinMilli)
        const prevYear = previousDay.getFullYear()
        const prevMonth = ('0' + (previousDay.getMonth() + 1)).slice(-2);
        const prevDay = ('0' + previousDay.getDate()).slice(-2);
        fromDate = `${prevYear}-${prevMonth}-${prevDay}`
    } else {
        console.log(false)
        const milliSecond = stockLastUpdatedUNIXTimeStamp * 1000
        const date = new Date(milliSecond)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        toDate = `${year}-${month}-${day}`

        const oneDayinMilli = 24*60*60*1000
        const previousDay = new Date(milliSecond - oneDayinMilli)
        const prevYear = previousDay.getFullYear()
        const prevMonth = ('0' + (previousDay.getMonth() + 1)).slice(-2);
        const prevDay = ('0' + previousDay.getDate()).slice(-2);
        fromDate = `${prevYear}-${prevMonth}-${prevDay}`

    }

    console.log(fromDate)
    console.log(toDate)
    fromDate = '2024-05-15'
    toDate = '2024-05-16'
    console.log(fromDate)
    console.log(toDate)

    const polygon_api_key = "HH3zcaj76iqpWQfTe6HOb03X5xX4oJU0"
    const chart_url = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`
    const requestCharts = await axios.get(chart_url);
    const chart_data = requestCharts.data;
    console.log(chart_data)
    const summaryChartData = chart_data['results'].map((val) => [unixTimestampToDateTime(val.t), val.c])

    const jsonData = [{
        "highprice":  quotedata['h'],
        "lowprice": quotedata['l'],
        "openprice": quotedata['o'],
        "prevclose": quotedata['pc'],
        "timestamp": quotedata['t'],
        "ipostartdate": profiledata['ipo'],
        "industry": profiledata['finnhubIndustry'],
        "webpage": profiledata['weburl'],
        "companypeers": profilePeers,
        "summaryTabChartData": summaryChartData
    }]

    res.json(jsonData)
});

module.exports = router;
