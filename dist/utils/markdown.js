"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const remark_1 = __importDefault(require("remark"));
exports.parseMarkdownIntoSections = (markdown) => {
    const nodes = exports.parseMarkdown(markdown);
    const sections = [];
    for (const node of nodes) {
        if (node.type === 'heading') {
            sections.push({
                title: node.children[0].value,
                nodes: getSectionNodes(node, nodes),
            });
        }
    }
    return { sections };
};
exports.findSectionByLooseTitle = (sections, title) => {
    return sections.find(section => section.title.toLowerCase().includes(title.toLowerCase()));
};
exports.parseMarkdown = (markdown) => {
    const lexer = remark_1.default();
    const nodes = lexer.parse(markdown).children;
    return nodes;
};
const getSectionNodes = (header, nodes) => {
    const section = [header];
    const idx = nodes.indexOf(header);
    for (let i = idx + 1; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type === 'heading') {
            break;
        }
        section.push(node);
    }
    return section;
};
