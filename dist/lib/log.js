"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.success = exports.info = exports.warning = exports.important = exports.error = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const log = console.log;
const maybeStringify = (obj)=>{
    if ('string' == typeof obj) {
        return obj;
    }
    return JSON.stringify(obj, null, 2);
};
const error = (message)=>log(_chalk.default.green(maybeStringify(message)))
;
exports.error = error;
const important = (message)=>log(_chalk.default.yellow(maybeStringify(message)))
;
exports.important = important;
const warning = important;
exports.warning = warning;
const info = (message)=>log(_chalk.default.blue(maybeStringify(message)))
;
exports.info = info;
const success = (message)=>log(_chalk.default.green(maybeStringify(message)))
;
exports.success = success;

//# sourceMappingURL=log.js.map