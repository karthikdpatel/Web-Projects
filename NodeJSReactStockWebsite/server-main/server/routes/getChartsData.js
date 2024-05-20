const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');

function unixTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const router = express.Router();

router.get('/api/getChartsData', async (req, res) => {
    const tickerSymbol  = req.query.tickerValue

    const polygon_api_key = "HH3zcaj76iqpWQfTe6HOb03X5xX4oJU0"

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const toDate = `${year}-${month}-${day}`
    const fromDate = `${year - 2}-${month}-${day}`

    const chart_url = `https://api.polygon.io/v2/aggs/ticker/${tickerSymbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`
    const requestCharts = await axios.get(chart_url);
    const chart_data = []
    let i

    for (i=0;i<requestCharts.data['results'].length;i++) {
        chart_data.push({
            'v': requestCharts.data['results'][i]['v'],
            'vw': requestCharts.data['results'][i]['vw'],
            'o': requestCharts.data['results'][i]['o'],
            'c': requestCharts.data['results'][i]['c'],
            'h': requestCharts.data['results'][i]['h'],
            'l': requestCharts.data['results'][i]['l'],
            't': requestCharts.data['results'][i]['t'],
            'n': requestCharts.data['results'][i]['n']
        })
    }

    res.json(chart_data)
});

module.exports = router;
