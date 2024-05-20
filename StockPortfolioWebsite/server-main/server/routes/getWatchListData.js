const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const mongoose = require('mongoose');
const tickerCollection = require('../models/watchList')

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/getWatchListData', async (req, res) => {
    try {
        const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";
        const tickerMongoDB = await tickerCollection.find()
        console.log(tickerMongoDB)

        const jsonOutput = []
        let i
        for (i=0;i<tickerMongoDB.length;i++) {
            const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerMongoDB[i]['tickerValue']}&token=${apiKey}`;
            const requestProfile = await axios.get(baseUrlProfile);
            const profiledata = requestProfile.data;

            const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerMongoDB[i]['tickerValue']}&token=${apiKey}`;
            const requestQuote = await axios.get(baseUrlQuote)
            const quotedata = requestQuote.data

            jsonOutput.push({
                "companyCode" : tickerMongoDB[i]['tickerValue'],
                "companyName" : profiledata['name'],
                "lastPrice" : parseFloat(quotedata['c']).toFixed(2),
                "change" : parseFloat(quotedata['d']).toFixed(2),
                "changePercent" : parseFloat(quotedata['dp']).toFixed(2)
            })
        }
        res.json(jsonOutput);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
