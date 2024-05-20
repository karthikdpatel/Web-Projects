//
//  ProductSearchView.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/6/23.
//

import SwiftUI

struct ProductSearchView: View {
    @EnvironmentObject private var productSearchVm: ProductSearchViewModel

    let onItemListLoaded: (_ list: [ItemListItemData]) -> Void
    let onClearData: () -> Void

    var body: some View {
        HStack {
            Text("Keyword:")
            TextField("Required", text: $productSearchVm.keyword)
                .autocorrectionDisabled()
        }
        Picker(selection: $productSearchVm.category, label: Text("Category")) {
            Text("All").tag("0")
            Text("Art").tag("550")
            Text("Baby").tag("2984")
            Text("Books").tag("267")
            Text("Clothing,Shoes & Accessories").tag("11450")
            Text("Computer/Tablets & Networking").tag("58058")
            Text("Health & Beauty").tag("26395")
            Text("Music").tag("11233")
            Text("Video Games & Consoles").tag("1249")
        }
        .pickerStyle(MenuPickerStyle())
        VStack {
            HStack {
                Text("Condition")
                Spacer()
            }
            .padding(.bottom, 3.0)
            HStack {
                CheckboxView(title: "Used", isChecked: $productSearchVm.conditionUsed)
                CheckboxView(title: "New", isChecked: $productSearchVm.conditionNew)
                CheckboxView(title: "Unspecified", isChecked: $productSearchVm.conditionUnspecified)
            }
        }
        VStack {
            HStack {
                Text("Shipping")
                Spacer()
            }
            .padding(.bottom, 3.0)
            HStack {
                CheckboxView(title: "Pickup", isChecked: $productSearchVm.shippingLocal)
                CheckboxView(title: "Free Shipping", isChecked: $productSearchVm.shippingFree)
            }
        }
        HStack {
            Text("Distance:")
            TextField("10", text: $productSearchVm.distance)
                .keyboardType(.numberPad)
                .autocorrectionDisabled()
        }
        HStack {
            Text("Custom Location")
            Toggle(isOn: $productSearchVm.customLocation) {}
        }
        if productSearchVm.customLocation {
            HStack {
                Text("Zipcode:")
                TextField("Required", text: $productSearchVm.pincode)
                    .onChange(of: productSearchVm.pincode) {
                        _, newValue in
                        if newValue.count != 5 {
                            productSearchVm.isPincodeSelected = false
                        }
                    }
                    .onSubmit {
                        productSearchVm.getPincodeSuggestions()
                    }
                    .keyboardType(.numberPad)
                    .autocorrectionDisabled()
            }
        }
        HStack {
            Spacer()
            Button("Submit") {
                productSearchVm.onSearchClicked {
                    details in
                    onItemListLoaded(details.items)
                }
            }
            .buttonStyle(CustomButton())
            Spacer()
            Button("Clear") {
                productSearchVm.onClearPressed()
                onClearData()
            }
            .buttonStyle(CustomButton())
            Spacer()
        }
    }
}

struct ProductSearchViews_Previews: PreviewProvider {
    static var previews: some View {
        ProductSearchView(onItemListLoaded: { _ in }, onClearData: {}).environmentObject(ProductSearchViewModel())
    }
}
