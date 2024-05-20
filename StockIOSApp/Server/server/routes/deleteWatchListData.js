const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const mongoose = require('mongoose');
const tickerCollection = require('../models/watchList')

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/deleteItemWatchList', async (req, res) => {
    try {
        const tickerSymbol  = req.query.tickerSymbol

        const tickerMongoDB = await tickerCollection.findOne({tickerValue: tickerSymbol})

        await tickerMongoDB.deleteOne({tickerValue: tickerSymbol})
        res.status(200).json({ message: `${tickerSymbol} deleted from Watchlist` })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
