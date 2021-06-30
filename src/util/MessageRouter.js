/* global chrome */

/**
 * MessageRouter.
 */
export class MessageRouter {
  /**
   * Sends a single message to any event listeners within the extension.
   *
   * @access public
   */
  static sendMessage (action, payload, callback) {
    try {
      chrome.runtime.sendMessage({ action, payload }, function (response) {
        if (callback) callback(response)
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Sends a single message to the content scripts in the specified tab.
   *
   * @access public
   */
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
