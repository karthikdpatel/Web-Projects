//
//  File.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/15/24.
//

import Foundation

struct Debouncer {
    let delay: TimeInterval
    private var timer: Timer?

    init(delay: TimeInterval) {
        self.delay = delay
    }

    mutating func run(action: @escaping () -> Void) {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: delay, repeats: false) { _ in
            action()
        }
    }
}
