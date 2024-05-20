//
//  StockHistoricalOHLCVolumeChartView.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/27/24.
//

import Foundation
import SwiftUI
import WebKit

struct StockHistoricalOHLCVolumeChartView: View {
    var stockTicker: String
    var ohlcData: [Any]
    var volumeData:[Any]
    
    @State private var zoomScale: CGFloat = 1.0
    
    var highchartsHTML: String {
        """
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            <script src="https://code.highcharts.com/stock/highstock.js"></script>
            <script src="https://code.highcharts.com/stock/modules/drag-panes.js"></script>
            <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
            <script src="https://code.highcharts.com/stock/indicators/indicators.js"></script>
            <script src="https://code.highcharts.com/stock/indicators/volume-by-price.js"></script>
            <script src="https://code.highcharts.com/modules/accessibility.js"></script>
        </head>
        <body>
            <div id="chart-container" style="width: 900px; height: 520px; margin: 0 auto"></div>

            <script>
                
                Highcharts.stockChart('chart-container', {
                    xAxis: {
                        labels: {
                            style: {
                                fontSize: '20px'
                            }
                        }
                    },
                    rangeSelector: {
                        buttonTheme: {
                            style: {
                                fontSize: '20px'
                            }
                        },
                        inputStyle: {
                            fontSize: '20px'
                        },
                        buttons: [{
                            type: 'month',
                            count: 1,
                            text: 'View 1 month'
                        }, {
                            type: 'month',
                            count: 3,
                            text: 'View 3 months'
                        }, {
                            type: 'month',
                            count: 6,
                            text: 'View 6 months'
                        }, {
                            type: 'ytd',
                            text: 'View year to date'
                        }, {
                            type: 'year',
                            count: 1,
                            text: 'View 1 year'
                        }, {
                            type: 'all',
                            text: 'View all',
                        }],
                        selected: 0,
                        inputEnabled: true,
                        dropdown: 'always'
                    },
                    title: {
                        text: '\(stockTicker) Historical',
                        style: {
                            fontSize: '40px'
                        }
                    },
                    subtitle: {
                        text: 'With SMA and Volume by Price technical indicators',
                        style: {
                            fontSize: '30px'
                        }
                    },
                    navigator: {
                        enabled: true,
                        xAxis: {
                                labels: {
                                    style: {
                                        fontSize: '20px'
                                    }
                                }
                        }
                    },
                    yAxis: [{
                        startOnTick: false,
                        endOnTick: false,
                        labels: {
                            align: 'right',
                            x: -3,
                            style: {
                                fontSize: '30px'
                            }
                        },
                        title: {
                            text: 'OHLC',
                            style: {
                                fontSize: '20px'
                            }
                        },
                        height: '60%',
                        lineWidth: 2,
                        resize: {
                            enabled: true
                        },
                        opposite: true
                    }, {
                        labels: {
                            align: 'right',
                            x: -3,
                            style: {
                                fontSize: '30px'
                            }
                        },
                        title: {
                            text: 'Volume',
                            style: {
                                fontSize: '20px'
                            }
                        },
                        top: '65%',
                        height: '35%',
                        offset: 0,
                        lineWidth: 2,
                        opposite: true
                    }],

                    tooltip: {
                        split: true,
                    },

                    plotOptions: {
                        series: {
                            dataGrouping: {
                                units: [[
                                    'week',
                                    [1]
                                ], [
                                    'month',
                                    [1, 2, 3, 4, 6]
                                ]]
                            }
                        }
                    },
                    series: [{
                        type: 'candlestick',
                        name: 'AAPL',
                        id: 'aapl',
                        zIndex: 2,
                        data: \(ohlcData)
                    }, {
                        type: 'column',
                        name: 'Volume',
                        id: 'volume',
                        data: \(volumeData),
                        yAxis: 1
                    }, {
                        type: 'vbp',
                        linkedTo: 'aapl',
                        params: {
                            volumeSeriesID: 'volume'
                        },
                        dataLabels: {
                            enabled: false
                        },
                        zoneLines: {
                            enabled: false
                        }
                    }, {
                        type: 'sma',
                        linkedTo: 'aapl',
                        zIndex: 1,
                        marker: {
                            enabled: false
                        }
                    }]
                });
            </script>
        </body>
        </html>
        """
    }

    var body: some View {
        HighchartsView(htmlContent: highchartsHTML)
    }
}


#Preview {
    StockHistoricalOHLCVolumeChartView(stockTicker: "AAPL", ohlcData: [
            [1651066200000,155.91,159.79,155.38,156.57,88063200],
            [1651152600000,159.25,164.52,158.93,163.64,130216800],
            [1651239000000,161.84,166.2,157.25,157.65,131747600],
            [1651498200000,156.71,158.23,153.27,157.96,123055300],
            [1651584600000,158.15,160.71,156.32,159.48,88966500],
            [1651671000000,159.67,166.48,159.26,166.02,108256500],
            [1651757400000,163.85,164.08,154.95,156.77,130525300],
            [1651843800000,156.01,159.44,154.18,157.28,116124600],
            [1652103000000,154.93,155.83,151.49,152.06,131577900],
            [1652189400000,155.52,156.74,152.93,154.51,115366700]], volumeData: [[1651066200000,88063200],
                                                                                 [1651152600000,130216800],
                                                                                 [1651239000000,131747600],
                                                                                 [1651498200000,123055300],
                                                                                 [1651584600000,88966500],
                                                                                 [1651671000000,108256500],
                                                                                 [1651757400000,130525300],
                                                                                 [1651843800000,116124600],
                                                                                 [1652103000000,131577900],
                                                                                 [1652189400000,115366700]])
//    StockHistoricalOHLCVolumeChartView(stockTicker: "AAPL", xAxisCategories: ["2022-04", "2022-04", "2022-05", "2022-05"], ohlcData: [["2022-04", 159.25, 164.51, 158.93, 163.64], ["2022-04", 161.84, 166.2, 157.25, 157.65], ["2022-05", 156.71, 158.23, 153.27, 157.96], ["2022-05", 158.15, 160.71, 156.32, 159.48]], volumeData: [["2022-04", 1.3014919e+08], ["2022-04", 1.31747496e+08], ["2022-05", 1.2305e+08], ["2022-05", 8.896653e+07]], groupingUnite: [["week", [1]],["month", [1, 2, 3, 4, 6]]])
}
                                       
        

//["2022-04-27","2022-04-28","2022-05-01","2022-05-02"]
//[["2022-04-27",159.25,164.51,158.93,163.64],["2022-04-28",161.84,166.2,157.25,157.65],["2022-05-01",156.71,158.23,153.27,157.96],["2022-05-02",158.15,160.71,156.32,159.48]]
//[["2022-04-27",130149192],["2022-04-28",131747495],["2022-05-01",123050000],["2022-05-02",88966526]]
//[['week', [1]],['month', [1, 2, 3, 4, 6]]]
