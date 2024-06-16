"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = __importStar(require("js-yaml"));
const client_1 = require("./client");
exports.getConfig = async (client, configPath) => {
    const contents = await client_1.getFileFromRepo(client, configPath);
    const config = yaml.safeLoad(contents);
    // TODO: check config structure
    return config;
};
