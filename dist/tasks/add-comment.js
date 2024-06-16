"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("../utils/github");
const run = async (client, options) => {
    await github_1.createComment(client, options);
};
exports.default = run;
