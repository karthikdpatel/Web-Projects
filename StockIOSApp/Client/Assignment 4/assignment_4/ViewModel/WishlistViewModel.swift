//
//  WishlistViewModel.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/12/23.
//

import SwiftUI

class WishlistViewModel: ObservableObject {
    @Published var wishlistItems: [WishlistItemData]?

    init() {}
}
