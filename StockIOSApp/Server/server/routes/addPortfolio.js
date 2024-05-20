const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const walletCollection = require('../models/wallet')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/addPortfolio', async (req, res) => {
    try {
        const tickerValue  = req.query.tickerValue
        const quantity  = req.query.quantity
        const costPerStock  = req.query.costPerStock

        const portfolioMongoDB = await portfolioCollection.findOne({tickerValue:tickerValue})

        if (!portfolioMongoDB) {
            const newPortfolio = new portfolioCollection({
            tickerValue : tickerValue,
            quantity : [quantity],
            costPerStock: [costPerStock]});
            await newPortfolio.save();
        } else {
            portfolioMongoDB.quantity.push(quantity)
            portfolioMongoDB.costPerStock.push(costPerStock)
            await portfolioMongoDB.save();
        }

        const walletMongoDB = await walletCollection.findOne({})
        walletMongoDB.money = (Number(walletMongoDB.money) - (Number(quantity) * Number(costPerStock)))
        await walletMongoDB.save()

        res.json({message:'Done', moneyLeft:(Number(walletMongoDB.money))})

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
