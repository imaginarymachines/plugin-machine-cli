"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cli = cli;
const { info  } = require('./lib/log');
async function cli(args) {
    const packageJson = require(require('path').join(__dirname, '../package.json'));
    info(`Current version: ${packageJson.version}`);
}

//# sourceMappingURL=version.js.map