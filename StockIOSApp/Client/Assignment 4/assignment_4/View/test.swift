//
//  test.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/29/24.
//

import Foundation
import SwiftUI

struct ContentView1: View {
    @State private var searchText = ""
    @State private var items = ["Apple", "Banana", "Cherry", "Date"]

    var filteredItems: [String] {
        if searchText.isEmpty {
            return items
        } else {
            return items.filter { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        NavigationStack {
            List(filteredItems, id: \.self) { item in
                NavigationLink(destination: DetailView(item: item)) {
                    Text(item)
                }
            }
            .navigationTitle("Fruits")
            .searchable(text: $searchText, prompt: "Search for a fruit")
            .onChange(of: searchText) { newValue in
                // Handle changes to search text if needed
            }
        }
    }
}

struct DetailView: View {
    let item: String

    var body: some View {
        Text("Details for \(item)")
    }
}


#Preview {
    ContentView1()
}


