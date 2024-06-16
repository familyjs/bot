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
exports.createComment = async (client, options) => {
    if (options.comment) {
        await client.issues.createComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            body: options.comment,
        });
        core.info(`added comment to issue #${github.context.issue.number}`);
    }
    if (options.close) {
        await client.issues.update({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            state: 'closed',
        });
        core.info(`closed issue #${github.context.issue.number}`);
    }
    if (options.lock) {
        await client.issues.lock({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
        });
        core.info(`locked issue #${github.context.issue.number}`);
    }
};
exports.getTeamMembers = async (client, teamSlug) => {
    const org = github.context.repo.owner;
    const response = await client.request('/orgs/{org}/teams/{teamSlug}/members', {
        org,
        teamSlug,
    });
    return response.data.map((member) => member.login);
};
