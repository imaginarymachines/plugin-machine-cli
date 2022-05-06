import { warning, success } from '../lib/log';
import {getAuthToken, getPluginDir, getPluginMachineJson} from '../lib/config';
import arg from 'arg';
import { exitError, exitSuccess } from '../lib/docker/exit';
import pmCiApi from '../lib/pmCiApi';
import {LocalFileData} from 'get-file-object-from-local-path';

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
    const pluginDir = options.pluginDir || getPluginDir();
    const token = options.token || getAuthToken(pluginDir);
    checkLogin(token);
    //Set appUrl from options
    const appUrl = options.appUrl ? options.appUrl : 'https://pluginmachine.app';
    let pluginMachineJson = getPluginMachineJson(pluginDir,{
        appUrl
    });
    const client = pmCiApi(token);
    let {fileName} = options;

    if( !fileName ) {
        fileName = `${pluginMachineJson.slug}.zip`;
    }
    const fileData = new LocalFileData(`${pluginDir}/${fileName}`);

    try {
        let r = await client.uploadVersion(
            fileData, pluginMachineJson.pluginId
        );
        if( ! options.quiet ) {
            success(`${fileName} uploaded successfully`);
        }
        exitSuccess({message: r.download});
    } catch (error) {
        console.log({error});
        warning('Upload failed');
        warning(error);
        exitError({errorMessage: 'Upload failed'});
    }
}
