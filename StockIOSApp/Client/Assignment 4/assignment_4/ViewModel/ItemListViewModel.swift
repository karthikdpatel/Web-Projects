//
//  ItemListViewModel.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/10/23.
//

import SwiftUI

class ItemListViewModel: ObservableObject {
    @Published var allItems: [ItemListItemData]?
    @Published var showToast: Bool = false
    @Published var toastMessage: String = ""

    init() {}
}
