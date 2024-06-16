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
const issues_1 = require("../utils/issues");
const markdown_1 = require("../utils/markdown");
const run = async (client, config) => {
    const { issue } = github.context.payload;
    if (!issue || !issue.body) {
        core.warning('no issue body in event payload');
        return;
    }
    const { sections } = markdown_1.parseMarkdownIntoSections(issue.body);
    const section = markdown_1.findSectionByLooseTitle(sections, 'platform');
    if (!section) {
        core.warning('no platform section in issue body');
        return;
    }
    const platforms = issues_1.getPlatforms(section.nodes);
    const labels = platforms.map(platform => `platform: ${platform}`);
    await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        labels,
    });
    core.info(`added ${labels.join(', ')} labels to issue #${github.context.issue.number}`);
};
exports.default = run;
