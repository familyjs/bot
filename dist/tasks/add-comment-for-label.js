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
const github = __importStar(require("@actions/github"));
const github_1 = require("../utils/github");
const run = async (client, options) => {
    const { label } = github.context.payload;
    if (!label) {
        core.warning('no label in event payload');
        return;
    }
    if (options.name === label.name) {
        await github_1.createComment(client, options);
    }
};
exports.default = run;
