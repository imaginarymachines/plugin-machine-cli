import { info } from '../lib/log';
import {getAuthToken, getPluginDir, getPluginMachineJson} from '../lib/config';
import arg from 'arg';
import pluginMachineApi from '../lib/pluginMachineApi';

function parseArgumentsIntoOptions(rawArgs) {
    //https://www.npmjs.com/package/arg
    const args = arg(
        {

            '--appUrl': String,
            '--token': String,
            '--fileName': String,
            '--pluginDir': String,
            // Aliases
        },
        {
            argv: rawArgs.slice(1),
        }
    );
    return {
        appUrl: args['--appUrl'] || false,
        token: args['--token'] || false,
        fileName: args['--fileName'] || false,
        pluginDir: args['--pluginDir'] || false,
    };
}
//Make sure we have a token
const checkLogin = (token) => {
    if( ! token ) {
      throw new Error('No token found, you must be logged in to use this command');
    }
    return token;
  }

/**
 * Hander for `plugin-machine debug` commands
 */
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    //Set appUrl from options
    //const appUrl = options.appUrl ? options.appUrl : 'https://pluginmachine.app';
    const pluginDir = options.pluginDir || getPluginDir();
    const pluginMachine = await pluginMachineApi(
        checkLogin(options.token || getAuthToken(pluginDir)),
    );
    const {fileName, filePath} = options;
    info({options,fileName, filePath});

    const missingArgError = (argName) => {
        throw new Error(`--${argName} is required`);
    }
    if( !fileName ) {
        missingArgError('fileName');
    }
    if( !pluginDir ) {
        missingArgError('pluginDir');

    }

    try {
        await pluginMachine.uploadFile(
            fileName, pluginDir
        );
    } catch (error) {
        console.log(error);
    }
}
