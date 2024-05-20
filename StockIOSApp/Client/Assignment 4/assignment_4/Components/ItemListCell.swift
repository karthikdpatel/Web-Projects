//
//  ItemListCell.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ItemListCell: View {
    let data: ItemListItemData
    let onAddedToWishlist: (_ data: ItemListItemData, _ showToast: Bool) -> Void
    let onRemovedFromWishlist: (_ id: String, _ showToast: Bool) -> Void

    private let imageSize: CGFloat = 80
    private let imageCornerRadius: CGFloat = 10

    var body: some View {
        NavigationLink(destination: ProductDetailsView(
            selectedItemId: data.id,
            isAddedToWishlistInitially: data.addedToWishlist,
            onAddedToWishlist: onAddedToWishlist,
            onRemovedFromWishlist: onRemovedFromWishlist
        )) {
            HStack {
                CustomImage(width: imageSize, height: imageSize, cornerRadius: imageCornerRadius, imageURL: data.imageURL)
                VStack(alignment: .leading) {
                    Text(data.title).lineLimit(1)
                    Text("$\(data.itemPrice, specifier: "%.2f")")
                        .fontWeight(.black)
                        .foregroundColor(Color.blue)
                    Text(data.shippingPrice == 0 ? "FREE SHIPPING" : "$\(data.shippingPrice, specifier: "%.2f")")
                        .foregroundColor(Color.gray)
                    HStack {
                        Text(data.postalCode)
                            .foregroundColor(Color.gray)
                        Spacer()
                        Text(getCondition())
                            .foregroundColor(Color.gray)
                    }
                }
                Image(systemName: data.addedToWishlist ? "heart.fill" : "heart")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .foregroundColor(Color(UIColor.red))
                    .frame(width: 30.0, height: 30.0)
                    .onTapGesture {
                        if data.addedToWishlist {
                            onRemovedFromWishlist(data.id, true)
                        } else {
                            onAddedToWishlist(data, true)
                        }
                    }
            }
        }
    }

    private func getCondition() -> String {
        switch data.condition {
        case "1000":
            return "NEW"
        case "2000":
            return "REFURBISHED"
        case "2500":
            return "REFURBISHED"
        case "3000":
            return "USED"
        case "4000":
            return "USED"
        case "5000":
            return "USED"
        case "6000":
            return "USED"
        default:
            return "N/A"
        }
    }
}

#Preview {
    ItemListCell(data: ItemListItemData(id: "285492443051", title: "Apple iPhone 13 512GB A2482 5G Factory Unlocked Brand New", itemPrice: 659.99, shippingPrice: 0.0, imageURL: "https://i.ebayimg.com/thumbs/images/g/SMgAAOSwxOJlJtHl/s-l140.jpg", postalCode: "803**", link: "https://www.ebay.com/itm/Apple-iPhone-13-512GB-A2482-5G-Factory-Unlocked-Brand-New-/285492443051?var=587438156341", addedToWishlist: true, condition: "1000", handlingTime: 0, shippingLocations: nil, isReturnsAccepted: nil, isExpShipping: nil, isOneDayShipping: nil), onAddedToWishlist: {
        _, _ in
    }, onRemovedFromWishlist: {
        _, _ in

    })
}
