const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthConfig, updateAuthConfig, getPluginDir } =  require('../lib/config');
import { exitError, exitSuccess } from '../lib/docker/exit';
import {
  info,
  success
} from '../lib/log';

function parseArgumentsIntoOptions(rawArgs) {
  //https://www.npmjs.com/package/arg
  const args = arg(
    {
      '--token': String,
      '--ci': Boolean,
      '--pluginDir' : String,
      // Aliases
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    token: args['--token'] || args._[1],
    ci: args['--ci'] || false,
    pluginDir: args['--pluginDir'] || getPluginDir(),
  };
}

async function promptForMissingOptions(options) {
  const questions = [];
  if( 'string' !== typeof options.token ) {
    questions.push({
      type: 'prompt',
      name: 'token',
      message: 'Plugin Machine API token. https://pluginmachine.app/dashboard/api',
      default: '',
    });

  }
  if( questions.length ) {
    const answers = await inquirer.prompt(questions);
    return Object.assign(options, answers);
  }
  return options;
}

/**
 * Hander for `plugin-machine login ` command
 */
export async function doLogin(token,isCi,pluginDir) {
  try {
    const config = updateAuthConfig( {token},pluginDir,isCi);
    exitSuccess({
      message: `Logged in with token`
    });
  } catch (error) {
    exitError({
      errorMessage: error.message ? error.message : 'Error logging in',
      errorCode: error.code ? error.code : 1,
    });
  }

}

/**
 * Hander for `plugin-machine login {command}` commands
 */
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  const {pluginDir} = options;
  doLogin(options.token,true,pluginDir);
}

// ...
