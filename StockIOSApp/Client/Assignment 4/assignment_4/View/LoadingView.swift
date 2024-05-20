//
//  progressView.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/30/24.
//

import Foundation
import SwiftUI

struct LoadingView: View {
    var body: some View {
        VStack {
            Spacer()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                .scaleEffect(2)
            
            Text("Fetching Data...")
                .font(.title3)
                .foregroundColor(.gray)
                .padding()
            Spacer()
        }
    }
}

#Preview {
    LoadingView()
}
