"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const memoize_1 = __importDefault(require("lodash/fp/memoize"));
exports.getClient = memoize_1.default((repoToken) => github.getOctokit(repoToken));
exports.getFileFromRepo = async (client, path) => {
    try {
        const res = await client.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path,
            ref: github.context.sha,
        });
        const { content, encoding } = res.data;
        return Buffer.from(content, encoding).toString();
    }
    catch (e) {
        throw new Error(`error with ${path}: ${e.message}`);
    }
};
