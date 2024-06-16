"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_comment_1 = __importDefault(require("./add-comment"));
const add_comment_for_label_1 = __importDefault(require("./add-comment-for-label"));
const add_contributors_1 = __importDefault(require("./add-contributors"));
const add_label_1 = __importDefault(require("./add-label"));
const add_platform_labels_1 = __importDefault(require("./add-platform-labels"));
const assign_to_project_1 = __importDefault(require("./assign-to-project"));
const remove_label_1 = __importDefault(require("./remove-label"));
exports.runTask = async (client, task) => {
    switch (task.name) {
        case 'add-comment':
            return add_comment_1.default(client, task.config);
        case 'add-comment-for-label':
            return add_comment_for_label_1.default(client, task.config);
        case 'add-label':
            return add_label_1.default(client, task.config);
        case 'remove-label':
            return remove_label_1.default(client, task.config);
        case 'add-platform-labels':
            return add_platform_labels_1.default(client, task.config);
        case 'add-contributors':
            return add_contributors_1.default(client, task.config);
        case 'assign-to-project':
            return assign_to_project_1.default(client, task.config);
        default:
            throw new Error(`Task ${task.name} not found`);
    }
};
exports.createTriggeredBy = (event, type) => (task) => {
    if (typeof task.on === 'string') {
        return task.on === event;
    }
    if (Array.isArray(task.on)) {
        return task.on.some(t => t === event);
    }
    const { [event]: eventConfig } = task.on;
    if (typeof eventConfig === 'undefined') {
        return false;
    }
    if (eventConfig === null) {
        return true;
    }
    if ('types' in eventConfig && eventConfig.types.find(t => t === type)) {
        return true;
    }
    // TODO: branches and tags are not supported yet
    if (event === 'push' || event === 'pull_request') {
        return true;
    }
    return false;
};
