//
//  ProductDetailSimilar.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ProductDetailSimilar: View {
    let itemId: String

    @State private var filter1: String = "0"
    @State private var filter2: String = "0"
    @State private var allItems: [SimilarItemMetaData]?

    private func getFilteredData() -> [SimilarItemMetaData]? {
        guard allItems != nil else { return nil }

        switch filter1 {
        case "0":
            return allItems

        case "1":
            if filter2 == "0" {
                return allItems!.sorted(by: { a, b in a.title.compare(b.title, options: [.caseInsensitive]) == .orderedAscending })
            } else {
                return allItems!.sorted(by: { a, b in a.title.compare(b.title, options: [.caseInsensitive]) == .orderedDescending })
            }

        case "2":
            if filter2 == "0" {
                return allItems!.sorted(by: { a, b in a.itemPrice < b.itemPrice })
            } else {
                return allItems!.sorted(by: { a, b in a.itemPrice > b.itemPrice })
            }

        case "3":
            if filter2 == "0" {
                return allItems!.sorted(by: { a, b in a.daysLeft < b.daysLeft })
            } else {
                return allItems!.sorted(by: { a, b in a.daysLeft > b.daysLeft })
            }

        case "4":
            if filter2 == "0" {
                return allItems!.sorted(by: { a, b in a.shippingPrice < b.shippingPrice })
            } else {
                return allItems!.sorted(by: { a, b in a.shippingPrice > b.shippingPrice })
            }

        default:
            return allItems
        }
    }

    var body: some View {
        VStack {
            if allItems == nil {
                ProgressView("Please wait...").id(randomString(length: 10))
            } else {
                VStack {
                    HStack {
                        Text("Sort By")
                            .fontWeight(.heavy)
                        Spacer()
                    }
                    Picker(selection: $filter1, label: Text("Sort By")) {
                        Text("Default").tag("0")
                        Text("Name").tag("1")
                        Text("Price").tag("2")
                        Text("Days Left").tag("3")
                        Text("Shipping").tag("4")
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: filter1) {
                        _, _ in
                        filter2 = "0"
                    }
                }
                if filter1 != "0" {
                    VStack {
                        HStack {
                            Text("Order")
                                .fontWeight(.heavy)
                            Spacer()
                        }
                        Picker(selection: $filter2, label: Text("Order")) {
                            Text("Ascending").tag("0")
                            Text("Descending").tag("1")
                        }
                        .pickerStyle(.segmented)
                    }
                }
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ForEach(getFilteredData()!, id: \.self) {
                            item in

                            VStack {
                                CustomImage(width: nil, height: 170, cornerRadius: 10, imageURL: item.imageURL)
                                Text(item.title).lineLimit(2)
                                HStack {
                                    Text("$\(item.shippingPrice, specifier: "%.2f")")
                                        .foregroundColor(Color.gray)
                                    Spacer()
                                    Text("\(item.daysLeft) days left")
                                        .foregroundColor(Color.gray)
                                }
                                HStack {
                                    Spacer()
                                    Text("$\(item.itemPrice, specifier: "%.2f")")
                                        .fontWeight(.bold)
                                        .foregroundColor(Color.blue)
                                }
                            }
                            .padding(.all, 10)
                            .background(RoundedRectangle(cornerRadius: 25.0, style: .continuous)
                                .inset(by: 3)
                                .stroke(Color.gray, lineWidth: 5)
                                .fill(Color("cardBG")))
                        }
                    }
                }
            }
        }.onAppear {
            APIService.instance.callInternalGetAPI(endpoint: "/api/getSimilarProducts/\(itemId)", completion: {
                data in

                if data != nil {
                    guard let res: SimilarItemData = data?.parseTo() else {
                        print("Cannot parse SimilarItemData")
                        return
                    }
                    allItems = res.similarItems
                } else {
                    print("failure")
                }
            })
        }
        .padding(.all, 8.0)
    }
}

#Preview {
    ProductDetailSimilar(itemId: "144747997919")
}
