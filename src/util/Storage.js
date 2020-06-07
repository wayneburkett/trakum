/* global chrome */

export class Storage {
  static get (key, callback, _this) {
    chrome.storage.local.get([key], function (items) {
      if (callback) {
        callback.call(_this || this, items && items[key])
      }
    })
  }

  static set (key, val, callback) {
    var obj = {}
    obj[key] = val
    chrome.storage.local.set(obj, callback)
  }
}
