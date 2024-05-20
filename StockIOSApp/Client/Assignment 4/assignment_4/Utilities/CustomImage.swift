//
//  CustomImage.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/11/23.
//

import struct Kingfisher.KFImage
import SwiftUI

struct CustomImage: View {
    let width: CGFloat?
    let height: CGFloat?
    let cornerRadius: CGFloat?
    let imageURL: String

    var body: some View {
        KFImage(URL(string: imageURL))
            .placeholder {
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius ?? 0)
                        .fill(Color.white)
                        .frame(width: width, height: height)
                    ProgressView()
                }
            }
            .resizable()
            .frame(width: width, height: height)
            .cornerRadius(cornerRadius ?? 0)
    }
}

#Preview {
    CustomImage(width: 150, height: 150, cornerRadius: 10, imageURL: "https://i.ebayimg.com/thumbs/images/g/BO0AAOSwu~NlHcB0/s-l140.jpg")
}
