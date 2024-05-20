//
//  tickerSuggestions.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/17/24.
//

import Foundation

struct TickerSuggestions: Codable, Hashable {
    let suggestions: [suggestion]
}

struct suggestion: Codable, Hashable {
    let tickerSymbol: String
    let tickerName: String
}
