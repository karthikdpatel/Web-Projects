//backend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const getStockTickerSuggestionsRouter = require('./routes/getStockTickerSuggestions')
const getSockOverview = require('./routes/getStockOverview')
const getSummaryDetails = require('./routes/getSummaryDetails')
const getNewsData = require('./routes/getNewsData')
const getChartsData = require('./routes/getChartsData')
const getInsightsData = require('./routes/getInsightsData')
const addWatchList = require('./routes/addWatchList')
const getWatchListData = require('./routes/getWatchListData')
const deleteItemWatchList = require('./routes/deleteItemWatchList')
const addPortfolio = require('./routes/addPortfolio')
const getSellData = require('./routes/getSellData')
const getStockQuantity = require('./routes/getStockQuantity')
const getPortfolioData = require('./routes/getPortfolioData')
const getWalletMoney = require('./routes/getWalletMoney')
const path = require("path");
const homeRouter = require("./routes/home")

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use(homeRouter)
app.use(getStockTickerSuggestionsRouter)
app.use(getSockOverview)
app.use(getSummaryDetails)
app.use(getNewsData)
app.use(getChartsData)
app.use(getInsightsData)
app.use(addWatchList)
app.use(getWatchListData)
app.use(deleteItemWatchList)
app.use(addPortfolio)
app.use(getSellData)
app.use(getStockQuantity)
app.use(getPortfolioData)
app.use(getWalletMoney)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});