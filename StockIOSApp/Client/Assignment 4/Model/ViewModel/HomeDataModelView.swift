//
//  HomeDataModelView.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/12/24.
//

import SwiftUI
import Foundation

class HomeDataModelView: ObservableObject {
    @Published var isLoading = true
    
    @Published var date: String
    @Published var walletMoney: String = "0.00"
    @Published var netWorth: String = "0.00"
    @Published var portfolioDataFlag: Bool = false
    @Published var portFolioData: [PortfolioDataModel] = []
    @Published var watchListFlag: Bool = false
    @Published var watchListData: [WatchListData] = []
    
    init() {
        self.isLoading = true
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMMM d, yyyy"
        self.date = dateFormatter.string(from: Date())
        getData()
    }
    
    func reload() {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMMM d, yyyy"
        self.date = dateFormatter.string(from: Date())
        getData()
    }
    
    private func getData() {
        APIService.instance.callInternalGetAPI(endpoint: "/api/getPortfolioData", completion: {
            data in
            if data != nil {
                guard let res: HomeDataModel = data?.parseTo() else { print("No Data"); return }
                self.walletMoney = res.walletMoney
                self.netWorth = res.netWorth
                self.portfolioDataFlag = res.portfolioDataFlag
                self.portFolioData = res.portFolioData
                self.watchListFlag = res.watchListFlag
                self.watchListData = res.watchListData
                self.isLoading = false
            } else {
                print("failure")
            }
        })
    }
}
