/* global chrome */

/**
 * MessageRouter.
 */
export class MessageRouter {
  static sendMessage (action, payload, callback) {
    try {
      chrome.runtime.sendMessage({ action, payload }, function (response) {
        if (callback) callback(response)
      })
    } catch (e) {
      console.log(e)
    }
  }

  static sendMessageToTab (tabId, action, payload, callback) {
    try {
      chrome.tabs.sendMessage(tabId, { action, payload }, null, function (response) {
        if (callback) callback(response)
      })
    } catch (e) {
      console.log(e)
    }
  }
}
