const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const walletCollection = require('../models/wallet')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

router.get('/api/getWalletMoney', async (req, res) => {
    try {
        const walletMongoDB = await walletCollection.find({})
        if (walletMongoDB.length == 0) {
            const newWalletMongoDB = new walletCollection({money: '25000'})
            await newWalletMongoDB.save()
            res.json({money:25000})
        } else {
            res.json({money:walletMongoDB[0]['money']})
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
