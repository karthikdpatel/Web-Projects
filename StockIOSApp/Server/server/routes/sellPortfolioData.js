const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const walletCollection = require('../models/wallet')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/updatePortfolio', async (req, res) => {
    try {
        const tickerValue = req.query.tickerValue
        let quantity = req.query.quantity

        const portfolioMongoDB = await portfolioCollection.findOne({tickerValue:tickerValue})
        let i = 0, cost = 0

        while (i < portfolioMongoDB['quantity'].length && quantity > 0) {

            if (Number(portfolioMongoDB['quantity'][i]) - Number(quantity) <=0 ) {
                quantity = Number(quantity) - Number(portfolioMongoDB['quantity'][i])
                cost += (Number(portfolioMongoDB['quantity'][i]) * Number(portfolioMongoDB['costPerStock'][i]))
                portfolioMongoDB['quantity'][i] = '0'
            } else {
                portfolioMongoDB['quantity'][i] = (Number(portfolioMongoDB['quantity'][i]) - Number(quantity)).toString()
                cost += (Number(quantity) * Number(portfolioMongoDB['costPerStock'][i]))
                quantity = 0
            }
            i++
        }
        await portfolioMongoDB.save()

        const walletMongoDB = await walletCollection.findOne({})
        walletMongoDB.money = (Number(walletMongoDB.money) + cost)
        walletMongoDB.save()

        res.status(200).json( {message: 'Success', cost:cost, moneyLeft:(Number(walletMongoDB.money))})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
