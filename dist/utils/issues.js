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
const intersection_1 = __importDefault(require("lodash/fp/intersection"));
exports.getPlatforms = (nodes) => {
    const platforms = [];
    for (const node of nodes) {
        try {
            if (node.type === 'list') {
                const textEntries = node.children.map((n) => n.children[0].children[0].value.trim().toLowerCase());
                platforms.push(...intersection_1.default(exports.PLATFORMS, textEntries));
            }
            else if (node.type === 'paragraph') {
                const text = node.children[0].value.toLowerCase();
                for (const platform of exports.PLATFORMS) {
                    if (text.includes(platform)) {
                        platforms.push(platform);
                    }
                }
            }
        }
        catch (e) {
            core.debug(e.message);
        }
    }
    return platforms;
};
exports.PLATFORMS = ['android', 'ios', 'electron', 'web'];
