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
const run = async (client, { columns }) => {
    var _a, _b, _c;
    const columnId = getColumnId(columns);
    if (!columnId) {
        throw new Error('No column ID configured.');
    }
    try {
        await client.projects.createCard({
            column_id: columnId,
            content_type: github.context.eventName === 'pull_request' ? 'PullRequest' : 'Issue',
            content_id: (_b = (_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = github.context.payload.issue) === null || _c === void 0 ? void 0 : _c.id,
        });
        core.info(`added issue #${github.context.issue.number} to project column ${columnId}`);
    }
    catch (e) {
        if (e.status === 422) {
            core.warning(`issue #${github.context.issue.number} is already in project`);
        }
        else {
            throw e;
        }
    }
};
const getColumnId = ({ issue, pr, 'draft-pr': draftPR, } = {}) => {
    var _a;
    if (github.context.eventName === 'pull_request') {
        if ((_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.draft) {
            return draftPR;
        }
        else {
            return pr;
        }
    }
    return issue;
};
exports.default = run;
