"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fn_1 = require("./fn");
exports.parseContributors = (html) => {
    const str = html.trim();
    const m = /\s*<p.*?>\n[\s\S]*?<\/p>/g.exec(str);
    if (!m) {
        core.warning('contributors html does not match expected pattern!');
        return [];
    }
    const lines = str.split('\n');
    const contributors = lines
        .slice(1, lines.length - 1)
        .map(parseContributor)
        .filter(fn_1.isNonNull);
    return contributors;
};
const parseContributor = (line) => {
    var _a;
    const m = /^\s*<a href="https:\/\/github.com\/(?<contributor>[^"]+)"><img.*?\/><\/a>$/g.exec(line);
    if (!m) {
        core.warning('line did not match expected pattern!');
        return;
    }
    const contributor = (_a = m.groups) === null || _a === void 0 ? void 0 : _a.contributor;
    if (!contributor) {
        core.warning('could not parse contributor from line!');
        return;
    }
    return contributor;
};
exports.generateContributors = (contributors) => {
    const html = contributors.map(generateContributorLine).join('\n');
    return `<p align="center">\n${html}\n</p>`;
};
const generateContributorLine = (contributor) => {
    return `  <a href="https://github.com/${contributor}"><img src="https://github.com/${contributor}.png?size=100" width="50" height="50" /></a>`;
};
