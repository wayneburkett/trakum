/* global chrome */

/**
 * MessageRouter.
 */
export class MessageRouter {
  static sendMessage (action, payload, callback) {
    chrome.runtime.sendMessage({ action, payload }, function (response) {
      if (callback) callback(response)
    })
  }

  static sendMessageToTab (tabId, action, payload, callback) {
    chrome.tabs.sendMessage(tabId, { action, payload }, null, function (response) {
      if (callback) callback(response)
    })
  }
}
