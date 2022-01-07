import { info } from './lib/log';

/**
 * Hander for `plugin-machine debug` commands
 */
 export async function cli(args) {
    const packageJson = require(
        require('path').join(__dirname, '../package.json')
    );
    info(
        {
            info:{
                version:packageJson.version,
                cwd: require( 'process').cwd(),
                homedir: require( 'os').homedir(),
            },
            debug:{}
        }
    );
}
