//
//  WebTechAssignment4App.swift
//  WebTechAssignment4
//
//  Created by Karthik Patel on 4/12/24.
//

import SwiftUI

@main
struct WebTechAssignment4App: App {
    @StateObject private var homeDataVM: HomeDataModelView = HomeDataModelView();
        
    var body: some Scene {
        WindowGroup {
            NavigationStack{
                ContentView()
            }
            .environmentObject(homeDataVM)
        }
    }
}
