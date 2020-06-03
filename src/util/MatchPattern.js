export const MatchPattern = (function() {
    // ultimately, this should match as outlined here:
    // https://developer.chrome.com/extensions/match_patterns
    // this doesn't handle host names exhaustively (i.e. according to
    // the examples there), but it's good enough for now
    //
    // the capturing groups here are designed to match JavaScript's
    // URL components without additional formatting for comparison
    const test = /^(http:|https:|\*:)\/\/([^/]+)(\/.+)$/

    function components (pattern) {
        const results = pattern.match(test)
        if (!results || results.length !== 4) throw new Error('Invalid match pattern')
        return results.slice(1).map(c => convertToRegExp(c))
    }

    // this is more or less a simplified version of the convert2RegExp.js code that's
    // in Greasemonkey, which was originally written by Henrik Aasted Sorensen for Adblock
    function convertToRegExp (pattern) {
        const str = String(pattern)
        let res = ''
        for (let i = 0; i < str.length; i++) {
            switch(str[i]) {
                case '*':
                    // handle globs
                    res += '.*';
                    break;
                case '.':
                case '?':
                case '^':
                case '$':
                case '+':
                case '{':
                case '}':
                case '[':
                case ']':
                case '|':
                case '(':
                case ')':
                case '\\':
                    // escape all other regexp characters
                    res += '\\' + str[i];
                    break;
                case ' ' :
                    // delete spaces
                    break;
                default :
                    // leave everything else untouched
                    res += str[i];
                    break;
            }
        }
        return new RegExp(`^${res}$`, 'i')
    }

    return (pattern) => {
        const [protocol, host, path] = components(pattern)

        return (url) =>
            protocol.test(url.protocol) &&
            host.test(url.hostname) &&
            path.test(url.pathname + url.search)
    }
})()
