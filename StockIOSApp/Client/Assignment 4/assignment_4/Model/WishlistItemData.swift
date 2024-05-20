//
//  WishlistItemData.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/12/23.
//

import Foundation

struct WishlistItemData: Codable, Hashable {
    let itemId: String
    let imageURL: String
    let title: String
    let itemURL: String
    let condition: String
    let pincode: String
    let itemPrice: Float
    let shippingPrice: Float
}
