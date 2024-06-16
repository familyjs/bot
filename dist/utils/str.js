"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRange = (str, start, end, replacement) => {
    return str.substring(0, start) + replacement + str.substring(end);
};
exports.createFilterByPatterns = (regexes) => (s) => regexes.some(re => re.test(s));
