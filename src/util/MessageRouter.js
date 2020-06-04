/**
 * MessageRouter.
 */
export class MessageRouter {
  static sendMessage (action, payload, callback) {
    chrome.runtime.sendMessage({ action, payload }, function (response) {
      if (callback) callback(response)
    })
  }
}
