/**
 * MessageRouter.
 */
class MessageRouter {
    constructor() { }

    sendMessage(message, callback) {
        chrome.runtime.sendMessage(message, function(response) {
            if (callback) callback(response);
        });
    }

    addListener(action, callback) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === action) {
                callback(request.payload, sender.tab.id);
            }
            sendResponse();
        });
    }
}
