const {info,error} = require( './log');
const {exitError} = require('./exit');



/**
 * Docker command runners
 *
 * @param {{wpcli:string,phpVersion:string}} opts Optional parameters
 *  @param {string} opts.wpcli Optional. The prefix for the WP CLI command, ending in "wp". Default is "docker-compose run wpcli"
 *  @param {string} opts.phpVersion Optional. The version of PHP to use. Default is "7.4"
 *  @param {string} opts.phpunitCommand Optional. The command to run for PHPUnit. Default is "docker-compose run phpunit"
 */
module.exports = async function({wpcli,phpVersion,phpunitCommand}) {
    wpcli = wpcli || 'docker-compose run wpcli';
    phpVersion = phpVersion || '7.4';
    testsCommand = testsCommand || '`docker-compose run phpunit`';
    if( phpVersion.length > 3 ){
        phpVersion = phpVersion.substring(0,3);
    }
    if( ! ['7.3', '7.4', '8.0', '8.1'].includes(phpVersion) ){
        info(phpVersion);
        exitError('Invalid PHP Version');
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
                //Run command in Docker
                //See: https://github.com/prooph/docker-files/tree/master/composer
                return `docker run --rm -it --volume "$(pwd)":/app prooph/composer:${phpVersion} ${command}`;
            },
            node: async (command) => {
                //@todo, this in Docker
                shell.exec( command );
            },
            //Start the phpunit test container
            startTests: async () => {
                await runCommand(testsCommand);
            },
            //Check docker version
            dockerV,
        }
    } catch (e) {
        error( 'Docker is not installed or is not running.');
        info( 'https://www.docker.com/products/docker-desktop');
        exitError('Please install Docker and try again.')
    }

}
