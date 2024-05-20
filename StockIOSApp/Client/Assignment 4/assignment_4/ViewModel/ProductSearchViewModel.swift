//
//  ProductSearchViewModel.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/6/23.
//

import SwiftUI

class ProductSearchViewModel: ObservableObject {
    @Published var keyword: String = ""
    @Published var category: String = "0"
    @Published var conditionUsed: Bool = false
    @Published var conditionNew: Bool = false
    @Published var conditionUnspecified: Bool = false
    @Published var shippingLocal: Bool = false
    @Published var shippingFree: Bool = false
    @Published var distance: String = ""
    @Published var customLocation: Bool = false
    @Published var isPincodeSuggestionsVisible: Bool = false
    @Published var pincode: String = ""
    @Published var suggestedPincodes: [String] = []
    @Published var showToast: Bool = false
    @Published var toastMessage: String = ""
    @Published var isLoading: Bool = false
    @Published var isPincodeSelected: Bool = false

    init() {}

    func getPincodeSuggestions() {
        guard !pincode.isEmpty else { return }
        if isPincodeSelected {
            return
        }
        suggestedPincodes = []
        isPincodeSuggestionsVisible = true
        APIService.instance.callInternalGetAPI(endpoint: "/api/getPostalcodeSuggestions/\(pincode)", completion: { data in
            if data != nil {
                guard let res: PincodeSuggestions = data?.parseTo() else { return }
                self.suggestedPincodes = res.pincodeSuggestions
                self.isPincodeSelected = true
            } else {
                print("failure")
            }
        })
    }

    func onClearPressed() {
        keyword = ""
        category = "0"
        conditionUsed = false
        conditionNew = false
        conditionUnspecified = false
        shippingLocal = false
        shippingFree = false
        distance = ""
        customLocation = false
        isPincodeSuggestionsVisible = false
        pincode = ""
        suggestedPincodes = []
        isLoading = false
        toastMessage = ""
        showToast = false
        isLoading = false
        isPincodeSelected = false
    }

    func onSearchClicked(onSearchComplete: @escaping (_ details: ItemListData) -> Void) {
        isLoading = true
        if keyword.isEmpty {
            toastMessage = "Keyword is mandatory"
            showToast = true
            isLoading = false
            return
        }
        var parsedPincode = pincode
        if customLocation {
            guard pincode.count == 5 else {
                toastMessage = "Enter a valid zip code"
                showToast = true
                isLoading = false
                return
            }
            completeProductSearch(parsedPincode: parsedPincode, onSearchComplete: onSearchComplete)
        } else {
            APIService.instance.callExternalGetAPI(url: "https://ipinfo.io/json?token=2c5da171bbceb3") { data in
                parsedPincode = data!["postal"].stringValue
                self.completeProductSearch(parsedPincode: parsedPincode, onSearchComplete: onSearchComplete)
            }
        }
    }

    private func completeProductSearch(parsedPincode: String, onSearchComplete: @escaping (_ details: ItemListData) -> Void) {
        var params: [URLQueryItem] = [
            URLQueryItem(name: "keywords", value: keyword),
            URLQueryItem(name: "buyerPincode", value: String(parsedPincode)),
        ]

        if category != "0" {
            params.append(URLQueryItem(name: "category", value: category))
        }

        if distance.count > 0 {
            params.append(URLQueryItem(name: "maxDistance", value: distance))
        } else {
            params.append(URLQueryItem(name: "maxDistance", value: "10"))
        }

        if conditionNew {
            params.append(URLQueryItem(name: "condition", value: "1000"))
        }
        if conditionUsed {
            params.append(URLQueryItem(name: "condition", value: "3000"))
        }

        if shippingFree {
            params.append(URLQueryItem(name: "shippingOption", value: "FREE"))
        }
        if shippingLocal {
            params.append(URLQueryItem(name: "shippingOption", value: "LOCAL"))
        }

        var urlComponents = URLComponents()
        urlComponents.path = "/api/getItems"
        urlComponents.queryItems = params

        let endpoint = urlComponents.url!.absoluteString

        APIService.instance.callInternalGetAPI(endpoint: endpoint, completion: { data in
            if data != nil {
                guard let res: ItemListData = data?.parseTo() else { return }
                self.isLoading = false
                onSearchComplete(res)
            } else {
                self.isLoading = false
                print("failure")
            }
        })
    }
}
