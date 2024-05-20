const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const walletCollection = require('../models/wallet')
const tickerCollection = require('../models/watchList')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/getPortfolioData', async (req, res) => {
    try {
        const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";
        const portfolioMongoDB = await portfolioCollection.find({})
        const walletMongoDB = await walletCollection.find({})
        const tickerMongoDB = await tickerCollection.find({})
        let walletMoney, netWorth, portfolioDataFlagRes, portFolioDataRes, watchListFlagRes, watchListDataRes

        if (walletMongoDB.length == 0) {
            const newWalletMongoDB = new walletCollection({money: '25000'})
            await newWalletMongoDB.save()
            walletMoney = 25000
        } else {
            walletMoney = walletMongoDB[0]['money']
        }

        netWorth = walletMoney

        if (portfolioMongoDB.length === 0) {
            portfolioDataFlagRes = false
            portFolioDataRes = []
        } else {
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

                const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${portfolioMongoDB[i]['tickerValue']}&token=${apiKey}`;
                const requestQuote = await axios.get(baseUrlQuote)
                const quotedata = requestQuote.data

                netWorth += (quantity * quotedata['c'])

                portfolioData.push({
                    "tickerValue": portfolioMongoDB[i]['tickerValue'],
                    "marketValue": (quantity * quotedata['c']).toFixed(2),
                    "changeInPriceFromTotalCost": ((quotedata['c'] - (totalCost/quantity)) * quantity).toFixed(2) ,
                    "changeInPriceFromTotalCostPercent": (((quotedata['c'] - (totalCost/quantity)) * quantity) / ((totalCost/quantity) * quantity) * 100).toFixed(2) ,
                    "quantity": quantity
                })
            }
            portfolioDataFlagRes = true
            portFolioDataRes = portfolioData
        }

        if (tickerMongoDB.length == 0) {
            watchListFlagRes = false
            watchListDataRes = []
        } else {
            const watchListData = []
            let i

            for (i=0; i<tickerMongoDB.length;i++) {
                const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerMongoDB[i]['tickerValue']}&token=${apiKey}`;
                const requestQuote = await axios.get(baseUrlQuote)
                const quotedata = requestQuote.data

                const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerMongoDB[i]['tickerValue']}&token=${apiKey}`;
                const requestProfile = await axios.get(baseUrlProfile);
                const profiledata = requestProfile.data;

                // console.log(profiledata)

                watchListData.push({
                    "stockSymbol": tickerMongoDB[i]['tickerValue'],
                    "stockName": profiledata['name'],
                    "currentPrice": parseFloat(quotedata['c']).toFixed(2),
                    "changeInPrice": parseFloat(quotedata['d']).toFixed(2),
                    "changeInPricePercent":parseFloat(quotedata['dp']).toFixed(2)
                })
            }
            watchListFlagRes = true
            watchListDataRes = watchListData
        }

        res.status(200).json({walletMoney: walletMoney.toFixed(2), netWorth: netWorth.toFixed(2), portfolioDataFlag: portfolioDataFlagRes, portFolioData: portFolioDataRes, watchListFlag: watchListFlagRes, watchListData: watchListDataRes})

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
