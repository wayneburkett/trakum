/* global chrome */

export class Storage {
  static get (key, callback, _this) {
    try {
      chrome.storage.local.get([key], function (result) {
        if (callback) {
          callback.call(_this || this, result && result[key])
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  static set (key, val, callback) {
    try {
      chrome.storage.local.set({ [key]: val }, callback)
    } catch (e) {
      console.log(e)
    }
  }
}
