const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

const router = express.Router();

router.get('/api/getInsightsData', async (req, res) =>{
    const tickerSymbol  = req.query.tickerValue
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";

    const insiderurl = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${tickerSymbol}&from=2022-01-01&token=${apiKey}`
    const insiderrequest = await axios.get(insiderurl);
    const insiderdata = insiderrequest.data

    let i;
    let MSPRPositive = 0, MSPRNegavtive = 0, ChangePositive = 0, ChangeNegative = 0

    for (i=0;i<insiderdata['data'].length;i++) {
        if (insiderdata['data'][i]['mspr'] >= 0) {
            MSPRPositive += insiderdata['data'][i]['mspr']
        } else {
            MSPRNegavtive += insiderdata['data'][i]['mspr']
        }
        if (insiderdata['data'][i]['change'] >= 0) {
            ChangePositive += insiderdata['data'][i]['change']
        } else {
            ChangeNegative += insiderdata['data'][i]['change']
        }
    }

    const insiderSentiments = {
        'MSPRTotal': MSPRNegavtive + MSPRPositive,
        'MSPRPositive': MSPRPositive,
        'MSPRNegative': MSPRNegavtive,
        'ChangeTotal': ChangeNegative + ChangePositive,
        'ChangePositive': ChangePositive,
        'ChangeNegative': ChangeNegative
    }

    const earningsurl = `https://finnhub.io/api/v1/stock/earnings?symbol=${tickerSymbol}&token=${apiKey}`
    const earningsrequest = await axios.get(earningsurl);
    const earningsdata = earningsrequest.data

    const recommendationurl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${tickerSymbol}&token=${apiKey}`
    const recommendationrequest = await axios.get(recommendationurl);
    const recommendationdata = recommendationrequest.data

    const jsonData = {
        'insiderSentiments': insiderSentiments,
        'earningsdata': earningsdata,
        'recommendationdata': recommendationdata
    }

    res.json(jsonData)
})

module.exports = router;
