//
//  HomeData.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/12/24.
//

import Foundation

struct HomeDataModel: Codable, Hashable {
    let walletMoney: String
    let netWorth: String
    let portfolioDataFlag: Bool
    let portFolioData: [PortfolioDataModel]
    let watchListFlag: Bool
    let watchListData: [WatchListData]
}

struct PortfolioDataModel: Codable, Hashable {
    let tickerValue: String
    let marketValue: String
    let changeInPriceFromTotalCost: String
    let changeInPriceFromTotalCostPercent: String
    let quantity: Int
}

struct WatchListData: Codable, Hashable {
    let stockSymbol: String
    let stockName: String
    let currentPrice: String
    let changeInPrice: String
    let changeInPricePercent: String
}
