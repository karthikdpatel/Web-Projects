//
//  stockDetailView.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/15/24.
//

import struct Kingfisher.KFImage
import SwiftUI
import AlertToast
import Modals

struct stockDetailView: View {
    var stockTicker: String
    @StateObject private var stockDetailVM: StockDetailViewModel
    //var stockDetailVM: StockDetailViewModel
    @State private var zoomHourlyScale: CGFloat = 1.5
    @State private var watchListToastFlag = false
    
    init(stockTicker: String) {
        self.stockTicker = stockTicker
        _stockDetailVM = StateObject(wrappedValue: StockDetailViewModel(tickerSymbol: stockTicker))
    }
    
    var body: some View {
        NavigationView {
            ZStack{
                List{
                    if !stockDetailVM.isLoading {
                        Section(){
                            stockDetailInitialView(stockDetailVM: stockDetailVM)
                        }.listRowSeparator(.hidden)
                        
                        Section() {
                            ChartTabView(stockTicker: stockTicker, hourlyPriceVariationXAxisCategories: stockDetailVM.stockDetailData.hourlyPriceVariationData.datetime, hourlyPriceVariationdata: stockDetailVM.stockDetailData.hourlyPriceVariationData.value,
                                         color: Float(stockDetailVM.stockDetailData.portFolioData.changeInPrice) ?? 0.0 > 0.0 ? "green": ( Float(stockDetailVM.stockDetailData.portFolioData.changeInPrice) ?? -0.1 < 0.0 ? "red" : "black") , ohlcData: stockDetailVM.historicalChartDataOHLC, ohlcVolumeData: stockDetailVM.historicalChartDataVolume)
                            .frame(height: 250)
                        }
                        
                        Section(){
                            stockDetailPortfolioView(stockDetailVM: stockDetailVM, stockTicker: stockTicker)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            stockDetailStatsView(stockDetailVM: stockDetailVM)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            stockDetailAbouView(stockDetailVM: stockDetailVM)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            stockDetailInsightsView(stockDetailVM: stockDetailVM)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            RecommendationTrendsView(stockDetailVM: stockDetailVM)
                                .frame(height: 250)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            EPSSurprisesView(stockDetailVM: stockDetailVM)
                                .frame(height: 250)
                        }.listRowSeparator(.hidden)
                        
                        Section(){
                            stockDetailNewsView(stockDetailVM: stockDetailVM)
                        }.listRowSeparator(.hidden)
                    } else {
                        HStack {
                            Spacer()
                            LoadingView()
                                .frame(minHeight: 700)
                            Spacer()
                        }
                    }
                }
                if watchListToastFlag {
                    ToastView(toastMessage: "Adding \(stockTicker) to Favorites")
                        .transition(.asymmetric(insertion: .move(edge: .bottom), removal: .opacity))
                        .zIndex(1)
                }
            }
        }
        .listStyle(PlainListStyle())
        .navigationTitle(stockDetailVM.isLoading ? "" : stockTicker)
        .navigationBarTitleDisplayMode(stockDetailVM.isLoading ? .inline : .large)
        .navigationBarItems(trailing: trailingButton)

    }
    
    private var trailingButton: some View {
        Group {
            if !stockDetailVM.isLoading {
                if stockDetailVM.stockDetailData.watchListFlag{
                    Button(action: {
                        addToWishList()
                    }) {
                        Image(systemName: "plus")
                            .foregroundColor( .white )
                            .padding(4)
                            .background(Circle().fill( Color.blue ))
                    }
                }
                else {
                    Button(action: {
                        addToWishList()
                        stockDetailVM.stockDetailData.watchListFlag = true
                        withAnimation {
                            watchListToastFlag = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                                watchListToastFlag = false
                            }
                        }
                    }) {
                        Image(systemName: "plus.circle")
                            .foregroundColor( .blue )
                            .padding(4)
                    }
                }
            }
        }
    }
    
    func addToWishList() {
        print("Added to wishList")
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerValue", value: stockTicker)]
        
        urlComponents.path = "/api/addWatchList"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                print("Success Added to wishlist")
                self.watchListToastFlag = true
                print(self.watchListToastFlag)
            } else {
                print("Deletion adding to wishlist")
            }
        })
        
    }
}

#Preview {
    stockDetailView(stockTicker: "AAPL")
    //RecommendationTrendsView(stockDetailVM: StockDetailViewModel(tickerSymbol: "AAPL"))
    //EPSSurprisesView(stockDetailVM: StockDetailViewModel(tickerSymbol: "AAPL"))
}

struct EPSSurprisesView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
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
            <div id="chart-container" style="min-width: 310px; height: 600px; margin: 0 auto"></div>

                <script>
                    Highcharts.chart('chart-container', {
                        title: {
                            text: `Historical EPS Surprises`,
                            style: {
                                fontSize: '50px'
                            }
                        },
                        xAxis:[{
                            categories: \(stockDetailVM.historicalEPSXAxisCategories),
                            labels: {
                                style: {
                                    fontSize: '20px'
                                }
                            }
                        }],
                        yAxis:[{
                            title: {
                                text: 'Quarterly EPS',
                                style: {
                                    fontSize: '30px'
                                }
                            },
                            opposite:false,
                            labels: {
                                style: {
                                    fontSize: '20px'
                                }
                            },
                        }],
                        tooltip: {
                            style: {
                                fontSize: '20px'
                            }
                        },
                        legend: {
                            itemStyle: {
                                fontSize: '30px'
                            }
                        },
                        series:[
                            {
                                name: 'Actual',
                                data: \(stockDetailVM.historicalEPSActual),
                                type: 'spline',
                                threshold: null,
                                tooltip: {
                                    valueDecimals: 2
                                }
                            },
                            {
                                name: 'Estimate',
                                data: \(stockDetailVM.historicalEPSEstimate),
                                type: 'spline',
                                threshold: null,
                                tooltip: {
                                    valueDecimals: 2
                                }
                            }
                        ],
                    });
                </script>
        </body>
        </html>
        """
    }
    
    var body: some View {
        HighchartsView(htmlContent: highchartsHTML)
            .frame(minWidth: 300, maxWidth: .infinity, minHeight: 120, maxHeight: .infinity)
    }
}

struct RecommendationTrendsView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
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
            <div id="chart-container" style="min-width: 310px; height: 600px; margin: 0 auto"></div>

                <script>
                    Highcharts.chart('chart-container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Recommendation Trends',
                            style: {
                                fontSize: '50px'
                            }
                        },
                        xAxis: {
                            categories: \(stockDetailVM.recommendationDataXAxisCategories),
                            labels: {
                                style: {
                                    fontSize: '30px'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '# Analysis',
                                style: {
                                    fontSize: '30px'
                                }
                            },
                            stackLabels: {
                                enabled: false
                            },
                            style: {
                                fontSize: '20px'
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{point.x}</b><br/>',
                            pointFormat: '{series.name}: {point.y}',
                            style: {
                                fontSize: '20px'
                            }
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontSize: '20px'
                                    }
                                }
                            }
                        },
                        legend: {
                            itemStyle: {
                                fontSize: '30px'
                            }
                        },
                        series: [{
                            type: 'column',
                            name: 'Strong Buy',
                            data: \(stockDetailVM.strongBuyData),
                            style: {
                                fontSize: '30px'
                            }
                        }, {
                            type: 'column',
                            name: 'Buy',
                            data: \(stockDetailVM.buyData),
                            style: {
                                fontSize: '30px'
                            }
                        }, {
                            type: 'column',
                            name: 'Hold',
                            data: \(stockDetailVM.holdData),
                            style: {
                                fontSize: '30px'
                            }
                        }, {
                            type: 'column',
                            name: 'Sell',
                            data: \(stockDetailVM.sellData),
                            style: {
                                fontSize: '30px'
                            }
                        }, {
                            type: 'column',
                            name: 'Strong Sell',
                            data: \(stockDetailVM.strongSellData),
                            style: {
                                fontSize: '30px'
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
            .frame(minWidth: 300, maxWidth: .infinity, minHeight: 120, maxHeight: .infinity)
    }
}

struct stockDetailNewsView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    @State var selectedNews: newsData  = newsData(
        source: "",
        publishedDateTime: "",
        timeSincePublishedDateTime: "",
        imageURL: "",
        title: "",
        description: "",
        newsLink: ""
    )
    
    @State var ModalPresented: Bool = false
    
    var body: some View {
        VStack {
            HStack {
                Text("News")
                    .font(.title)
                Spacer()
            }
            VStack(alignment: .leading) {
                VStack{
                    HStack {
                        Spacer()
                        KFImage(URL(string: stockDetailVM.firstNewsArticle.imageURL))
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 300, height: 200)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        Spacer()
                    }
                    HStack{
                        Text(stockDetailVM.firstNewsArticle.source + "   " + stockDetailVM.firstNewsArticle.timeSincePublishedDateTime)
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                    
                    HStack {
                        Text(stockDetailVM.firstNewsArticle.title)
                            .fixedSize(horizontal: false, vertical: true)
                        .fontWeight(.bold)
                        Spacer()
                    }
                }
//                .onTapGesture {
//                    ModalPresented = true
//                    selectedNews = stockDetailVM.firstNewsArticle
//                }
                .sheet(isPresented: $ModalPresented) {
                    newsModalView(news: stockDetailVM.firstNewsArticle)
                }
                Divider()
                ForEach(stockDetailVM.stockDetailData.newsData, id: \.self) { news in
                    HStack{
                        VStack(alignment: .leading){
                            Text(news.source + "   ")
                                .font(.caption)
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                                .foregroundColor(.secondary)
                            + Text(news.timeSincePublishedDateTime)
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(news.title)
                                .fixedSize(horizontal: false, vertical: true)
                                .fontWeight(.bold)
                        }
                        Spacer()
                        KFImage(URL(string: news.imageURL))
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 100, height: 100)
                            .clipShape(RoundedRectangle(cornerRadius: 5))
                    }
                    .onTapGesture {
                        ModalPresented = true
                        selectedNews = news
                        //print(selectedNews)
                    }
                    .sheet(isPresented: $ModalPresented) {
                        newsModalView(news: selectedNews)
                    }
                    Spacer()
                }
            }
        }
    }
}

struct newsModalView: View {
    var news: newsData
    
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Spacer()
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "xmark")
                        .foregroundColor(.black)
                        .font(.headline)
                }
                .padding()
            }
            Text("SeekingAlpha")
                .font(.largeTitle)
                .fontWeight(.bold)
            Text("2024-05-02 01:10:00")
                .font(.caption)
                .foregroundColor(.secondary)
            Divider()
            Text("Dip Or Correction?")
                .fontWeight(.bold)
            Text("To understand if this is just a short-term dip or something more meaningful, we must look at the technical and fundamental backdrop that is moving sentiment. Click to read.")
            HStack{
                Text("For more details click")
                    .foregroundColor(.gray)
                    .font(.caption)
                Link("here", destination: URL(string: "https://finnhub.io/api/news?id=463be5a2e0069d6aee755e7cc65e3b8679acf9fe42eb97fcbdbab2e6d391eac4")!)
                    .font(.caption)
            }
            HStack {
                Link(destination: URL(string: "https://twitter.com/intent/post?text=\("Dip Or Correction?")&url=\("https://finnhub.io/api/news?id=463be5a2e0069d6aee755e7cc65e3b8679acf9fe42eb97fcbdbab2e6d391eac4")")!) {
                    Image("twitter")
                        .resizable()
                        .frame(width: 30, height: 30)
                }
                Link(destination: URL(string: "https://www.facebook.com/sharer/sharer.php?u=\("https://finnhub.io/api/news?id=463be5a2e0069d6aee755e7cc65e3b8679acf9fe42eb97fcbdbab2e6d391eac4")")!) {
                    Image("fb")
                        .resizable()
                        .frame(width: 30, height: 30)
                }
            }
            Spacer()
//            Text(news.source)
//                .font(.largeTitle)
//                .fontWeight(.bold)
//            Text(news.publishedDateTime)
//                .font(.caption)
//                .foregroundColor(.secondary)
//            Divider()
//            Text(news.title)
//                .fontWeight(.bold)
//            Text(news.description)
//            HStack{
//                Text("For more details click")
//                    .foregroundColor(.gray)
//                    .font(.caption)
//                Link("here", destination: URL(string: news.newsLink)!)
//                    .font(.caption)
//            }
//            HStack {
//                Link(destination: URL(string: "https://twitter.com/intent/post?text=\(news.title)&url=\(news.newsLink)")!) {
//                    Image("twitter")
//                        .resizable()
//                        .frame(width: 30, height: 30)
//                }
//                Link(destination: URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(news.newsLink)")!) {
//                    Image("fb")
//                        .resizable()
//                        .frame(width: 30, height: 30)
//                }
//            }
//            Spacer()
        }.padding(.horizontal)
    }
}

struct stockDetailInsightsView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
    var body: some View {
        VStack {
            HStack {
                Text("Insights")
                    .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                Spacer()
            }
            Spacer()
            HStack {
                Spacer()
                Text("Insider Sentiments")
                    .font(.title2)
                Spacer()
            }
            Spacer()
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(stockDetailVM.stockDetailData.insightsData.companyName)
                        .fontWeight(.bold)
                    Divider()
                    Text("Total").fontWeight(.bold)
                    Divider()
                    Text("Positive").fontWeight(.bold)
                    Divider()
                    Text("Negative").fontWeight(.bold)
                    Divider()
                }
                Spacer()
                VStack(alignment: .leading, spacing: 8) {
                    Text("MSPR")
                        .fontWeight(.bold)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.MSPRTotal)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.MSPRPositive)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.MSPRNegative)
                    Divider()
                }
                Spacer()
                VStack(alignment: .leading, spacing: 8) {
                    Text("Change")
                        .fontWeight(.bold)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.ChangeTotal)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.ChangePositive)
                    Divider()
                    Text(stockDetailVM.stockDetailData.insightsData.ChangeNegative)
                    Divider()
                }
            }
        }
    }
}

struct stockDetailAbouView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
    var body: some View {
        VStack {
            HStack {
                Text("About")
                    .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                Spacer()
            }
            Spacer()
            HStack{
                VStack(alignment: .leading) {
                    Text("IPO Start Date:            ").bold()
                    Spacer()
                    Text("Industry:").bold()
                    Spacer()
                    Text("Webpage:").bold()
                    Spacer()
                    HStack {
                        Text("Company Peers:").bold()
                    }
                }
                Spacer()
                VStack(alignment: .leading) {
                    Text(stockDetailVM.stockDetailData.statsAboutSectionData.ipostartdate)
                    Spacer()
                    Text(stockDetailVM.stockDetailData.statsAboutSectionData.industry)
                    Spacer()
                    if let url = URL(string: stockDetailVM.stockDetailData.statsAboutSectionData.webpage),
                       !stockDetailVM.stockDetailData.statsAboutSectionData.webpage.isEmpty {
                        Link(stockDetailVM.stockDetailData.statsAboutSectionData.webpage, destination: url)
                    } else {
                        Text("")
                    }
                    Spacer()
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(stockDetailVM.stockDetailData.statsAboutSectionData.companypeers, id: \.self) { peer in
                                NavigationLink(destination: stockDetailView(stockTicker: peer)) {
                                    Text(peer + ",")
                                }
                            }
                        }
                    }
                }
            }
        }.padding(.bottom)
    }
}

struct stockDetailStatsView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
    var body: some View {
        VStack {
            HStack {
                Text("Stats")
                    .font(.title)
                Spacer()
            }
            Spacer()
            Spacer()
            HStack {
                VStack(alignment: .leading) {
                    Text("High Price: ").bold() + Text("$\(stockDetailVM.stockDetailData.statsAboutSectionData.highPrice)")
                    Spacer()
                    Text("Low Price: ").bold() + Text("$\(stockDetailVM.stockDetailData.statsAboutSectionData.lowprice)")
                }
                Spacer()
                VStack(alignment: .leading) {
                    Text("Open Price: ").bold() + Text("$\(stockDetailVM.stockDetailData.statsAboutSectionData.openprice)")
                    Spacer()
                    Text("Prev. Close: ").bold() + Text("$\(stockDetailVM.stockDetailData.statsAboutSectionData.prevclose)")
                }
            }
        }.padding(.bottom)
    }
}

struct stockDetailPortfolioView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    var stockTicker: String
    
    @State var presented: Bool = false
    @State var showSuccessModal: Bool = false
    @State var successModalMessage: String = ""
    @State var userInput: String = ""
    @State private var showToast = false
    @State private var toastMessage = ""
    
    @State var ModalPresented: Bool = false
    
    var body: some View {
        VStack {
            HStack {
                Text("Portfolio")
                    .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                Spacer()
            }
            Spacer()
            HStack {
                VStack(alignment: .leading) {
                    if stockDetailVM.stockDetailData.portFolioData.stockBroughtFlag{
                        Spacer()
                        Text("Shares Owned: ").bold() + Text("\(stockDetailVM.stockDetailData.portFolioData.stocksOwnedQuantity)")
                        Spacer()
                        Text("Avg. Cost/Share: ").bold() + Text("$\(stockDetailVM.stockDetailData.portFolioData.AvgCostPerShare)")
                        Spacer()
                        Text("Total Cost: ").bold() + Text("$\(stockDetailVM.stockDetailData.portFolioData.TotalCost)")
                        Spacer()
                        if let changeInPriceFromTotalCostPercent = Float(stockDetailVM.stockDetailData.portFolioData.changeInPricePercent) {
                            Text("Change: ").bold() +
                                Text("$\(stockDetailVM.stockDetailData.portFolioData.Change)")
                                    .foregroundColor(changeInPriceFromTotalCostPercent > 0.0 ? .green : (changeInPriceFromTotalCostPercent < 0.0 ? .red : .black))

                            Spacer()
                            Text("Market Value: ").bold() + Text("$\(stockDetailVM.stockDetailData.portFolioData.MarketValue)")
                                .foregroundColor(changeInPriceFromTotalCostPercent > 0.0 ? .green : (changeInPriceFromTotalCostPercent < 0.0 ? .red : .black))
                        }
                    } else {
                        Text("You have 0 shares of "+stockTicker+".\nStart trading!")
                    }
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Button(action: {
                        ModalPresented = true
                    }) {
                        Text("Trade")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding()
                            .frame(height: 44)
                            .background(RoundedRectangle(cornerRadius: 22).fill(Color.green))
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .sheet(isPresented: $ModalPresented) {
                    tradeModalView(stockDetailVM: stockDetailVM, stockTicker: stockTicker)
                }
            }
        }.padding(.bottom)
    }
}

struct tradeModalView: View {
    var stockDetailVM: StockDetailViewModel
    var stockTicker: String
    
    @Environment(\.presentationMode) var presentationMode
    @State private var noOfStocks = ""
    @State private var successModalFlag = false
    @State private var successMessage = ""
    @State private var toastFlag = false
    @State private var toastMessage = ""
    
    var body: some View {
        ZStack{
            if successModalFlag {
                VStack {
                    Spacer()
                    Text("Congratulations!")
                        .foregroundColor(.white)
                        .fontWeight(.bold)
                        .font(.largeTitle)
                        .padding(10)
                    Text(successMessage)
                        .foregroundColor(.white)
                    Spacer()
                    Button(action: {
                        updatePortfolio(stockTicker: stockTicker)
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Text("Done")
                            .fontWeight(.semibold)
                            .foregroundColor(.green)
                            .padding()
                            .frame(width: 350)
                            .frame(height: 44)
                            .background(RoundedRectangle(cornerRadius: 22).fill(Color.white))
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.green)
            } else {
                VStack(alignment: .leading) {
                    HStack {
                        Spacer()
                        Button(action: {
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Image(systemName: "xmark")
                                .foregroundColor(.black)
                                .font(.headline)
                        }
                        .padding()
                    }
                    HStack {
                        Spacer()
                        Text("Trade " + stockDetailVM.stockDetailData.insightsData.companyName + " shares")
                            .fontWeight(.bold)
                        Spacer()
                    }
                    Spacer()
                    HStack (alignment: .bottom) {
                        TextField("0", text: $noOfStocks)
                            .font(.system(size: 100))
                        Spacer()
                        Text( (noOfStocks == "") || (noOfStocks == "1") ? "Share" : "Shares")
                            .font(.system(size: 40))
                    }
                    Spacer()
                    HStack {
                        Spacer()
                        Text("X $\(stockDetailVM.stockDetailData.portFolioData.CurrentPrice)/share = $\( String(format:"%.2f", (Double(noOfStocks) ?? 0.0)*(Double(stockDetailVM.stockDetailData.portFolioData.CurrentPrice) ?? 0.0)) )")
                    }
                    Spacer()
                    HStack {
                        Spacer()
                        Text("$"+String(stockDetailVM.stockDetailData.walletMoney)+" available to buy " + stockTicker)
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                    HStack {
                        Spacer()
                        Button(action: {
                            fnBuyStocks(noOfStocks: noOfStocks, walletMoney: stockDetailVM.stockDetailData.walletMoney, currentPrice: stockDetailVM.stockDetailData.portFolioData.CurrentPrice, stockTicker: stockTicker)
                        }) {
                            Text("Buy")
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding()
                                .frame(width: 150)
                                .frame(height: 44)
                                .background(RoundedRectangle(cornerRadius: 22).fill(Color.green))
                        }
                        Button(action: {
                            fnSellStocks(noOfStocks: noOfStocks, currentNoOfStocks: stockDetailVM.stockDetailData.portFolioData.stocksOwnedQuantity, currentPrice: stockDetailVM.stockDetailData.portFolioData.CurrentPrice, stockTicker: stockTicker)
                        }) {
                            Text("Sell")
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding()
                                .frame(width: 150)
                                .frame(height: 44)
                                .background(RoundedRectangle(cornerRadius: 22).fill(Color.green))
                        }
                        Spacer()
                    }
                }
            }
            if toastFlag {
                ToastView(toastMessage: toastMessage)
                    .transition(.asymmetric(insertion: .move(edge: .bottom), removal: .opacity))
                    .zIndex(1)
            }
        }
    }
    
    func updatePortfolio(stockTicker: String) {
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerSymbol", value: stockTicker)]
                
        urlComponents.path = "/api/getStockPortfolioData"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: { data in
            if data != nil{
                guard let res: portFolioData = data?.parseTo() else { print("No Data"); return }
                self.stockDetailVM.stockDetailData.portFolioData = res
            }
        })
    }
    
    func fnSellStocks(noOfStocks: String, currentNoOfStocks: Int, currentPrice: String, stockTicker: String) {
        if let stocks = Double(noOfStocks){}
        else {
            self.toastMessage = "Please enter a valid amount"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        
        if (Double(noOfStocks) ?? 0.00 > Double(currentNoOfStocks)){
            self.toastMessage = "Not enough shares to sell"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        
        if (Double(noOfStocks) ?? 0.00 <= 0.0) {
            self.toastMessage = "Cannot sell non-positive shares"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerValue", value: stockTicker), URLQueryItem(name: "quantity", value: (noOfStocks))]
                
        urlComponents.path = "/api/updatePortfolio"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                print("Success Sold from portfolio")
                self.successModalFlag = true
                self.successMessage = ((Int(noOfStocks) == 1) ? "You have successfully sold 1 share of \(stockTicker)" : "You have successfully sold \(noOfStocks) shares of \(stockTicker)")
            } else {
                print("Failure Sold from portfolio")
            }
        })
    }
    
    func fnBuyStocks(noOfStocks: String, walletMoney: Float, currentPrice: String, stockTicker: String) {
        if let stocks = Double(noOfStocks){}
        else {
            self.toastMessage = "Please enter a valid amount"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        
        if ((Double(noOfStocks) ?? 0.00) * (Double(currentPrice) ?? 0.00) > Double(walletMoney)){
            self.toastMessage = "Not enough money to buy"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        if (Double(noOfStocks) ?? 0.00 <= 0.0) {
            self.toastMessage = "Cannot buy non-positive shares"
            self.toastFlag.toggle()
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                self.toastFlag = false
            }
            return
        }
        
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerValue", value: stockTicker), URLQueryItem(name: "quantity", value: (noOfStocks)), URLQueryItem(name: "costPerStock", value: currentPrice)]
                
        urlComponents.path = "/api/addPortfolio"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        print(endpoint)
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                print("Success Added to portfolio")
                self.successModalFlag = true
                self.successMessage = ((Int(noOfStocks) == 1) ? "You have successfully brought 1 share of \(stockTicker)" : "You have successfully brought \(noOfStocks) shares of \(stockTicker)")
            } else {
                print("Failure Added to portfolio")
            }
        })
    }
}

struct stockDetailInitialView: View {
    @ObservedObject var stockDetailVM: StockDetailViewModel
    
    var body: some View {
        HStack {
            Text(stockDetailVM.stockDetailData.insightsData.companyName).foregroundColor(.secondary)
                .font(.system(size: 20) )
            Spacer()
        }
        HStack(alignment: .bottom) {
            Text("$" + stockDetailVM.stockDetailData.portFolioData.CurrentPrice)
                .font(.system(size: 30, weight: .bold))
            if let changeInPriceFromTotalCostPercent = Float(stockDetailVM.stockDetailData.portFolioData.changeInPrice) {
                if changeInPriceFromTotalCostPercent > 0.0 {
                    Image(systemName: "arrow.up.forward")
                        .foregroundColor(.green)
                        .font(.system(size: 20))
                    Text(" $\(stockDetailVM.stockDetailData.portFolioData.changeInPrice) (\(stockDetailVM.stockDetailData.portFolioData.changeInPricePercent)%)")
                        .foregroundColor(.green)
                        .font(.system(size: 20))
                } else if changeInPriceFromTotalCostPercent == 0.0 {
                    Image(systemName: "minus")
                        .font(.system(size: 20))
                    Text(" $\(stockDetailVM.stockDetailData.portFolioData.changeInPrice) (\(stockDetailVM.stockDetailData.portFolioData.changeInPricePercent)%)")
                        .font(.system(size: 20))
                } else {
                    Image(systemName: "arrow.down.forward")
                        .foregroundColor(.red)
                        .font(.system(size: 20))
                    Text(" $\(stockDetailVM.stockDetailData.portFolioData.changeInPrice) (\(stockDetailVM.stockDetailData.portFolioData.changeInPricePercent)%)")
                        .foregroundColor(.red)
                        .font(.system(size: 20))
                }
                Spacer()
            } else {
                Text("Nan")
            }
        }
    }
}


