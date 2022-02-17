import {info,error} from  '../log';
import {exitError,exitSuccess} from './exit';
//@ts-ignore
import shell from   'shelljs'
/**
 * Run a command
 *
 * @param {string} command The command to run
 */
 const runCommand = async (command:string):Promise<void> => {
    return new Promise( async (resolve, reject) => {
        if (shell.exec(command).code !== 0) {
            reject();
        }else{
            resolve();
        }
    });
}

type PHP_VERSIONS = '7.3'| '7.4'|'8.0'|'8.1';
type NODE_VERSIONS = '12'| '14'|'16'|'17';
export interface I_DockerApiOpts {
    pluginDir:string;
    wpcli?:string,
    phpVersion?:PHP_VERSIONS;
    nodeVersion?:NODE_VERSIONS;
    phpunitCommand?: 'docker-compose run phpunit',
}

export interface I_DockerApi {
    wp:  (command:string) => Promise<void>,
    composer:  (command:string) => Promise<void>,
    run:  (command:string)=> Promise<void>,
    node:  (command:string) => Promise<void>,
    testWp: () => Promise<void>,
    dockerV:()  => Promise<void>,
    kill:() => Promise<void>,
    opts: I_DockerApiOpts,
}

/**
 * Docker command runners
 *
 * @param {{wpcli:string,phpVersion:string}} opts Optional parameters
 *  @param {string} opts.wpcli Optional. The prefix for the WP CLI command, ending in "wp". Default is "docker-compose run wpcli"
 *  @param {string} opts.phpVersion Optional. The version of PHP to use. Default is "7.4". MUST be 3 characters long.
 *  @param {string}opts.nodeVersion Optional. The version of Node to use. Default is "17". MUST be 2 characters long.
 *  @param {string} opts.phpunitCommand Optional. The command to run for PHPUnit. Default is "docker-compose run phpunit"
 */
export const createDockerApi = async (opts:I_DockerApiOpts): Promise<I_DockerApi> => {
    const args : I_DockerApiOpts = Object.assign(
        {
            wpcli:'docker-compose run wpcli',
            phpVersion:'7.4',
            nodeVersion: 16,
            phpunitCommand: 'docker-compose run phpunit',
        },
        opts
    );
    let {wpcli,phpVersion,nodeVersion,phpunitCommand,pluginDir} = args;
    if( phpVersion && phpVersion.length > 3 ){
        phpVersion = phpVersion.substring(0,3)as PHP_VERSIONS;
    }
    if( phpVersion && ! ['7.3', '7.4', '8.0', '8.1'].includes(phpVersion) ){
        info(phpVersion);
        exitError({errorMessage:`${phpVersion} is not a supported PHP version.`});
    }
    if( nodeVersion && nodeVersion.length > 2 ){
        nodeVersion = nodeVersion.substring(0,2) as NODE_VERSIONS;
    }
    const nodeVersions = ['12','14','16','17'];
    if(nodeVersion && ! [...nodeVersions, ...nodeVersions.map( v => parseInt(v,10) )].includes(nodeVersion) ){
        info(nodeVersion);
        exitError({errorMessage:`${nodeVersion} is not a supported Node version.`});
    }

    //Util function to check Docker version.
    const dockerV = async () => {
        return runCommand('docker version --format \'{{.Server.Version}}\'');
    }

    //Run a composer command in Docker container
    const composer = async (command:string) => {
        if( command.startsWith( 'composer') ){
            //remove "composer" from command
            command = command.substring('composer'.length);
        }
        //See: https://github.com/prooph/docker-files/tree/master/composer
        //Removed -it flag to make it work.
        command = `docker run --rm  --volume ${pluginDir}:/app prooph/composer:${phpVersion} ${command}`;
        info( `Running composer command: ${command}`);
        return runCommand(command);
    };

    //Run a WP CLI command in Docker containr
    const wp = async (command:string) => {
        //Prefix with wp if needed.
        if( ! command.startsWith( 'wp') ){
            command = `${command} wp `;
        }
        command = `${wpcli} ${command}`
        return runCommand(command);
    };

    //Run a Node command in Docker container
    const node = async (command:string) => {
        //See: https://gist.github.com/ArtemGordinsky/b79ea473e8bc6f67943b
        command = `docker run -v ${pluginDir}:/usr/src/app -w /usr/src/app node:${nodeVersion}-alpine sh -c '${command}'`;
        info( `Running node command: ${command}`);
        return runCommand( command );
    };
    try {
        info('Checking Docker version...');
        //Check if docker is installed and running
        await dockerV();
        //If so, return API
        const api : I_DockerApi = {
            run: async (command:string) => {
                if(
                    command.startsWith('npm')
                    || command.startsWith('yarn')
                    || command.startsWith('node')
                ){
                    await node(command).catch(exitError).then(() => () => exitSuccess({}));

                }
                if(command.startsWith('composer')){
                    await composer(command).catch(exitError).then(() => exitSuccess({}));
                }
                if( command.startsWith('wp')){
                    await wp(command)
                }
                throw new Error('Command not supported.');
            },
            wp,
            //Run a composer command in Docker container
            composer,
            node,
            //Start the phpunit test container
            testWp: async () => {
                //@ts-ignore
                await runCommand(phpunitCommand);
            },
            //Check docker version
            dockerV,
            //Kill all running containers on the host
            kill: async () => {
                await runCommand('docker kill $(docker ps -q)');
            },
            opts:args
        };
        return api;
    } catch (e:any) {
        error( 'Docker is not installed or is not running.');
        info( 'https://www.docker.com/products/docker-desktop');
        exitError({errorMessage:e.message?e.message:'Please install Docker and try again.'});
        throw new Error();
    }
}
