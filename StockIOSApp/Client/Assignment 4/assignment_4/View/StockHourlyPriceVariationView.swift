//
//  testview.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/26/24.
//
import SwiftUI
import WebKit

struct HighchartsView: UIViewRepresentable {
    let htmlContent: String

    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        uiView.loadHTMLString(htmlContent, baseURL: nil)
    }
}

struct StockHourlyPriceVariationView: View {
    var stockTicker: String
    var xAxisCategories: [String]
    var data: [Float]
    var color: String
    
    var highchartsHTML: String {
        """
        <html>
        <head>
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script src="https://code.highcharts.com/modules/series-label.js"></script>
            <script src="https://code.highcharts.com/modules/exporting.js"></script>
            <script src="https://code.highcharts.com/modules/export-data.js"></script>
            <script src="https://code.highcharts.com/modules/accessibility.js"></script>
        </head>
        <body>
            <div id="chart-container" style="width: 900px; height: 550px; margin: 0 auto"></div>

                <script>
                    Highcharts.chart('chart-container', {
                        title: {
                            text: '\(stockTicker) Hourly Price Variation',
                            style: {
                                fontSize: '40px'
                            }
                        },
                        xAxis: [{
                            categories: \(xAxisCategories),
                            tickInterval: Math.ceil(\(xAxisCategories).length / 4), // Adjust the division factor as needed
                            labels: {
                                style: {
                                    fontSize: '40px'
                                }
                            }
                        }],
                        yAxis: [{
                            title: {
                                text: null,
                                style: {
                                    fontSize: '40px'
                                }
                            },
                            opposite: true,
                            labels: {
                                style: {
                                    fontSize: '40px'
                                }
                            }
                        }],
                        series: [{
                            name: '',
                            data: \(data),
                            type: 'line',
                            color: '\(color)',
                            threshold: null
                        }],
                        tooltip: {
                            valueDecimals: 2,
                            style: {
                                fontSize: '40px'
                            },
                            formatter: function () {
                                return 'AAPL : ' + this.point.y;
                            }
                        }

                    });
                </script>
        </body>
        </html>
        """
    }

    var body: some View {
        HighchartsView(htmlContent: highchartsHTML)
            .frame(minWidth: 300, maxWidth: .infinity, minHeight: 200, maxHeight: .infinity)
    }
}

#Preview {
    StockHourlyPriceVariationView(stockTicker: "AAPL", 
                                  xAxisCategories: ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"], 
                                  data: [168.85,169.13,168.81,169.15,168.34,169.01,168.57,168.55,169.36,169.55,169.56,169.9,170.04,170.14,170.01,169.74], 
                                  color: "red")
}

//
//xAxis:[{
//    categories: \(xAxisCategories)
//}],
