export interface INTERFACEStockOverview {
    companyCode : string,
    companyName : string,
    tradingExchangeCode : string,
    companyLogo : string,
    lastPrice : number,
    change : number,
    changePercent : number,
    stockLastUpdatedTimestamp : number,
    marketStatus : boolean
}