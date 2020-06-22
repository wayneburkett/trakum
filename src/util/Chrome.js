/* global chrome */

export function addListener (callback) {
  if (!chrome.runtime) return
  chrome.runtime.onMessage.addListener(callback)
}

export function setBadgeText (tabId, val) {
  if (!chrome.browserAction) return
  chrome.browserAction.setBadgeText({
    text: (val > 0 ? String(val) : ''),
    tabId
  })
}

export function getCurrentTab (callback) {
  if (!chrome.tabs) return
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => callback(tab))
}

export function getPopup () {
  if (!chrome.extension) return
  return chrome.extension.getViews({ type: 'popup' })[0]
}

export function openUrl (url) {
  if (!chrome.tabs) return
  chrome.tabs.create({ url })
}

export function addPageContextMenu (title, callback) {
  if (!chrome.contextMenus) return
  chrome.contextMenus.create({
    title: title,
    contexts: ['page'],
    onclick: callback
  })
}
