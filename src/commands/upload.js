import { warning, success } from '../lib/log';
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
    const pluginDir = options.pluginDir || getPluginDir();
    const token = options.token || getAuthToken(pluginDir);
    checkLogin(token);
    const pluginMachine = await pluginMachineApi(token);
    const {fileName} = options;

    const missingArgError = (argName) => {
        throw new Error(`--${argName} is required`);
    }
    if( !fileName ) {
        missingArgError('fileName');
    }

    try {
        let r = await pluginMachine.uploadFile(
            fileName, pluginDir
        );
        success(`${fileName} uploaded successfully`);
        success(r.download);
    } catch (error) {
        warning('Upload failed');
        warning(error);
    }
}
