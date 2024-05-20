//
//  ToastView.swift
//  assignment_4
//
//  Created by Karthik Patel on 5/1/24.
//

import Foundation
import SwiftUI

struct ToastView: View {
    let toastMessage: String
    var body: some View {
        VStack {
            Spacer()
            Text(toastMessage)
                .padding(30)
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(100)
                .shadow(radius: 10)
        }
    }
}

#Preview {
    ToastView(toastMessage: "Adding AAPL to Favorites")
}
