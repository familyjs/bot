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
const github = __importStar(require("@actions/github"));
const sortBy_1 = __importDefault(require("lodash/fp/sortBy"));
const run = async (client, { label, 'exclude-labeler': excludeLabeler = true }) => {
    try {
        if (excludeLabeler) {
            let page = 1;
            const data = [];
            while (true) {
                const res = await client.issues.listEventsForTimeline({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: github.context.issue.number,
                    per_page: 100,
                    page,
                });
                if (res.data.length === 0) {
                    break;
                }
                data.push(...res.data);
                page++;
            }
            // TODO: There doesn't seem to be a way to sort the timeline from the API.
            // Is there a better way?
            const events = sortBy_1.default(entry => entry.created_at, data).reverse();
            const lastLabel = events.find((event) => event.event === 'labeled' && event.label.name === label);
            if (!lastLabel) {
                core.warning(`${label} label did not appear in timeline for issue #${github.context.issue.number}`);
                return;
            }
            if (lastLabel.actor.login === github.context.actor) {
                core.info(`not removing ${label} label for action by user who added it`);
                return;
            }
        }
        await client.issues.removeLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.issue.number,
            name: label,
        });
        core.info(`removed ${label} label from issue #${github.context.issue.number}`);
    }
    catch (e) {
        core.warning(e.message);
    }
};
exports.default = run;
