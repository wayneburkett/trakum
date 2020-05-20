
function markElement(el) {
    el.classList.remove('trakum_new')
    el.classList.add('trakum_seen')
}

function getViewportHeight() {
    return Math.min(document.documentElement.clientHeight, document.body.clientHeight)
}

function getScrollTop() {
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

function getCurrentCoverage() {
    var _top = getScrollTop();
    return { "top": _top, "bottom": _top + getViewportHeight() };
}

function getOffset(el) {
    var left = 0, top = 0;
    while (el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return [left, top];
}

function getY(el) {
    return getOffset(el)[1];
}

// execute callback only after a pause in user input; the function returned
// can be used to handle an event type that tightly repeats (such as typing
// or scrolling events); it will execute the callback only if the given timout
// period has passed since the last time the same event fired
function createOnPause(timeout, callback) {
    return function(e) {
        if (arguments.callee.timer)
            clearTimeout(arguments.callee.timer);
        arguments.callee.timer = setTimeout(callback, timeout);
    }
}

// mark all comments currently scrolled into view
function markCurrent(comments) {
    var coverage = getCurrentCoverage();
    for (var i = 0; i < comments.length && comments[i][1] <= coverage.bottom; i++) {
        var curr = comments[i];
        if (curr[1] >= coverage.top && !curr[0].seen) {
            curr[0].seen = true;
            markElement(curr[0]);
        }
    }
}

function processElementNode(element, cache) {
    var id = md5(element.textContent);
    if (cache[id]) {
        element.seen = true;
        markElement(element);
    } else {
        element.classList.add('trakum_new');
    }
    element.classList.add('trakum_element')
    return [element, getY(element), id];
}

function getComments(query, cache) {
    var comments = document.evaluate(query, document, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var res = [];
    for (var i = 0; i < comments.snapshotLength; i++) {
        var processedNode = null;
        var node = comments.snapshotItem(i);
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                processedNode = processElementNode(node, cache);
                break;
            default:
                // we can and probably should process other node types, but
                // it's only elements for now
                break;
        }
        if (processedNode) {
            res.push(processedNode);
        }
    }
    return res;
}

function getCurrQueryStr() {
    return document.location.href.split('?')[1];
}

function saveMarked(page, comments) {
    if (page.dry) {
        return;
    }
    setValue(getCurrQueryStr(), comments
        .filter(([element]) => element.seen)
        .map(([,,id]) => id)
        .toString())
}

function getPreviouslyMarked(page, callback) {
    if (page.dry) {
        return callback({});
    }
    getValue(getCurrQueryStr(), function(items) {
        var seen = {};
        var ids = (items || '').split(',');
        for (var i = 0; i < ids.length; i++) {
            seen[ids[i]] = true;
        }
        callback(seen);
    });
}

function getValue(key, callback, _this) {
    chrome.storage.local.get([key], function(items) {
        if (callback) {
            callback.call(_this || this, items && items[key]);
        }
    });
};

function setValue(key, val, callback) {
    var obj = {};
    obj[key] = val;
    chrome.storage.local.set(obj, callback);
};

const MATCH_PATTERNS = [
    {
        pattern: "https://news.ycombinator.com/item?id=*",
        query: "//div[@class='comment']",
    },
    {
        pattern: "https://www.doctorofcredit.com/best-bank-account-bonuses/",
        query: "//ul[@class='toc_list']/li/ul/li/a/text()",
        dry: true
    }
]

function getMatches(url) {
    return MATCH_PATTERNS.filter(item => MatchPattern(item.pattern)(url))
}

window.addEventListener('load', function() {
    getMatches(window.location).forEach((page) => {
        getPreviouslyMarked(page, function(cache) {
            var comments = getComments(page.query, cache);
            document.addEventListener('scroll', createOnPause(1500, function() {
                markCurrent(comments);
                saveMarked(page, comments);
            }), false);
        });
    })
}, false);

// 2020-05-14 - 0.2 - convert to a chrome extension
// 2008-12-12 - 0.1 - released
