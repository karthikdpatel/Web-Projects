const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const tickerCollection = require('../models/watchList')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/addWatchList', async (req, res) => {
    try {
        const tickerSymbol  = req.query.tickerValue

        const tickerMongoDB = await tickerCollection.findOne({tickerValue: tickerSymbol})
        if (!tickerMongoDB) {
            const newTicker = new tickerCollection({tickerValue: tickerSymbol});
            await newTicker.save();
        }
        res.json({ message: `${tickerSymbol} added to watchlist` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
