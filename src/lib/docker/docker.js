const {info,error} = require( '../log');
const {exitError} = require('./exit');
const shell =   require('shelljs');
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
module.exports = {
    api: async(opts) => {
        let {wpcli,phpVersion,nodeVersion,phpunitCommand} = Object.assign(
            {
                wpcli:'docker-compose run wpcli',
                phpVersion:'7.4',
                nodeVersion: 16,
                phpunitCommand: `docker-compose run phpunit`,

            },
            opts
        );

        if( phpVersion.length > 3 ){
            phpVersion = phpVersion.substring(0,3);
        }
        if( ! ['7.3', '7.4', '8.0', '8.1'].includes(phpVersion) ){
            info(phpVersion);
            exitError('Invalid PHP Version');
        }
        if( nodeVersion.length > 2 ){
            nodeVersion = nodeVersion.substring(0,2);
        }
        if(! ['17', '16', '14', '12'].includes(nodeVersion) ){
            info(nodeVersion);
            exitError('Invalid Node Version');
        }

        //Util function to check Docker version.
        const dockerV = async () => {
            return runCommand(`docker version`);
        }
        try {
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
                    return runCommand(`docker run --rm -it --volume "$(pwd)":/app prooph/composer:${phpVersion} ${command}`);
                },
                node: async (command) => {
                    //See: https://gist.github.com/ArtemGordinsky/b79ea473e8bc6f67943b
                    command = `docker run -v "$PWD":/usr/src/app -w /usr/src/app node:${nodeVersion}-alpine sh -c '${command}'`;
                    return runCommand( command );
                },
                //Start the phpunit test container
                startWpTests: async () => {
                    await runCommand(testsCommand);
                },
                //Check docker version
                dockerV,
                //Kill all running containers on the host
                kill: async () => {
                    await runCommand("docker kill $(docker ps -q)");
                }
            }
        } catch (e) {
            error( 'Docker is not installed or is not running.');
            info( 'https://www.docker.com/products/docker-desktop');
            exitError('Please install Docker and try again.')
        }
    }
};
