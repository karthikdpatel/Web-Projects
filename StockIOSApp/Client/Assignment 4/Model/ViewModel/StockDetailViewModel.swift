//
//  StockDetailViewModel.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/20/24.
//

import SwiftUI
import Foundation

class StockDetailViewModel: ObservableObject {
    @Published var stockDetailData: StockDetailDataModel = StockDetailDataModel(
        hourlyPriceVariationData: hourlyPriceVariationData(
            datetime: [],
            value: []
        ),
        historicalChartData: historicalChartData(
            ohlcdata: [],
            volumedata: []
        ),
        portFolioData: portFolioData(
            stockBroughtFlag: false,
            stocksOwnedQuantity: 0,
            AvgCostPerShare: "",
            TotalCost: "",
            Change: "",
            MarketValue: "",
            CurrentPrice: "",
            changeInPrice: "",
            changeInPricePercent: ""
        ),
        statsAboutSectionData: statsAboutSectionData(
            highPrice: "0.0",
            lowprice: "0.0",
            openprice: "0.0",
            prevclose: "0.0",
            ipostartdate: "",
            webpage: "",
            companypeers: [],
            industry: ""
        ),
        insightsData: insightsData(
            companyName: "",
            MSPRTotal: "0.0",
            MSPRPositive: "0.0",
            MSPRNegative: "0.0",
            ChangeTotal: "0.0",
            ChangePositive: "0.0",
            ChangeNegative: "0.0",
            RecommendationTrends: [],
            historicalEPSSurprises: []
        ),
        newsData: [],
        walletMoney : 0.0,
        totalSpend : 0.0,
        watchListFlag : false
    )
    
    @Published var firstNewsArticle: newsData = newsData(
        source: "",
        publishedDateTime: "",
        timeSincePublishedDateTime: "",
        imageURL: "",
        title: "",
        description: "",
        newsLink: ""
    )
    
    @Published var historicalChartDataOHLC = []
    @Published var historicalChartDataVolume = []
    
    @Published var recommendationDataXAxisCategories:[String] = []
    @Published var buyData = []
    @Published var holdData = []
    @Published var sellData = []
    @Published var strongBuyData = []
    @Published var strongSellData = []
    
    @Published var historicalEPSXAxisCategories = []
    @Published var historicalEPSActual = []
    @Published var historicalEPSEstimate = []
    
    @Published var isLoading = true
    
    init(tickerSymbol: String) {
        self.isLoading = true
        let endpoint = "/api/getStockDetailedInfo?tickerSymbol="+tickerSymbol
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                guard let res: StockDetailDataModel = data?.parseTo() else { print(data); print("No Data"); return }
                print("start")
                self.firstNewsArticle = res.newsData[0]
                self.stockDetailData = res
                if !self.stockDetailData.newsData.isEmpty {
                    self.stockDetailData.newsData.removeFirst()
                }
                
                for vData in self.stockDetailData.historicalChartData.volumedata {
                    self.historicalChartDataVolume.append([vData.t, vData.v])
                }
                
                for oData in self.stockDetailData.historicalChartData.ohlcdata {
                    self.historicalChartDataOHLC.append([oData.t, oData.o, oData.h, oData.l, oData.c])
                }
                
                for rData in self.stockDetailData.insightsData.RecommendationTrends {
                    self.recommendationDataXAxisCategories.append(String(rData.period.prefix(7)))
                    self.buyData.append([ String(rData.period.prefix(7)), rData.buy ])
                    self.holdData.append([ String(rData.period.prefix(7)), rData.hold ])
                    self.sellData.append([ String(rData.period.prefix(7)), rData.sell ])
                    self.strongBuyData.append([ String(rData.period.prefix(7)), rData.strongBuy ])
                    self.strongSellData.append([ String(rData.period.prefix(7)), rData.strongSell ])
                }
                
                for epsData in self.stockDetailData.insightsData.historicalEPSSurprises {
                    self.historicalEPSActual.append([ epsData.period + "<br>Surprise: " + String(epsData.surprise), epsData.actual])
                    self.historicalEPSEstimate.append([ epsData.period + "<br>Surprise: " + String(epsData.surprise), epsData.estimate])
                    self.historicalEPSXAxisCategories.append(epsData.period + "<br>Surprise: " + String(epsData.surprise))
                }
                print(self.stockDetailData.totalSpend)
                print(self.stockDetailData.walletMoney)
                print(self.stockDetailData.watchListFlag)
                print("end")
                self.isLoading = false
            }
        })
    }
}
