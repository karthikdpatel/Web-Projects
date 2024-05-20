//
//  SimilarItemData.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/12/23.
//

import Foundation

struct SimilarItemData: Codable, Hashable {
    let similarItems: [SimilarItemMetaData]
}

struct SimilarItemMetaData: Codable, Hashable {
    let itemId: String
    let title: String
    let itemURL: String
    let imageURL: String
    let itemPrice: Float
    let shippingPrice: Float
    let daysLeft: Int
}
