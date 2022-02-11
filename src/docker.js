const { info,warning } = require( './lib/log');
const docker = require('./lib/docker/docker');
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
    try {
        const dockerApi = await docker.api({});
        const i = 'docker' == args[2] ? 3: 2;
        const service = args[i];
        const command  = args.slice(i).join(' ');
        info(`Running command: ${command} using service: ${
            ['npm', 'yarn'].includes(service) ? 'node' : service
        }`);
        if( ['node','npm', 'yarn'].includes(service) ){
            info( `Using Node version: ${dockerApi.nodeVersion}`);
        }
        if( ['composer'].includes(service) ){
            info( `Using PHP version: ${dockerApi.phpVersion}`);
        }

        switch (service) {
            case 'kill':
                shell.exec('docker kill $(docker ps -q)');
                info('Killed all docker containers');
                break;
            case 'npm':
            case 'yarn':
            case 'node':
                return await dockerApi.node(command);
            case 'composer':
                return await dockerApi.composer(command);
            case 'wp':
                return await dockerApi.wp(command);
            default:
                break;
        }
    } catch (error) {

    }

}
