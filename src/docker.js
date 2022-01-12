import { info,warning } from './lib/log';
const shell = require('shelljs');



/**
 * Hander for `plugin-machine docker` commands
 */
 export async function cli(args) {
    if (!shell.which('docker')) {
        warning('Docker is not installed');
        info('Install docker: https://docs.docker.com/get-docker/');
        shell.exit(1);
    }
    const command = args[3];
    switch (command) {
        case 'kill':
            shell.exec('docker kill $(docker ps -q)');
            info('Killed all docker containers');
            break;
        default:
            break;
    }
}
