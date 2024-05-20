//
//  ProductDetailPhotos.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import SwiftUI

struct ProductDetailPhotos: View {
    @EnvironmentObject private var productDetailsVm: ProductDetailsViewModel

    @State private var photos: [String]?

    // Mock Data for viewing preview
    var mockTitle = "NEW *UNOPENED* Apple iPhone 8 Plus 64/256GB Unlocked Smartphone ALL COLORS SF"

    var body: some View {
        VStack {
            if photos == nil {
                ProgressView().id(randomString(length: 10))
            } else {
                VStack {
                    HStack(alignment: .center) {
                        Text("Powered by")
                        Image("google")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 30)
                    }
                    .frame(minWidth: 0, maxWidth: .infinity)

                    ScrollView {
                        ForEach(photos!, id: \.self) { photo in
                            CustomImage(width: 200, height: 200, cornerRadius: 0, imageURL: photo)
                                .frame(maxWidth: .infinity)
                        }
                    }
                }
            }
        }.onAppear {
            let title = productDetailsVm.itemDetails?.title ?? mockTitle

            APIService.instance.callInternalGetAPI(endpoint: "/api/getItemPhotos/\(String(describing: title.addingPercentEncoding(withAllowedCharacters: .alphanumerics)!))", completion: {
                data in

                if data != nil {
                    guard let res: [String] = data?.parseTo() else {
                        print("Cannot parse photos list")
                        return
                    }
                    photos = res
                } else {
                    print("failure")
                }
            })
        }
    }
}

struct ProductDetailPhotos_Previews: PreviewProvider {
    static var previews: some View {
        ProductDetailPhotos()
            .environmentObject(ProductDetailsViewModel())
    }
}
