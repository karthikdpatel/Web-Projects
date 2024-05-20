const axios = require('axios')
const express = require('express');
const { Request, Response } = require('express');
const portfolioCollection = require('../models/portfolio')
const walletCollection = require('../models/wallet')
const tickerCollection = require('../models/watchList')
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb+srv://karthikdp99:karthikmongodb@cluster0.htt5jtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

function unixTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function unixTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

router.get("/api/getStockDetailedInfo", async (req, res) => {
    const tickerSymbol = req.query.tickerSymbol;
    const polygon_api_key = "HH3zcaj76iqpWQfTe6HOb03X5xX4oJU0"
    const apiKey = "cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650";
    let i
    let toDate, fromDate
    const oneDayinMilli = 24*60*60*1000

    const currdate = new Date()
    const date = new Date(currdate.getTime() + oneDayinMilli)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    toDate = `${year}-${month}-${day}`

    const previousDay = new Date(currdate.getTime() - oneDayinMilli)
    const prevYear = previousDay.getFullYear()
    const prevMonth = ('0' + (previousDay.getMonth() + 1)).slice(-2);
    const prevDay = ('0' + previousDay.getDate()).slice(-2);
    fromDate = `${prevYear}-${prevMonth}-${prevDay}`


    //const hourly_price_variation_chart_url = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`
    const hourly_price_variation_chart_url = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2024-04-19/2024-04-20?adjusted=true&sort=asc&apiKey=${polygon_api_key}`
    const request_hourly_price_variation_charts = await axios.get(hourly_price_variation_chart_url);
    const hourly_price_variation_chart_data = request_hourly_price_variation_charts.data;
    let datetimeList = [];
    let valueList = [];
    for (i=0;i<hourly_price_variation_chart_data.results.length;i++){
        datetimeList.push(unixTimestampToDateTime(hourly_price_variation_chart_data.results[i].t).slice(11,16));
        valueList.push(parseFloat((hourly_price_variation_chart_data.results[i].c).toFixed(2)));
    }

    const hourly_price_variation_data = {
        'datetime': datetimeList,
        'value': valueList
    }

    const historical_chart_date = new Date();
    const historical_chart_year = historical_chart_date.getFullYear();
    const historical_chart_month = String(historical_chart_date.getMonth() + 1).padStart(2, '0');
    const historical_chart_day = String(historical_chart_date.getDate()).padStart(2, '0');

    const historical_chart_toDate = `${historical_chart_year}-${historical_chart_month}-${historical_chart_day}`
    const historical_chart_fromDate = `${historical_chart_year - 2}-${historical_chart_month}-${historical_chart_day}`

    const historical_chart_url = `https://api.polygon.io/v2/aggs/ticker/${tickerSymbol}/range/1/day/${historical_chart_fromDate}/${historical_chart_toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`
    const request_historical_chart = await axios.get(historical_chart_url);


    let ohlc = []
    let volume = []

    for (i=0;i<request_historical_chart.data['results'].length;i++) {
        ohlc.push({
            't': (request_historical_chart.data['results'][i]['t']),
            'o': parseFloat((request_historical_chart.data['results'][i]['o']).toFixed(2)),
            'h': parseFloat((request_historical_chart.data['results'][i]['h']).toFixed(2)),
            'l': parseFloat((request_historical_chart.data['results'][i]['l']).toFixed(2)),
            'c': parseFloat((request_historical_chart.data['results'][i]['c']).toFixed(2))
        })

        volume.push({
            't': (request_historical_chart.data['results'][i]['t']),
            'v': parseFloat((request_historical_chart.data['results'][i]['v']).toFixed(2))
        })
    }

    const historical_chart_data = {
        'ohlcdata' : ohlc,
        'volumedata' : volume
    }

    const baseUrlQuote = `https://finnhub.io/api/v1/quote?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestQuote = await axios.get(baseUrlQuote)
    const quotedata = requestQuote.data

    const portfolioMongoDB = await portfolioCollection.findOne({tickerValue:tickerSymbol})

    let shareQuantity = 0, shareTotalCost = 0, shareBroughtFlag = false

    if (portfolioMongoDB != null) {
        for (i=0;i<portfolioMongoDB.quantity.length;i++){
            shareQuantity += Number(portfolioMongoDB.quantity[i])
            shareTotalCost += (Number(portfolioMongoDB.quantity[i]) * Number(portfolioMongoDB.costPerStock[i]))
        }
    }
    if (shareQuantity > 0) {
        shareBroughtFlag = true
    }

    const portFolioData = {
        'stockBroughtFlag' : shareBroughtFlag,
        'stocksOwnedQuantity' : shareQuantity,
        'AvgCostPerShare' : (shareTotalCost/shareQuantity).toFixed(2),
        'TotalCost' : (shareTotalCost).toFixed(2),
        'Change' : (shareQuantity * parseFloat(quotedata['c']) - shareTotalCost).toFixed(2),
        'MarketValue' : (shareQuantity * parseFloat(quotedata['c'])).toFixed(2),
        'CurrentPrice' : (quotedata['c']).toFixed(2),
        "changeInPrice": parseFloat(quotedata['d']).toFixed(2),
        "changeInPricePercent":parseFloat(quotedata['dp']).toFixed(2)
    }

    const baseUrlProfile = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestProfile = await axios.get(baseUrlProfile);
    const profiledata = requestProfile.data;

    //console.log(profiledata)

    const baseURLPeers = `https://finnhub.io/api/v1/stock/peers?symbol=${tickerSymbol}&token=${apiKey}`;
    const requestPeers = await axios.get(baseURLPeers);
    const profilePeers = requestPeers.data;

    const statsAboutSectionData = {
        'highPrice' : (quotedata['h']).toFixed(2),
        "lowprice": (quotedata['l']).toFixed(2),
        "openprice": (quotedata['o']).toFixed(2),
        "prevclose": (quotedata['pc']).toFixed(2),
        "ipostartdate": profiledata['ipo'],
        "webpage": profiledata['weburl'],
        "companypeers": profilePeers,
        "industry" : profiledata['finnhubIndustry']
    }

    const insiderurl = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${tickerSymbol}&from=2022-01-01&token=${apiKey}`
    const insiderrequest = await axios.get(insiderurl);
    const insiderdata = insiderrequest.data

    let MSPRPositive = 0, MSPRNegavtive = 0, ChangePositive = 0, ChangeNegative = 0

    for (i=0;i<insiderdata['data'].length;i++) {
        if (insiderdata['data'][i]['mspr'] >= 0) {
            MSPRPositive += insiderdata['data'][i]['mspr']
        } else {
            MSPRNegavtive += insiderdata['data'][i]['mspr']
        }
        if (insiderdata['data'][i]['change'] >= 0) {
            ChangePositive += insiderdata['data'][i]['change']
        } else {
            ChangeNegative += insiderdata['data'][i]['change']
        }
    }

    const earningsurl = `https://finnhub.io/api/v1/stock/earnings?symbol=${tickerSymbol}&token=${apiKey}`
    const earningsrequest = await axios.get(earningsurl);
    const earningsdata = earningsrequest.data

    const recommendationurl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${tickerSymbol}&token=${apiKey}`
    const recommendationrequest = await axios.get(recommendationurl);
    const recommendationdata = recommendationrequest.data

    const insightsData = {
        'companyName' : profiledata['name'],
        'MSPRTotal': (MSPRNegavtive + MSPRPositive).toFixed(2),
        'MSPRPositive': (MSPRPositive).toFixed(2),
        'MSPRNegative': (MSPRNegavtive).toFixed(2),
        'ChangeTotal': (ChangeNegative + ChangePositive).toFixed(2),
        'ChangePositive': (ChangePositive).toFixed(2),
        'ChangeNegative': (ChangeNegative).toFixed(2),
        'RecommendationTrends' : recommendationdata,
        'historicalEPSSurprises' : earningsdata
    }

    const newsdate = new Date()
    const newsyear = newsdate.getFullYear()
    const newsmonth = ('0' + (newsdate.getMonth() + 1)).slice(-2);
    const newsday = ('0' + newsdate.getDate()).slice(-2);
    const newstoDate = `${newsyear}-${newsmonth}-${newsday}`

    const sevenDaysAgo = new Date(newsdate.getTime() - 7*24*60*60*1000)
    const sevenDaysAgoYear = sevenDaysAgo.getFullYear()
    const sevenDaysAgoMonth = ('0' + (sevenDaysAgo.getMonth() + 1)).slice(-2);
    const sevenDaysAgoDay = ('0' + sevenDaysAgo.getDate()).slice(-2);
    const newsfromDate = `${sevenDaysAgoYear}-${sevenDaysAgoMonth}-${sevenDaysAgoDay}`

    const baseUrl = `https://finnhub.io/api/v1/company-news?symbol=${tickerSymbol}&from=${newsfromDate}&to=${newstoDate}&token=${apiKey}`;
    const request = await axios.get(baseUrl)
    const data = request.data

    const newsData = []
    i = 0;

    const now = new Date();
    let dateFromTimestamp, difference, absDifference, hours, minutes, days, datetimeValue

    while ((newsData.length < 20) & (i < data.length)) {
        if ((data[i]['headline'] !== '') & (data[i]['image'] !== '') & (data[i]['datetime'] !== '') & (data[i]['source'] !== '') & (data[i]['summary'] !== '') & (data[i]['url'] !== '') ) {
            dateFromTimestamp = new Date(data[i]['datetime'] * 1000);
            difference = dateFromTimestamp - now
            absDifference = Math.abs(difference)
            days = Math.floor(absDifference / (1000 * 60 * 60 * 24))
            hours = Math.floor((absDifference / (1000 * 60 * 60)) % 24)
            minutes = Math.floor((absDifference / (1000 * 60)) % 60)

            if (days == 0) {
                datetimeValue = `${hours} hr, ${minutes} min`
            } else {
                datetimeValue = `${days} days, ${hours} hr, ${minutes} min`
            }

            newsData.push({'source':data[i]['source'], 'publishedDateTime' : unixTimestampToDateTime(data[i]['datetime'] * 1000), 'timeSincePublishedDateTime' : datetimeValue, 'imageURL' : data[i]['image'], 'title' : data[i]['headline'], 'description' : data[i]['summary'], 'newsLink' : data[i]['url']})
        }
        i += 1
    }

    let walletMoney, watchListFlag, totalSpend = 0.0, j
    const walletMongoDB = await walletCollection.find({})

    if (walletMongoDB.length == 0) {
        const newWalletMongoDB = new walletCollection({money: '25000'})
        await newWalletMongoDB.save()
        walletMoney = 25000
    } else {
        walletMoney = walletMongoDB[0]['money']
    }

    const tickerMongoDB = await tickerCollection.findOne({tickerValue: tickerSymbol})

    if (tickerMongoDB == null) {
        watchListFlag = false
    } else {
        watchListFlag = true
    }

    const allPortfolioMongoDB = await portfolioCollection.find({})

    if (allPortfolioMongoDB.length != 0) {
        for (i=0;i<allPortfolioMongoDB.length;i++) {
            for (j=0;j<allPortfolioMongoDB[i]['quantity'].length;j++) {
                totalSpend += (Number(allPortfolioMongoDB[i]['quantity'][j]) * Number(allPortfolioMongoDB[i]['costPerStock'][j]))
            }
        }
    }

    const jsonData = {
        'hourlyPriceVariationData' : hourly_price_variation_data,
        'historicalChartData' : historical_chart_data,
        'portFolioData' : portFolioData,
        'statsAboutSectionData' : statsAboutSectionData,
        'insightsData' : insightsData,
        'newsData' : newsData,
        'walletMoney' : walletMoney,
        'totalSpend' : totalSpend,
        'watchListFlag' : watchListFlag
    }
    res.json(jsonData)

})

module.exports = router;