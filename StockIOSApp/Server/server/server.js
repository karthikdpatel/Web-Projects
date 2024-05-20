const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const getPortfolioData = require('./routes/getPortfolioData')
const deleteWatchListData = require('./routes/deleteWatchListData')
const getStockTickerSuggestions = require('./routes/getStockTickerSuggestions')
const getStockDetailedInfo = require('./routes/getStockDetailedInfo')
const addWatchListData = require('./routes/addWatchListData')
const addPortfolioData = require('./routes/addPortfolio')
const sellPortfolioData = require('./routes/sellPortfolioData')
const getStockPortfolioData = require('./routes/getStockPortfolioData')
const getStockOverview = require('./routes/getStockOverview')
const getSummaryDetails = require('./routes/getSummaryDetails')
const getNewsData = require('./routes/getNewsData')

app.use(cors());
app.use(express.json());

app.use(getPortfolioData)
app.use(deleteWatchListData)
app.use(getStockTickerSuggestions)
app.use(getStockDetailedInfo)
app.use(addWatchListData)
app.use(addPortfolioData)
app.use(sellPortfolioData)
app.use(getStockPortfolioData)
app.use(getStockOverview)
app.use(getSummaryDetails)
app.use(getNewsData)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
