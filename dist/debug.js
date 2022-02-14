"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cli = cli;
var _log = require("./lib/log");
async function cli(args) {
    const packageJson = require(require('path').join(__dirname, '../package.json'));
    (0, _log).info({
        info: {
            version: packageJson.version,
            cwd: require('process').cwd(),
            homedir: require('os').homedir()
        },
        debug: {}
    });
}

//# sourceMappingURL=debug.js.map