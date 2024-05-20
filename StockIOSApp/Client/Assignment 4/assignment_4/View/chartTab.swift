//
//  chartTab.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/27/24.
//

import Foundation
import SwiftUI

struct ChartTabView: View {
    var stockTicker: String
    var hourlyPriceVariationXAxisCategories: [String]
    var hourlyPriceVariationdata: [Float]
    var color: String
    
    var ohlcData: [Any]
    var ohlcVolumeData: [Any]
    
    var body: some View {
        TabView {
            // First tab with the hourly price variation
            StockHourlyPriceVariationView(stockTicker: stockTicker, xAxisCategories: hourlyPriceVariationXAxisCategories, data: hourlyPriceVariationdata, color: color)
                //.scaledToFit()
            .tabItem {
                Image(systemName: "chart.xyaxis.line")
                Text("Hourly")
            }
            
            // Second tab with historical OHLC and volume chart
            StockHistoricalOHLCVolumeChartView(stockTicker: stockTicker, ohlcData: ohlcData, volumeData: ohlcVolumeData)
                //.scaledToFit()
            .tabItem {
                Image(systemName: "clock.fill")
                Text("Historical")
            }
        }.background(Color.white)
    }
}

#Preview {
    ChartTabView(stockTicker: "AAPL",
                 hourlyPriceVariationXAxisCategories: ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"],
                 hourlyPriceVariationdata: [168.85,169.13,168.81,169.15,168.34,169.01,168.57,168.55,169.36,169.55,169.56,169.9,170.04,170.14,170.01,169.74],
                 color: "red", ohlcData: [
                    [1651066200000,155.91,159.79,155.38,156.57,88063200],
                    [1651152600000,159.25,164.52,158.93,163.64,130216800],
                    [1651239000000,161.84,166.2,157.25,157.65,131747600],
                    [1651498200000,156.71,158.23,153.27,157.96,123055300],
                    [1651584600000,158.15,160.71,156.32,159.48,88966500],
                    [1651671000000,159.67,166.48,159.26,166.02,108256500],
                    [1651757400000,163.85,164.08,154.95,156.77,130525300],
                    [1651843800000,156.01,159.44,154.18,157.28,116124600],
                    [1652103000000,154.93,155.83,151.49,152.06,131577900],
                    [1652189400000,155.52,156.74,152.93,154.51,115366700]], ohlcVolumeData: [[1651066200000,88063200],
                                                                                         [1651152600000,130216800],
                                                                                         [1651239000000,131747600],
                                                                                         [1651498200000,123055300],
                                                                                         [1651584600000,88966500],
                                                                                         [1651671000000,108256500],
                                                                                         [1651757400000,130525300],
                                                                                         [1651843800000,116124600],
                                                                                         [1652103000000,131577900],
                                                                                         [1652189400000,115366700]])
}


