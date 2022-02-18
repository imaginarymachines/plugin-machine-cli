const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthConfig, updateAuthConfig } =  require('../lib/config');
import {
  info,
  success
} from '../lib/log';

function parseArgumentsIntoOptions(rawArgs) {
  //https://www.npmjs.com/package/arg
  const args = arg(
    {
      '--token': String,
      '-c': Boolean,
      // Aliases
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    token: args['--token'] || args._[1],
    t: args['-t'] || false,
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
export async function doLogin(token) {
  const config = updateAuthConfig({token});
  success(`Logged in with token: ${token}`);
}

/**
 * Hander for `plugin-machine login {command}` commands
 */
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  if( options.c ) {
    const config = getAuthConfig();
    info( config );
    return;
  }
  options = await promptForMissingOptions(options);
  doLogin(options.token);
}

// ...
