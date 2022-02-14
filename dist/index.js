#!/usr/bin/env node
"use strict";
var _hi = _interopRequireDefault(require("./lib/hi"));
var _log = require("./lib/log");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _log).info(process.argv[2]);
switch(process.argv[2]){
    case 'hi':
        (0, _log).info((0, _hi).default(process.argv[2] || 'Roy'));
        break;
    case 'plugin':
        require('./plugin.js').cli(process.argv);
        break;
    case 'login':
        require('./login.js').cli(process.argv);
        break;
    case 'docker':
        require('./docker.js').cli(process.argv);
        break;
    case '-v':
    case 'v':
    case 'version':
        require('./src/version.js').cli(process.argv);
        break;
    default:
        (0, _log).info('DEBUG INFO:');
        require('./src/debug.js').cli(process.argv);
        break;
        break;
}

//# sourceMappingURL=index.js.map