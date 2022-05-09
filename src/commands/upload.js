import { warning, success } from '../lib/log';
import {getAuthToken, getPluginDir, getPluginMachineJson} from '../lib/config';
import arg from 'arg';
import { exitError, exitSuccess } from '../lib/docker/exit';
import pmCiApi from '../lib/pmCiApi';
import { uploader } from '../pluginMachine';

function parseArgumentsIntoOptions(rawArgs) {
    //https://www.npmjs.com/package/arg
    const args = arg(
        {

            '--appUrl': String,
            '--token': String,
            '--fileName': String,
            '--pluginDir': String,
            '--quiet': Boolean,
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
        quiet: args['--quiet'] || false,
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
    uploader(options)
        .then( ({message,url}) => {
           exitSuccess({message:url});
        }).catch(
            ({message}) => {
                exitError({errorMessage: message});
            }
        );
}
