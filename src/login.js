const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthConfig, updateAuthConfig } =  require('./lib/config');

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
    token: args['--token'] || false,
    t: args['-t'] || false,
  };
}

async function promptForMissingOptions(options) {
  const questions = [];
  if( 'string' !== typeof options.token ) {
    questions.push({
      type: 'prompt',
      name: 'token',
      message: 'Plugin Machine API token:',
      default: '',
    });

  }
  if( questions.length ) {
    const answers = await inquirer.prompt(questions);
    return Object.assign(options, answers);
  }
  return options;
}

export async function  doLogin(token) {
  const config = updateAuthConfig({token});
  console.log(config);
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  if( options.c ) {
    const config = getAuthConfig();
    return;
  }
  options = await promptForMissingOptions(options);
  doLogin(options.token);
}

// ...
