//
//  CheckboxView.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/6/23.
//

import SwiftUI

struct CheckboxView: View {
    var title: String
    @Binding var isChecked: Bool

    var body: some View {
        Button(action: {
            isChecked.toggle()
        }) {
            HStack {
                Image(systemName: isChecked ? "checkmark.square.fill" : "square")
                    .foregroundColor(isChecked ? Color(UIColor.systemBlue) : Color.secondary)
                    .onTapGesture {
                        self.isChecked.toggle()
                    }
                Text(title)
                    .foregroundColor(.black)
            }
        }
    }
}
