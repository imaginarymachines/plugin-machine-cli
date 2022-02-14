#!/usr/bin/env node
"use strict";
var _hi = _interopRequireDefault(require("./lib/hi"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
console.log((0, _hi).default(process.argv[2]));
console.log('Hello World!');

//# sourceMappingURL=index.js.map