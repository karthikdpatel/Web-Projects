//
//  StockDetailDataModel.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/19/24.
//

import Foundation

struct StockDetailDataModel: Codable, Hashable {
    let hourlyPriceVariationData: hourlyPriceVariationData
    let historicalChartData: historicalChartData
    var portFolioData: portFolioData
    let statsAboutSectionData: statsAboutSectionData
    let insightsData: insightsData
    var newsData: [newsData]
    let walletMoney: Float
    let totalSpend: Float
    var watchListFlag: Bool
}

struct newsData: Codable, Hashable {
    let source: String
    let publishedDateTime: String
    let timeSincePublishedDateTime: String
    let imageURL: String
    let title: String
    let description: String
    let newsLink: String
}

struct hourlyPriceVariationData: Codable, Hashable {
    let datetime: [String]
    let value: [Float]
}

struct ohlcData: Codable, Hashable {
    let t: Int
    let o: Float
    let h: Float
    let l: Float
    let c: Float
}

struct volumedata: Codable, Hashable {
    let t: Int
    let v: Float
}

struct historicalChartData: Codable, Hashable {
    let ohlcdata: [ohlcData]
    let volumedata: [volumedata]
}

struct portFolioData: Codable, Hashable {
    var stockBroughtFlag: Bool
    var stocksOwnedQuantity: Int
    var AvgCostPerShare: String
    var TotalCost: String
    var Change: String
    var MarketValue: String
    var CurrentPrice: String
    var changeInPrice: String
    var changeInPricePercent: String
}

struct statsAboutSectionData: Codable, Hashable {
    let highPrice: String
    let lowprice: String
    let openprice: String
    let prevclose: String
    let ipostartdate: String
    let webpage: String
    let companypeers: [String]
    let industry: String
}

struct insightsData: Codable, Hashable {
    let companyName: String
    let MSPRTotal: String
    let MSPRPositive: String
    let MSPRNegative: String
    let ChangeTotal: String
    let ChangePositive: String
    let ChangeNegative: String
    let RecommendationTrends: [RecommendationTrendsData]
    let historicalEPSSurprises: [historicalEPSSurprisesData]
}

struct RecommendationTrendsData: Codable, Hashable {
    let buy: Int
    let hold: Int
    let period: String
    let sell: Int
    let strongBuy: Int
    let strongSell: Int
    let symbol: String
}

struct historicalEPSSurprisesData: Codable, Hashable {
    let actual: Float
    let estimate: Float
    let period: String
    let quarter: Int
    let surprise: Float
    let surprisePercent: Float
    let symbol: String
    let year: Int
}
