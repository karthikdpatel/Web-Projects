//
//  ItemListData.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/9/23.
//

import Foundation

struct ItemListData: Codable, Hashable {
    let itemCount: Int
    let items: [ItemListItemData]
}

struct ItemListItemData: Codable, Hashable {
    let id: String
    let title: String
    let itemPrice: Float
    let shippingPrice: Float
    let imageURL: String
    let postalCode: String
    let link: String
    var addedToWishlist: Bool
    let condition: String
    let handlingTime: Int
    let shippingLocations: String?
    let isReturnsAccepted: Bool?
    let isExpShipping: Bool?
    let isOneDayShipping: Bool?
}
