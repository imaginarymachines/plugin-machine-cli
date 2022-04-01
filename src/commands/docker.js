import {createDockerApi,makeDockerArgs} from '../lib/docker/docker';
import shell from 'shelljs';
import {
    info,
    warning
} from '../lib/log';
import {getPluginDir,getPluginMachineJson}from '../lib/config';




/**
 * Hander for `plugin-machine docker` commands
 */
 export async function cli(args) {

    const pluginDir = getPluginDir();
    const pluginMachineJson = getPluginMachineJson(pluginDir);
    const dockerApi = await createDockerApi(
        makeDockerArgs(pluginDir,pluginMachineJson)
    ).catch(err => console.log(err)).then(api => api);
    const i = 'docker' == args[2] ? 3: 2;
    const service = args[i];
    const command  = args.slice(i).join(' ');
    info(`Running command: ${command} using service: ${
        ['npm', 'yarn'].includes(service) ? 'node' : service
    }`);


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
        case 'test:wordpress':
            return await dockerApi.testWp();
        default:
            break;
    }


}
