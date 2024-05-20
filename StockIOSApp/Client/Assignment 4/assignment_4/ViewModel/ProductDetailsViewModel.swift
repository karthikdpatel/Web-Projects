//
//  ProductDetailsViewModel.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

class ProductDetailsViewModel: ObservableObject {
    @Published var selectedItemListInfo: ItemListItemData?
    @Published var itemDetails: ItemDetailData?

    init() {}
}
