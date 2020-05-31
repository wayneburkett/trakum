const MATCH_PATTERNS = [
    {
        pattern: "https://news.ycombinator.com/item?id=*",
        query: "//div[@class='comment']",
    },
    {
        pattern: "https://www.doctorofcredit.com/best-bank-account-bonuses/",
        query: "//ul[@class='toc_list']/li/ul/li",
        dry: false
    }
];

chrome.runtime.onMessage.addListener((message, sender, response) => {
    const { action, payload } = message;
    const { tabId } = sender.tab;
    switch (action) {
        case 'UPDATE_COUNT':
            setBadgeText(tabId, payload.length);
            response({});
            break;
        case 'GET_MATCH_PATTERNS':
            response(MATCH_PATTERNS);
            break;
        default:
            response('unknown request');
            break;
    }
});

function setBadgeText(tabId, val) {
  chrome.browserAction.setBadgeText({
    text: (val > 0 ? String(val.length) : ''),
    tabId
  });
}
