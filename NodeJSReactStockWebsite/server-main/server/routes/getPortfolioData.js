const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/getPortfolioData', async (req, res) => {
    try {
        const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";
        const portfolioMongoDB = await portfolioCollection.find({})
        const portfolioData = []
        let i, quantity, totalCost, j

        for (i=0;i<portfolioMongoDB.length;i++) {
            quantity = 0
            totalCost = 0
            for (j=0;j<portfolioMongoDB[i]['quantity'].length;j++) {
                quantity += Number(portfolioMongoDB[i]['quantity'][j])
                totalCost += (Number(portfolioMongoDB[i]['quantity'][j]) * Number(portfolioMongoDB[i]['costPerStock'][j]))
            }

            if (quantity == 0) {
                continue
            }

            const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${portfolioMongoDB[i]['tickerValue']}&token=${apiKey}`;
            const requestProfile = await axios.get(baseUrlProfile);
            const profiledata = requestProfile.data;

            const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${portfolioMongoDB[i]['tickerValue']}&token=${apiKey}`;
            const requestQuote = await axios.get(baseUrlQuote)
            const quotedata = requestQuote.data

            console.log(quotedata)

            portfolioData.push({
                tickerValue: portfolioMongoDB[i]['tickerValue'],
                companyName: profiledata['name'],
                quantity: quantity,
                totalCost: totalCost,
                currentPrice: parseFloat(quotedata['c']).toFixed(2)
            })
        }

        res.json(portfolioData)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
