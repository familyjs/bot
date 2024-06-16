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
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const github = __importStar(require("@actions/github"));
const fs_extra_1 = require("fs-extra");
const difference_1 = __importDefault(require("lodash/difference"));
const template_1 = __importDefault(require("lodash/fp/template"));
const contributors_1 = require("../utils/contributors");
const markdown_1 = require("../utils/markdown");
const str_1 = require("../utils/str");
const run = async (client, { base = 'master', file = 'README.md', 'commit-message': commitMessage = 'add new contributor(s) to <%= file %>', 'exclude-patterns': excludePatterns = ['\\[bot\\]$'], }) => {
    if (github.context.ref !== `refs/heads/${base}`) {
        core.info(`not processing for ref: ${github.context.ref}`);
        return;
    }
    const { commits } = github.context.payload;
    core.info(`processing commits: ${commits.map((commit) => commit.id).join(', ')}`);
    const excludeAuthorRegexes = excludePatterns.map(p => new RegExp(p));
    core.info(`excluded author regexes: ${excludeAuthorRegexes.join(', ')}`);
    const authorFilter = str_1.createFilterByPatterns(excludeAuthorRegexes);
    const authors = commits
        .map((commit) => commit.author)
        .filter((author) => author.username && !authorFilter(author.username));
    if (authors.length === 0) {
        core.warning(`no authors found for commits!`);
        return;
    }
    const authorUsernames = authors.map((author) => author.username);
    core.info(`authors: ${authorUsernames.join(', ')}`);
    const contents = await fs_extra_1.readFile(file, 'utf8');
    const { sections } = markdown_1.parseMarkdownIntoSections(contents);
    const section = markdown_1.findSectionByLooseTitle(sections, 'contributors');
    if (!section) {
        core.warning(`no contributors section in ${file}`);
        return;
    }
    const startIndex = section.nodes.findIndex(n => n.type === 'html' && n.value === '<!-- CONTRIBUTORS:START -->');
    if (startIndex === -1) {
        core.warning('no contributors:start tag!');
        return;
    }
    const htmlNode = section.nodes[startIndex + 1];
    const contributors = contributors_1.parseContributors(htmlNode.value);
    core.info(`current contributors: ${contributors.length > 0 ? contributors.join(', ') : 'none!'}`);
    const newContributors = difference_1.default(authorUsernames, contributors);
    core.info(`new contributors: ${newContributors.length > 0 ? newContributors.join(', ') : 'none!'}`);
    if (newContributors.length == 0) {
        return;
    }
    const branch = `new-contributors-${newContributors.join('-')}`;
    let output = '';
    await exec.exec('git', ['ls-remote', '--heads', 'origin', branch], {
        listeners: { stdout: data => (output += data.toString()) },
    });
    if (output.trim()) {
        core.warning(`branch ${branch} already exists on remote!`);
        return;
    }
    const allContributors = [...newContributors, ...contributors];
    const { start: { offset: startOffset }, end: { offset: endOffset }, } = htmlNode.position;
    const newContents = str_1.replaceRange(contents, startOffset, endOffset, contributors_1.generateContributors(allContributors));
    const tmpl = template_1.default(commitMessage);
    const message = tmpl({ base, file });
    await fs_extra_1.writeFile(file, newContents);
    await exec.exec('git', ['checkout', '-b', branch]);
    await exec.exec('git', ['add', file]);
    await exec.exec('git', ['commit', '-m', message]);
    await exec.exec('git', ['push', 'origin', branch]);
    await client.pulls.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: commitMessage,
        body: `
It looks like there are new contributors in the \`${base}\` branch!

I've added the following wonderful people to \`${file}\`:
* ${newContributors.join('\n* ')}

Have a great day!
Famibot 💙
`.trim(),
        head: branch,
        base,
    });
};
exports.default = run;
