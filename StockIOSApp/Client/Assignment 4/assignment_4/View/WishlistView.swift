//
//  WishlistView.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/12/23.
//

import SwiftUI

struct WishlistView: View {
    @EnvironmentObject private var wishlistVm: WishlistViewModel

    let onRemovedFromWishlist: (_ id: String, _ showToast: Bool) -> Void

    var body: some View {
        VStack {
            if wishlistVm.wishlistItems == nil {
                Text("Loading...")
            } else {
                if wishlistVm.wishlistItems!.count == 0 {
                    Text("No items in wishlist")
                } else {
                    List {
                        HStack {
                            Text("Wishlist total(\(wishlistVm.wishlistItems!.count)) items:")
                            Spacer()
                            Text("$\(getTotalPrice(), specifier: "%.2f")")
                        }
                        ForEach(wishlistVm.wishlistItems!, id: \.self) {
                            item in

                            WishlistCell(data: item)
                        }
                        .onDelete { indexSet in
                            for i in indexSet {
                                onRemovedFromWishlist(wishlistVm.wishlistItems![i].itemId, false)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Favorites")
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) {
                if wishlistVm.wishlistItems == nil {
                    APIService.instance.callInternalGetAPI(endpoint: "/api/getWishlistItems", completion: {
                        data in

                        if data != nil {
                            guard let res: [WishlistItemData] = data?.parseTo() else {
                                print("Cannot parse WishlistItemData")
                                return
                            }
                            wishlistVm.wishlistItems = res
                        } else {
                            print("failure")
                        }
                    })
                }
            }
        }
    }

    private func getTotalPrice() -> Float {
        guard wishlistVm.wishlistItems != nil else { return 0 }

        var total: Float = 0

        for item in wishlistVm.wishlistItems! {
            total = total + item.itemPrice
        }

        return total
    }
}

struct WishlistView_Previews: PreviewProvider {
    static var previews: some View {
        WishlistView(onRemovedFromWishlist: {
            _, _ in

        }).environmentObject(WishlistViewModel())
    }
}
