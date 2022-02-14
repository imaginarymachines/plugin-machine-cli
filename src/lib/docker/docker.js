import {info,error} from  '../log';
import {exitError} from './exit'
import shell from   'shelljs'
/**
 * Run a command
 *
 * @param {string} command The command to run
 */
 const runCommand = async (command) => {
    return new Promise( async (resolve, reject) => {
        if (shell.exec(command).code !== 0) {
            reject();
        }else{
            resolve();
        }
    });
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
export const api = async (opts) => {
    let args = Object.assign(
        {
            wpcli:'docker-compose run wpcli',
            phpVersion:'7.4',
            nodeVersion: 16,
            phpunitCommand: `docker-compose run phpunit`,
        },
        opts
    );
    let {wpcli,phpVersion,nodeVersion,phpunitCommand} = args;
    if( phpVersion.length > 3 ){
        phpVersion = phpVersion.substring(0,3);
    }
    if( ! ['7.3', '7.4', '8.0', '8.1'].includes(phpVersion) ){
        info(phpVersion);
        exitError({errorMessage:`${phpVersion} is not a supported PHP version.`});
    }
    if( nodeVersion.length > 2 ){
        nodeVersion = nodeVersion.substring(0,2);
    }
    let nodeVersions = ['12','14','16','17'];
    if(! [...nodeVersions, ...nodeVersions.map( v => parseInt(v,10) )].includes(nodeVersion) ){
        info(nodeVersion);
        exitError({errorMessage:`${nodeVersion} is not a supported Node version.`});
    }

    //Util function to check Docker version.
    const dockerV = async () => {
        return runCommand(`docker version --format '{{.Server.Version}}'`);
    }
    try {
        info('Checking Docker version...');
        //Check if docker is installed and running
        await dockerV();
        //If so, return API
        return {
            //Run a WP CLI command in Docker containr
            wp: async (command) => {
                //Prefix with wp if needed.
                if( ! command.startsWith( 'wp') ){
                    command = `${command} wp `;
                }
                command = `${wpcli} ${command}`
                return runCommand(command);
            },
            //Run a composer command in Docker container
            composer: async (command) => {
                if( command.startsWith( 'composer') ){
                    //remove "composer" from command
                    command = command.substring('composer'.length);
                }
                //See: https://github.com/prooph/docker-files/tree/master/composer
                //Removed -it flag to make it work.
                return runCommand(`docker run --rm  --volume "$(pwd)":/app prooph/composer:${phpVersion} ${command}`);
            },
            node: async (command) => {
                //See: https://gist.github.com/ArtemGordinsky/b79ea473e8bc6f67943b
                command = `docker run -v "$PWD":/usr/src/app -w /usr/src/app node:${nodeVersion}-alpine sh -c '${command}'`;
                return runCommand( command );
            },
            //Start the phpunit test container
            testWp: async () => {
                await runCommand(phpunitCommand);
            },
            //Check docker version
            dockerV,
            //Kill all running containers on the host
            kill: async () => {
                await runCommand("docker kill $(docker ps -q)");
            },
            args
        }
    } catch (e) {
        error( 'Docker is not installed or is not running.');
        info( 'https://www.docker.com/products/docker-desktop');
        exitError('Please install Docker and try again.')
    }
}
