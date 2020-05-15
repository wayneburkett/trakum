// MarkAsRead
// v0.1
// Copyright (c) 2008, Wayne Burkett
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html

// ==UserScript==
// @name          MarkAsRead
// @namespace     http://dionidium.com/projects/greasemonkey/
// @description   Mark previously-read Hacker News comments
// @include       http://news.ycombinator.com/item?id=*
// ==/UserScript==

// change this if you hate the hideous green border
function markElement(el) {
    el.style.border = "1px solid green";
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

// brittle hn-specific stuff
function getID(comment) {
    var root = comment.parentNode.parentNode;
    var link = root.getElementsByTagName('a')[0];
    return link.id.split('_')[1];
}

function getComments(cache) {
    var comments = document.evaluate("//span[@class='comment']", document, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    var res = [];
    for (var i = 0; i < comments.snapshotLength; i++) {
        var element = comments.snapshotItem(i);
        var id = getID(element);
        if (cache[id]) {
            element.seen = true;
            markElement(element);
        }
        res.push([element, getY(element), id])
    }
    return res;
}

function getCurrQueryStr() {
    return document.location.href.split('?')[1];
}

function saveMarked(comments) {
    GM_setValue(getCurrQueryStr(), comments.filter(function(el) { return el[0].seen })
        .map(function(el) { return el[2] }).toString());
}

function getPreviouslyMarked() {
    var seen = {};
    var ids = GM_getValue(getCurrQueryStr(), '').split(',');
    for (var i = 0; i < ids.length; i++)
        seen[ids[i]] = true;
    return seen;
}

window.addEventListener('load', function() {
    var cache = getPreviouslyMarked();
    var comments = getComments(cache);
    document.addEventListener('scroll', createOnPause(1500, function() {
        markCurrent(comments);
        saveMarked(comments);
    }), false);
}, false);

// 2008-12-12 - 0.1 - released
