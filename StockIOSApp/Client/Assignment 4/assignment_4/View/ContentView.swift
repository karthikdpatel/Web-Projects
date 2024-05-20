//
//  ContentView.swift
//  WebTechAssignment4
//
//  Created by Karthik Patel on 4/12/24.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var homeDataVM: HomeDataModelView
    @State private var searchText = ""
    @State private var searchResults: [suggestion] = []
    @State private var debouncer = Debouncer(delay: 0.5)
    
    @State private var searchFlag = false
    
    var body: some View {
        if !homeDataVM.isLoading {
            NavigationStack {
                List {
                    if !searchFlag {
                        Section() {
                            DateView()
                        }
                        Section(header: Text("Portfolio").textCase(/*@START_MENU_TOKEN@*/.uppercase/*@END_MENU_TOKEN@*/)) {
                            PortfolioView()
                        }
                        Section(header: Text("Favorites").textCase(/*@START_MENU_TOKEN@*/.uppercase/*@END_MENU_TOKEN@*/)) {
                            FavoritesView()
                        }
                        Section() {
                            HStack {
                                Spacer()
                                Link("Powered By Finnhub.io", destination: URL(string: "https://www.finnhub.io")!)
                                    .foregroundColor(.secondary)
                                Spacer()
                            }
                        }
                    } else {
                        ForEach(searchResults, id: \.self) { result in
                            NavigationLink(destination: stockDetailView(stockTicker: result.tickerSymbol)) {
                                VStack(alignment: .leading) {
                                    Text(result.tickerSymbol)
                                        .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                                        .font(.title2)
                                    Text(result.tickerName)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                    
                }
                .navigationTitle("Stocks")
                .navigationBarTitleDisplayMode(.large)
                .navigationBarItems(trailing: EditButton())
                .searchable(text: $searchText)
            }
            .onChange(of: searchText) {
                if (searchText.isEmpty) {
                    searchResults = []
                    print("Empty")
                    searchFlag = false
                } else {
                    debouncer.run {
                        fetchSearchresults()
                    }
                    searchFlag = true
                }
            }
            .onAppear{
                homeDataVM.reload()
            }
        } else {
            LoadingView()
        }
    }
    
    func fetchSearchresults(){
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerSymbol", value: searchText)]
        
        urlComponents.path = "/api/getStockTickerSuggestion"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        print(searchText)
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                guard let res: TickerSuggestions = data?.parseTo() else { print("No Data"); return }
                searchResults = res.suggestions
            } else {
                print("failure")
            }
        })
        
    }
    
}

struct FavoritesView: View {
    @EnvironmentObject private var homeDataVM: HomeDataModelView
    var body: some View {
        if homeDataVM.portfolioDataFlag {
            ForEach(homeDataVM.watchListData, id: \.self) { watchList in
                NavigationLink(destination: stockDetailView(stockTicker: watchList.stockSymbol)) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text("\(watchList.stockSymbol)")
                                .font(.system(size: 20, weight: .bold))
                            Text("\(watchList.stockName)")
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("$\(watchList.currentPrice)")
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                            HStack {
                                if let changeInPricePercent = Float(watchList.changeInPricePercent) {
                                    if changeInPricePercent > 0.0 {
                                        Image(systemName: "arrow.up.forward")
                                            .foregroundColor(.green)
                                        Text("$\(watchList.changeInPrice) (\(watchList.changeInPricePercent)%)")
                                            .foregroundColor(.green)
                                    } else if changeInPricePercent == 0.0 {
                                        Image(systemName: "minus")
                                        Text("$\(watchList.changeInPrice) (\(watchList.changeInPricePercent)%)")
                                    } else {
                                        Image(systemName: "arrow.down.forward")
                                            .foregroundColor(.red)
                                        Text("$\(watchList.changeInPrice) (\(watchList.changeInPricePercent)%)")
                                            .foregroundColor(.red)
                                    }
                                } else {
                                    Text("Nan")
                                }
                            }
                        }
                    }
                }
            }.onDelete(perform: deleteFavorites)
                .onMove(perform: moveFavorites)
        }
    }
    
    func moveFavorites(from source: IndexSet, to destination: Int) {
        homeDataVM.watchListData.move(fromOffsets: source, toOffset: destination)
    }
    
    func deleteFavorites(at offsets: IndexSet) {
        let deletedItems = homeDataVM.watchListData.enumerated().filter { offsets.contains($0.offset) }.map { $0.element }
        let stockSymbol = deletedItems[0].stockSymbol
        var urlComponents = URLComponents()
        let params: [URLQueryItem] = [URLQueryItem(name: "tickerSymbol", value: stockSymbol)]
        
        urlComponents.path = "/api/deleteItemWatchList"
        urlComponents.queryItems = params
        
        let endpoint = urlComponents.url!.absoluteString
        
        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: {
            data in
            if data != nil {
                print("Deletion Success")
            } else {
                print("Failure")
            }
        })
        
        homeDataVM.watchListData.remove(atOffsets: offsets)
        
    }
    
}

struct PortfolioView: View {
    @EnvironmentObject private var homeDataVM: HomeDataModelView
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Net Worth")
                    .font(.system(size: 20, weight: .medium))
                Text("$\(homeDataVM.netWorth)")
                    .font(.system(size: 20, weight: .bold))
            }
            Spacer()
            VStack(alignment: .leading) {
                Text("Cash Balance")
                    .font(.system(size: 20, weight: .medium))
                Text("$\(homeDataVM.walletMoney)")
                    .font(.system(size: 20, weight: .bold))
            }
        }
        
        if homeDataVM.portfolioDataFlag {
            ForEach(homeDataVM.portFolioData, id: \.self) { portfolio in
                NavigationLink(destination: stockDetailView(stockTicker: portfolio.tickerValue)) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text("\(portfolio.tickerValue)")
                                .font(.system(size: 20, weight: .bold))
                            Text("\(portfolio.quantity) shares")
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("$\(portfolio.marketValue)")
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                            HStack {
                                if let changeInPriceFromTotalCostPercent = Float(portfolio.changeInPriceFromTotalCostPercent) {
                                    if changeInPriceFromTotalCostPercent > 0.0 {
                                        Image(systemName: "arrow.up.forward")
                                            .foregroundColor(.green)
                                        Text("  $\(portfolio.changeInPriceFromTotalCost) (\(portfolio.changeInPriceFromTotalCostPercent)%)")
                                            .foregroundColor(.green)
                                    } else if changeInPriceFromTotalCostPercent == 0.0 {
                                        Image(systemName: "minus")
                                        Text("  $\(portfolio.changeInPriceFromTotalCost) (\(portfolio.changeInPriceFromTotalCostPercent)%)")
                                    } else {
                                        Image(systemName: "arrow.down.forward")
                                            .foregroundColor(.red)
                                        Text("  $\(portfolio.changeInPriceFromTotalCost) (\(portfolio.changeInPriceFromTotalCostPercent)%)")
                                            .foregroundColor(.red)
                                    }
                                } else {
                                    Text("Nan")
                                }
                            }
                        }
                    }
                }
            }.onMove(perform: movePortfolio)
        }
    }
    
    func movePortfolio(from source: IndexSet, to destination: Int) {
        homeDataVM.portFolioData.move(fromOffsets: source, toOffset: destination)
    }
}

struct DateView: View {
    @EnvironmentObject private var homeDataVM: HomeDataModelView
    
    var body: some View {
        Text(homeDataVM.date)
            .font(.system(size: 24, weight: .bold, design: .rounded))
            .foregroundColor(.secondary)
            .padding(.top,10)
            .padding(.bottom,10)
            .padding(.leading,10)
    }
}

#Preview {
    ContentView()
        .environmentObject(HomeDataModelView())
}
