//
//  WishlistCell.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/12/23.
//

import SwiftUI

struct WishlistCell: View {
    let data: WishlistItemData

    private let imageSize: CGFloat = 80
    private let imageCornerRadius: CGFloat = 10

    var body: some View {
        HStack {
            CustomImage(width: imageSize, height: imageSize, cornerRadius: imageCornerRadius, imageURL: data.imageURL)
            VStack(alignment: .leading) {
                Text(data.title).lineLimit(1)
                Text("$\(data.itemPrice, specifier: "%.2f")")
                    .fontWeight(.black)
                    .foregroundColor(Color.blue)
                Text(data.shippingPrice == 0 ? "FREE SHIPPING" : String(format: "$ %.2f", data.shippingPrice))
                    .foregroundColor(Color.gray)
                HStack {
                    Text(data.pincode)
                        .foregroundColor(Color.gray)
                    Spacer()
                    Text(getCondition())
                        .foregroundColor(Color.gray)
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
    WishlistCell(data: WishlistItemData(itemId: "285492443051", imageURL: "https://i.ebayimg.com/thumbs/images/g/SMgAAOSwxOJlJtHl/s-l140.jpg", title: "Apple iPhone 13 512GB A2482 5G Factory Unlocked Brand New", itemURL: "https://www.ebay.com/itm/Apple-iPhone-13-512GB-A2482-5G-Factory-Unlocked-Brand-New-/285492443051?var=587438156341", condition: "1000", pincode: "900**", itemPrice: 659.99, shippingPrice: 0.0))
}
