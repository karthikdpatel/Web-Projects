//
//  ItemListView.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ItemListView: View {
    @EnvironmentObject private var itemListVm: ItemListViewModel
    @EnvironmentObject private var productSearchVm: ProductSearchViewModel

    let onAddedToWishlist: (_ data: ItemListItemData, _ showToast: Bool) -> Void
    let onRemovedFromWishlist: (_ id: String, _ showToast: Bool) -> Void

    var body: some View {
        Text("Results").fontWeight(.bold)
        if productSearchVm.isLoading {
            HStack {
                Spacer()
                ProgressView("Please Wait...").id(randomString(length: 10))
                Spacer()
            }
        } else {
            if itemListVm.allItems?.count == 0 {
                Text("No results found")
                    .foregroundColor(Color.red)
            }
            ForEach(itemListVm.allItems ?? [], id: \.self) { item in
                ItemListCell(
                    data: item,
                    onAddedToWishlist: onAddedToWishlist,
                    onRemovedFromWishlist: onRemovedFromWishlist
                )
            }
        }
    }
}

struct ItemListView_Previews: PreviewProvider {
    static var previews: some View {
        ItemListView(onAddedToWishlist: {
            _, _ in
        }, onRemovedFromWishlist: {
            _, _ in

        })
        .environmentObject(ItemListViewModel()).environmentObject(ProductSearchViewModel())
    }
}
