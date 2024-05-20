//
//  ProductDetailsView.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ProductDetailsView: View {
    @EnvironmentObject private var productDetailsVm: ProductDetailsViewModel
    @EnvironmentObject private var itemListVm: ItemListViewModel

    let selectedItemId: String
    let isAddedToWishlistInitially: Bool
    let onAddedToWishlist: (_ data: ItemListItemData, _ showToast: Bool) -> Void
    let onRemovedFromWishlist: (_ id: String, _ showToast: Bool) -> Void

    var body: some View {
        TabView {
            if productDetailsVm.itemDetails == nil {
                ProgressView().id(randomString(length: 10))
            } else {
                ProductDetailInfo()
                    .tabItem {
                        Label("Info", systemImage: "info.circle.fill")
                    }
                    .padding(.horizontal)
                ProductDetailShipping()
                    .tabItem {
                        Label("Shipping", systemImage: "shippingbox.fill")
                    }
                ProductDetailPhotos()
                    .tabItem {
                        Label("Photos", systemImage: "photo.stack.fill")
                    }
                ProductDetailSimilar(itemId: productDetailsVm.selectedItemListInfo!.id)
                    .tabItem {
                        Label("Similar", systemImage: "list.bullet.indent")
                    }
            }
        }
        .toolbar {
            ToolbarItemGroup(placement: ToolbarItemPlacement.topBarTrailing) {
                if productDetailsVm.selectedItemListInfo != nil {
                    Link(destination: URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(productDetailsVm.selectedItemListInfo!.link)")!) {
                        Image("fb")
                            .resizable()
                            .frame(width: 30, height: 30)
                    }

                    Image(systemName: productDetailsVm.selectedItemListInfo!.addedToWishlist ? "heart.fill" : "heart")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .foregroundColor(Color(UIColor.red))
                        .frame(width: 30.0, height: 30.0)
                        .onTapGesture {
                            if self.productDetailsVm.selectedItemListInfo!.addedToWishlist {
                                self.onRemovedFromWishlist(selectedItemId, false)
                            } else {
                                self.onAddedToWishlist(productDetailsVm.selectedItemListInfo!, false)
                            }
                        }
                }

                else {
                    Image("fb")
                        .resizable()
                        .frame(width: 30, height: 30)

                    Image(systemName: isAddedToWishlistInitially ? "heart.fill" : "heart")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .foregroundColor(Color(UIColor.red))
                        .frame(width: 30.0, height: 30.0)
                }
            }
        }
        .onAppear {
            if productDetailsVm.selectedItemListInfo?.id != selectedItemId {
                initializeData()
            }
        }
    }

    private func initializeData() {
        productDetailsVm.selectedItemListInfo = nil
        productDetailsVm.itemDetails = nil

        let itemListIndex = itemListVm.allItems?.firstIndex(where: { $0.id == selectedItemId })

        APIService.instance.callInternalGetAPI(endpoint: "/api/getItemDetails/\(selectedItemId)", completion: {
            details in

            if details != nil {
                guard let res: ItemDetailData = details?.parseTo() else {
                    print("Cannot parse ItemDetailData")
                    return
                }

                if itemListIndex == nil {
                    APIService.instance.callInternalGetAPI(endpoint: "/api/getItems?keywords=\(selectedItemId)", completion: {
                        listData in

                        if listData != nil {
                            guard let listRes: ItemListData = listData?.parseTo() else {
                                print("Cannot parse ItemListData")
                                return
                            }
                            productDetailsVm.selectedItemListInfo = listRes.items[0]
                            productDetailsVm.itemDetails = res

                        } else {
                            print("failure")
                        }
                    })
                } else {
                    productDetailsVm.selectedItemListInfo = itemListVm.allItems![itemListIndex!]
                    productDetailsVm.itemDetails = res
                }
            } else {
                print("failure")
            }

        })
    }
}

struct ProductDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        ProductDetailsView(selectedItemId: "285492443051", isAddedToWishlistInitially: false, onAddedToWishlist: { _, _ in }, onRemovedFromWishlist: { _, _ in })
            .environmentObject(ProductDetailsViewModel())
            .environmentObject(ItemListViewModel())
    }
}
