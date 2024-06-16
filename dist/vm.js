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
const util = __importStar(require("util"));
const vm = __importStar(require("vm"));
exports.evaluateCondition = async (condition, context) => {
    core.info(`evaluating condition '${condition}' with context ${util.format(context)}`);
    try {
        vm.createContext(context);
        const container = `(async () => ${condition})()`;
        const result = await vm.runInContext(container, context);
        core.info(`condition '${condition}' ${result ? 'met' : 'unmet'}`);
        return result;
    }
    catch (e) {
        core.error(e);
    }
    return false;
};
