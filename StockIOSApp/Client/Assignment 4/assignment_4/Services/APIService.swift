//
//  APIServices.swift
//  assignment_4
//
//  Created by Karthik Patel on 4/12/24.
//

import Alamofire
import Foundation
import SwiftyJSON

class APIService {
    static let instance = APIService()

    func callInternalGetAPI(endpoint: String, completion: @escaping APICompletionHandler) {
        URLCache.shared = URLCache(memoryCapacity: 0, diskCapacity: 0, diskPath: nil)
        Alamofire.request("\(BASE_URL)\(endpoint)", method: .get, encoding: JSONEncoding.default).responseJSON {
            response in

            if response.result.error == nil {
                do {
                    guard let data = response.data else { return }
                    let json = try JSON(data: data)
                    completion(json)
                } catch {
                    completion(nil)
                }
            } else {
                completion(nil)
                print(response.result.error as Any)
            }
        }
    }

    func callExternalGetAPI(url: String, completion: @escaping APICompletionHandler) {
        Alamofire.request("\(url)", method: .get, encoding: JSONEncoding.default).responseJSON {
            response in

            if response.result.error == nil {
                do {
                    guard let data = response.data else { return }
                    let json = try JSON(data: data)
                    completion(json)
                } catch {
                    completion(nil)
                }
            } else {
                completion(nil)
                print(response.result.error as Any)
            }
        }
    }
}

extension JSON {
    func parseTo<T: Codable>() -> T? {
        guard let data = try? rawData(options: .prettyPrinted) else {
            return nil
        }
        let decoder = JSONDecoder()
        return try? decoder.decode(T.self, from: data)
    }
}
