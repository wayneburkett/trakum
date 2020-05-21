const messenger = new MessageRouter();
messenger.addListener('UPDATE_COUNT', (payload, tabId) => {
  chrome.browserAction.setBadgeText({
    text: (payload.length > 0 ? String(payload.length) : ''),
    tabId
  });
});
