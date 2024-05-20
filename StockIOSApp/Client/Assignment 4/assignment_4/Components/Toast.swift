//
//  Toast.swift
//  assignment_4
//
//  Created by Sughosh Sudhanvan on 11/9/23.
//

import SwiftUI

struct Toast<Presenting>: View where Presenting: View {
    @Binding var isPresented: Bool
    let presenter: () -> Presenting
    let toastMessage: String
    let delay: TimeInterval = 2

    var body: some View {
        if self.isPresented {
            DispatchQueue.main.asyncAfter(deadline: .now() + self.delay) {
                withAnimation {
                    self.isPresented = false
                }
            }
        }

        return GeometryReader { geometry in
            ZStack(alignment: .bottom) {
                self.presenter()

                ZStack {
                    RoundedRectangle(cornerRadius: 10.0)
                        .fill(Color.black)

                    Text(toastMessage)
                        .foregroundColor(.white)
                }
                .frame(width: geometry.size.width / 1.25, height: geometry.size.height / 10)
                .opacity(self.isPresented ? 1 : 0)
            }
        }
    }
}

extension View {
    func toast(isPresented: Binding<Bool>, toastMessage: String) -> some View {
        Toast(
            isPresented: isPresented,
            presenter: { self },
            toastMessage: toastMessage
        )
    }
}
