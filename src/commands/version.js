const { info } = require( '../lib/log');

/**
 * Hander for `plugin-machine version` commands
 */
 export async function cli(args) {
    const packageJson = require(
        require('path').join(__dirname, '../package.json')
    );
    info(`Current version: ${packageJson.version}`);
}
