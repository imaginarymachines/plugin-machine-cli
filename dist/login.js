"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.doLogin = doLogin;
exports.cli = cli;
var _log = require("./lib/log");
const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthConfig , updateAuthConfig  } = require('./lib/config');
function parseArgumentsIntoOptions(rawArgs) {
    //https://www.npmjs.com/package/arg
    const args = arg({
        '--token': String,
        '-c': Boolean
    }, {
        argv: rawArgs.slice(2)
    });
    return {
        token: args['--token'] || false,
        t: args['-t'] || false
    };
}
async function promptForMissingOptions(options) {
    const questions = [];
    if ('string' !== typeof options.token) {
        questions.push({
            type: 'prompt',
            name: 'token',
            message: 'Plugin Machine API token. https://pluginmachine.app/dashboard/api',
            default: ''
        });
    }
    if (questions.length) {
        const answers = await inquirer.prompt(questions);
        return Object.assign(options, answers);
    }
    return options;
}
async function doLogin(token) {
    const config = updateAuthConfig({
        token
    });
    (0, _log).success(`Logged in with token: ${token}`);
}
async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    if (options.c) {
        const config = getAuthConfig();
        (0, _log).info(config);
        return;
    }
    options = await promptForMissingOptions(options);
    doLogin(options.token);
} // ...

//# sourceMappingURL=login.js.map