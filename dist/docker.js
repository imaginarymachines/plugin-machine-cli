"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cli = cli;
var _log = require("./lib/log");
const shell = require('shelljs');
async function cli(args) {
    if (!shell.which('docker')) {
        (0, _log).warning('Docker is not installed');
        (0, _log).info('Install docker: https://docs.docker.com/get-docker/');
        shell.exit(1);
    }
    const command = args[3];
    switch(command){
        case 'kill':
            shell.exec('docker kill $(docker ps -q)');
            (0, _log).info('Killed all docker containers');
            break;
        default:
            break;
    }
}

//# sourceMappingURL=docker.js.map