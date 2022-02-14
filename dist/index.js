#!/usr/bin/env node
"use strict";
var _hi = _interopRequireDefault(require("./lib/hi"));
var _log = require("./lib/log");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
console.log((0, _hi).default(process.argv[2] || 'Roy'));
(0, _log).info((0, _hi).default(process.argv[2] || 'Roy'));

//# sourceMappingURL=index.js.map