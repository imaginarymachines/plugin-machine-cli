const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthToken, getPluginDir, getPluginMachineJson } = require( './lib/config');
const pluginMachineApi = require( './lib/pluginMachineApi');


function parseArgumentsIntoOptions(rawArgs) {
  //https://www.npmjs.com/package/arg
  const args = arg(
    {
      '--pluginId': String,
      '--feature': String,
      '--pluginDir': String,
      // Aliases
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    command: args._[0] || false,
    feature: args['--feature'] || false,
    pluginId: args['--pluginId'] || args._[1] || false,
    pluginDir: args['--pluginDir'] || false,
  };
}
async function promptForFeature(options,features) {
  const questions = [];

  const hasFeature = (rule) => {
    return features.hasOwnProperty(rule);
  }
  const getFeatureChoices = () => {
    return Object.keys(features).map(feature => {
      return {
        name: features[feature].feature.singular,
        value: feature,
      }
    });
  }

  if( 'string' !== typeof options.feature || !hasFeature(options.feature) ) {
    questions.push({
      type: 'list',
      name: 'feature',
      message: 'What type of feature would you like to add?',
      choices:getFeatureChoices(),
    });
    options = await promptForMissingOptions(options,questions);
  }

  return options;
}

async function promptForFeatureRules(options,allRules) {
  const {feature} = options;
  const questions = [];
  if( ! allRules.hasOwnProperty(feature) ) {
    throw new Error(`Feature ${feature} not found`);
    return;
  }
  Object.keys(allRules[feature]).forEach(rule => {
    const {label,options,rules} = allRules[feature][rule];

    if( null !== options ) {
        questions.push({
          type: 'list',
          name: rule,
          message: label,
          choices:Object.keys(options).map(option => {
            return {
              value:options[option],
              name:option,
            }
          }),
        });
    }else if( 'string' === rules[0] ) {
      questions.push({
        type: 'prompt',
        name: rule,
        message: label,
      });
    }
  });

  options = await promptForMissingOptions(options,questions);

  return options;
}

async function promptForMissingOptions(options,questions) {
  if( questions.length ) {
    const answers = await inquirer.prompt(questions);
    options= Object.assign(options, answers);
  }
  return options;
}


async function handleConfig(pluginDir,pluginId,pluginMachine) {
  const fs = require('fs');
  let newPluginMachineJson = await pluginMachine.getPluginMachineJson(pluginId);
  fs.writeFileSync(`${pluginDir}/pluginMachine.json`, JSON.stringify(newPluginMachineJson, null, 2));
  return true;
}

async function handleZip(pluginDir,pluginMachineJson){
  const {makeZip} = require('./zip');
  await makeZip(pluginDir,pluginMachineJson);
}

async function handleAddFeature(pluginDir,pluginMachine,pluginMachineJson,options){
  const {feature} = options;
  const data = {};
  const badKeys = ['command','feature','pluginId'];
  Object.keys(options).forEach( option => {
    if( -1 == badKeys.indexOf(option) ) {
      data[option] = options[option].toLowerCase();
    }
  });
  data.featureType = feature;

  let {featureId,files} = await pluginMachine.addFeature(pluginMachineJson,data);
  if( files.length ){
    files.forEach(async(file) => {
      let fileContents = await pluginMachine.getFeatureCode(pluginMachineJson,featureId,file);
      await pluginMachine.writeFile(pluginDir,file,fileContents);
    });

  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const pluginDir = options.pluginDir || getPluginDir();
  const pluginMachineJson = getPluginMachineJson(pluginDir);
  const pluginMachine = await pluginMachineApi(
    options.token || getAuthToken(pluginDir),
  );

  switch (options.command) {
    case 'config':
      await handleConfig(
        pluginDir,
        options.pluginId || pluginMachineJson.pluginId,
        pluginMachine
      );
      break;
    case 'zip':
      await handleZip(pluginDir,pluginMachineJson);
        break;
        case 'add':
          const rules = require( './data/rules.json');
          const features = require( './data/features.json');
          options = await promptForFeature(options,features);
          options = await promptForFeatureRules(options,rules);
          await handleAddFeature(
            pluginDir,pluginMachine,pluginMachineJson,options
          );
    default:
      break;
  }

}
