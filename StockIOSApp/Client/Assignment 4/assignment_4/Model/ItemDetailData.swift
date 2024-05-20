//
//  ItemDetailData.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import Foundation

struct ItemDetailData: Codable, Hashable {
    let productImages: [String]
    let price: Float
    let title: String
    let itemLink: String
    let returnPolicy: String
    let itemSpecifics: [ItemSpecificsData]
    let popularity: Float
    let feedbackScore: Int
    let location: String?
    let feedbackRatingStar: String?
    let sellerUserId: String?
    let isTopRated: Bool?
    let storeName: String?
    let storeURL: String?
    let handlingTime: Int
    let isGlobalShipping: Bool?
    let policy: String
    let refundMode: String
    let returnWithin: String
    let shippingCostPaidBy: String
    let shippingCosts: Float
}

struct ItemSpecificsData: Codable, Hashable {
    let name: String
    let value: String
}
