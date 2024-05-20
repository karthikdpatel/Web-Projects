//
//  ProductDetailInfo.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ProductDetailInfo: View {
    @EnvironmentObject private var productDetailsVm: ProductDetailsViewModel

    @State private var carouselIndex = 0

    // Mock Data for viewing preview
    private let mockImages = [
        "https://i.ebayimg.com/00/s/ODI0WDEyMTM=/z/cY4AAOSwWxZlCxd8/$_57.JPG?set_id=8800005007",
        "https://i.ebayimg.com/00/s/MTAwMFgxMDAw/z/GpkAAOSw6wBlCxeE/$_57.JPG?set_id=8800005007",
        "https://i.ebayimg.com/00/s/MTA5M1g5MTY=/z/iAkAAOSw9g5lCxeF/$_57.JPG?set_id=8800005007",
    ]
    private let mockTitle = "Apple - iPhone 15 - 128GB - Unlocked - Factory Warranty - All Colors"
    private let mockPrice: Float = 919
    private let mockDescriptions: [ItemSpecificsData] = [
        ItemSpecificsData(name: "Processor", value: "A16 Bionic Chip"),
        ItemSpecificsData(name: "Chipset Model", value: "Apple A16 Bionic"),
        ItemSpecificsData(name: "Lock Status", value: "Factory Unlocked"),
    ]

    var body: some View {
        let images: [String] = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.productImages : mockImages
        let title: String = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.title : mockTitle
        let price: Float = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.price : mockPrice
        let descriptions: [ItemSpecificsData] = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.itemSpecifics : mockDescriptions

        VStack {
            VStack {
                if !images.isEmpty {
                    TabView(selection: $carouselIndex) {
                        ForEach(0 ..< images.count, id: \.self) { index in
                            CustomImage(width: nil, height: 220, cornerRadius: 0, imageURL: images[index])
                        }
                    }
                    .tabViewStyle(PageTabViewStyle(indexDisplayMode: .always))
                    .onAppear {
                        UIPageControl.appearance().currentPageIndicatorTintColor = .black
                        UIPageControl.appearance().pageIndicatorTintColor = UIColor.gray.withAlphaComponent(0.6)
                    }
                }
            }
            .frame(width: 250, height: 250)
            HStack {
                Text(title)
                Spacer()
            }
            .padding(.top)
            if price != -1 {
                HStack {
                    Text("$\(price, specifier: "%.2f")")
                        .fontWeight(.bold)
                        .foregroundColor(Color.blue)

                    Spacer()
                }
                .padding(.top, 4)
            }
            HStack {
                Image(systemName: "magnifyingglass")
                Text("Description")
                Spacer()
            }
            .padding(.top, 4)
            ScrollView {
                VStack(spacing: 0) {
                    Divider()
                    ForEach(descriptions, id: \.self) {
                        item in
                        HStack {
                            HStack {
                                Text(item.name).font(.footnote)
                                Spacer()
                            }
                            HStack {
                                Text(item.value).font(.footnote)
                                Spacer()
                            }
                        }.padding(.vertical, 0.0)
                        Divider()
                    }
                }
            }
        }
    }
}

struct ProductDetailInfo_Previews: PreviewProvider {
    static var previews: some View {
        ProductDetailInfo()
            .environmentObject(ProductDetailsViewModel())
    }
}
