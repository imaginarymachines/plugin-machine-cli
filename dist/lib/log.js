"use strict";
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
const important = (message)=>log(_chalk.default.yellow(maybeStringify(message)))
;
const warning = important;
const info = (message)=>log(_chalk.default.blue(maybeStringify(message)))
;
const success = (message)=>log(_chalk.default.green(maybeStringify(message)))
;
module.exports = {
    error,
    important,
    warning,
    info,
    success
};

//# sourceMappingURL=log.js.map