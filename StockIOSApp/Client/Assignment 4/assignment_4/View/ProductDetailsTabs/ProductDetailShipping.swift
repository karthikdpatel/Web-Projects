//
//  ProductDetailShipping.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ProductDetailShipping: View {
    @EnvironmentObject private var productDetailsVm: ProductDetailsViewModel

    // Mock Data for viewing preview
    private let mockStoreName = "ALLDAYZIP"
    private let mockStoreURL = "https://www.ebay.com/str/alldayzip"
    private let mockFeedbackScore = 37140
    private let mockPopularity: Float = 99.8
    private let mockShippingCost: Float = 0.0
    private let mockIsGlobalShipping = true
    private let mockHandlingTime = 1
    private let mockPolicy = "Returns Accepted"
    private let mockRefundMode = "Money back or replacement (buyer's choice)"
    private let mockReturnWithin = "60 Days"
    private let mockShippingCostPaidBy = "Seller"

    var body: some View {
        let storeName: String? = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.storeName : mockStoreName
        let storeURL: String? = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.storeURL : mockStoreURL
        let feedbackScore: Int = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.feedbackScore : mockFeedbackScore
        let popularity: Float = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.popularity : mockPopularity
        let shippingCost: Float = productDetailsVm.selectedItemListInfo != nil ? productDetailsVm.selectedItemListInfo!.shippingPrice : mockShippingCost
        let isGlobalShipping: Bool? = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.isGlobalShipping : mockIsGlobalShipping
        let handlingTime: Int = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.handlingTime : mockHandlingTime
        let policy: String = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.policy : mockPolicy
        let refundMode: String = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.refundMode : mockRefundMode
        let returnWithin: String = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.returnWithin : mockReturnWithin
        let shippingCostPaidBy: String = productDetailsVm.itemDetails != nil ? productDetailsVm.itemDetails!.shippingCostPaidBy : mockShippingCostPaidBy

        ScrollView {
            if (storeName != nil && storeURL != nil) || feedbackScore != -1 || popularity != -1 {
                firstSection(storeName: storeName, storeURL: storeURL, feedbackScore: feedbackScore, popularity: popularity)
                    .padding(.bottom)
            }

            if shippingCost != -1 || isGlobalShipping != nil || handlingTime != -1 {
                secondSection(shippingCost: shippingCost, isGlobalShipping: isGlobalShipping, handlingTime: handlingTime)
                    .padding(.bottom)
            }

            if policy != "" || refundMode != "" || returnWithin != "" || shippingCostPaidBy != "" {
                thirdSection(policy: policy, refundMode: refundMode, returnWithin: returnWithin, shippingCostPaidBy: shippingCostPaidBy)
                    .padding(.bottom)
            }
        }
    }

    private struct firstSection: View {
        let storeName: String?
        let storeURL: String?
        let feedbackScore: Int
        let popularity: Float

        var body: some View {
            VStack(spacing: 8) {
                VStack {
                    Divider()
                    HStack {
                        Label("Seller", systemImage: "storefront")
                            .foregroundColor(.black)
                        Spacer()
                    }
                    Divider()
                }

                if storeName != nil && storeURL != nil {
                    HStack {
                        HStack {
                            Text("Store Name")
                                .multilineTextAlignment(.center)
                        }
                        .frame(minWidth: 0, maxWidth: .infinity)
                        HStack {
                            Link(storeName!, destination: URL(string: storeURL!)!)
                                .foregroundStyle(.blue)
                        }
                        .frame(minWidth: 0, maxWidth: .infinity)
                    }
                    .listRowSeparator(.hidden)
                }

                if feedbackScore != -1 {
                    ProductDetailShippingTableRow(key: "Feedback Score", value: "\(feedbackScore)")
                }

                if popularity != -1 {
                    ProductDetailShippingTableRow(key: "Popularity", value: "\(popularity)")
                }
            }
        }
    }

    private struct secondSection: View {
        let shippingCost: Float
        let isGlobalShipping: Bool?
        let handlingTime: Int

        var body: some View {
            VStack(spacing: 8) {
                VStack {
                    Divider()
                    HStack {
                        Label("Shipping Info", systemImage: "sailboat")
                            .foregroundColor(.black)
                        Spacer()
                    }
                    Divider()
                }

                if shippingCost != -1 {
                    ProductDetailShippingTableRow(key: "Shipping Cost", value: shippingCost == 0 ? "FREE" : String(format: "$%.2f", shippingCost))
                }

                if isGlobalShipping != nil {
                    ProductDetailShippingTableRow(key: "Global Shipping", value: isGlobalShipping! ? "Yes" : "No")
                }

                if handlingTime != -1 {
                    ProductDetailShippingTableRow(key: "Handling Time", value: String(handlingTime) + (handlingTime == 1 ? " day" : " days"))
                }
            }
        }
    }

    private struct thirdSection: View {
        let policy: String
        let refundMode: String
        let returnWithin: String
        let shippingCostPaidBy: String

        var body: some View {
            VStack(spacing: 8) {
                VStack {
                    Divider()
                    HStack {
                        Label("Return policy", systemImage: "return.left")
                            .foregroundColor(.black)
                        Spacer()
                    }
                    Divider()
                }

                if policy != "" {
                    ProductDetailShippingTableRow(key: "Policy", value: "\(policy)")
                }

                if refundMode != "" {
                    ProductDetailShippingTableRow(key: "Refund Mode", value: "\(refundMode)")
                }

                if returnWithin != "" {
                    ProductDetailShippingTableRow(key: "Refund Within", value: "\(returnWithin)")
                }

                if shippingCostPaidBy != "" {
                    ProductDetailShippingTableRow(key: "Shipping Cost Paid By", value: "\(shippingCostPaidBy)")
                }
            }
        }
    }

    private struct ProductDetailShippingTableRow: View {
        let key: String
        let value: String

        var body: some View {
            HStack {
                HStack {
                    Text(key)
                        .multilineTextAlignment(.center)
                }
                .frame(minWidth: 0, maxWidth: .infinity)
                HStack {
                    Text(value)
                        .multilineTextAlignment(.center)
                }
                .frame(minWidth: 0, maxWidth: .infinity)
            }
        }
    }
}

struct ProductDetailShipping_Previews: PreviewProvider {
    static var previews: some View {
        ProductDetailShipping()
            .environmentObject(ProductDetailsViewModel())
    }
}
