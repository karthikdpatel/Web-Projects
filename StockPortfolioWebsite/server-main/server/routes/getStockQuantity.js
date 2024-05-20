const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/getStockQuantity', async (req, res) => {
    try {
        const tickerValue  = req.query.tickerValue
        const portfolioMongoDB = await portfolioCollection.findOne({tickerValue:tickerValue})
        if (!portfolioMongoDB) {
            res.json({stockStatus:false, quantity:0})
        } else {
            let i, quantity = 0

            for (i=0;i<portfolioMongoDB.quantity.length;i++) {
                quantity += Number(portfolioMongoDB.quantity[i])
            }
            res.json({stockStatus:true, quantity:quantity})
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;