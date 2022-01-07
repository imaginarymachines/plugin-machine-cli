const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthToken, getPluginDir, getPluginMachineJson } = require( './lib/config');

const {
  error,
  important,
  info,
  success
} = require('./lib/log');

/**
 * Plugin Machine API client
 */
export const pluginMachineApi = async (token) => {
  const fetch = require('isomorphic-fetch');
  const fs = require( 'fs');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const apiUrl = (endpoint) => `https://pluginmachine.app/api/v1${endpoint}`;

  //Get the plugin machine json file for a saved plugin
  async function getPluginMachineJson(pluginId){
    return fetch(
      apiUrl(`/plugins/${pluginId}/code`),
      {
        method: 'GET',
        headers,
      }
    ).catch( e => {
      error(`Error getting plugin machine json for plugin ${pluginId}`);
      console.log(e);
    }).then( r => r.json() ).then(r => {
      return r;
    })
  }

  return {
    getPluginMachineJson,
    //Add a feature to a plugin
    addFeature: async (pluginMachineJson,data)  =>{
      const {pluginId,buildId}=pluginMachineJson;
      return fetch(
        apiUrl(`/plugins/${pluginId}/builds/${buildId}/features`),
        {
          method: "POST",
          body: JSON.stringify(data),
          headers,
        }
      )
      .catch( e => {
        error(`Error adding feature to plugin ${pluginId}`);
        console.log(e);
      }).then( r => r.json())
        .then(r => {
          return {
            files: r.files,
            featureId:r.setting.id,
            main: r.main ? r.main : false,
          };
        });


    },
    //Get one file, from a feature
    getFeatureCode: async (pluginMachineJson,featureId,file) => {
      const {pluginId,buildId}=pluginMachineJson;
      return fetch(
        apiUrl(`/plugins/${pluginId}/builds/${buildId}/features/${featureId}/code?file=${encodeURI(file)}`),
        {
          method: "GET",
        headers,        }
      ).catch( e => {
        error(`Error getting feature ${featureId} for plugin ${pluginId}`);
        console.log(e);
      }).then( r => r.text() ).then(r => {
        return r;
      });
    },
    //Write a file, with some saftery features
    writeFile: async(pluginDir,file,fileContents) => {
      //Has a path?
      let split = file.split('/');
      //Create directories if they don't exist
      if( split.length > 1 ) {
        let createDir = pluginDir;
        for (let i = 0; i < split.length -1; i++) {
          createDir = `${createDir}/${split[i]}`;
          if( ! fs.existsSync(createDir) ) {
            fs.mkdirSync(createDir);
          }
        }

      }

      fs.writeFileSync(`${pluginDir}/${file}`,fileContents,{ flag: 'w+' });
    }
  };

}



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
    command: args._[1] || false,
    feature: args['--feature'] || false,
    pluginId: args['--pluginId'] || args._[2] || false,
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

/**
 * Hander for `plugin-machine plugin config` command
 */
async function handleConfig(pluginDir,pluginId,pluginMachine) {
  const fs = require('fs');
  let newPluginMachineJson = await pluginMachine.getPluginMachineJson(pluginId);
  fs.writeFileSync(`${pluginDir}/pluginMachine.json`, JSON.stringify(newPluginMachineJson, null, 2));
  return true;
}

/**
 * Hander for `plugin-machine plugin zip` command
 */
async function handleZip(pluginDir,pluginMachineJson){
  const {makeZip} = require('./zip');
  await makeZip(pluginDir,pluginMachineJson);
}

/**
 * Hander for `plugin-machine plugin add` command
 */
async function handleAddFeature(pluginDir,pluginMachine,pluginMachineJson,options){
  const {feature} = options;
  const data = {};
  const badKeys = ['command','feature','pluginId'];
  Object.keys(options).forEach( option => {
    if( -1 == badKeys.indexOf(option) ) {
      if( 'string' === typeof options[option] ) {
        data[option] = options[option].toLowerCase();
      }
    }
  });
  data.featureType = feature;

  let {featureId,files,main} = await pluginMachine.addFeature(pluginMachineJson,data).catch(e => {
      throw new Error(e);
  });
  console.log( `Saved new ${feature} feature with id ${featureId}`);
  if( files.length ){
    files.forEach(async(file) => {
      let fileContents = await pluginMachine.getFeatureCode(pluginMachineJson,featureId,file);
      await pluginMachine.writeFile(pluginDir,file,fileContents).catch(e => {
          throw new Error(e);
      });
      console.log(`Added ${file}`);
    });
  }
  if( ! main ){

  }
}

//Make sure we have a token
const checkLogin = (token) => {
  if( ! token ) {
    throw new Error('No token found, you must be logged in to use this command');
  }
  return token;
}

const validatePluginJson = (pluginMachineJson) => {
  if( ! pluginMachineJson.pluginId ) {
    throw new Error('No pluginId found in pluginMachine.json');
  }
  if( ! pluginMachineJson.buildId ) {
    throw new Error('No buildId found in pluginMachine.json');
  }
  return pluginMachineJson;
}

/**
 * Hander for `plugin-machine plugin {command}` commands
 */
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const pluginDir = options.pluginDir || getPluginDir();
  let pluginMachineJson = getPluginMachineJson(pluginDir);
  const pluginMachine = await pluginMachineApi(
    checkLogin(options.token || getAuthToken(pluginDir)),
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
      pluginMachineJson = validatePluginJson(pluginMachineJson);
      await handleZip(pluginDir,pluginMachineJson);
      break;
    case 'add':
      pluginMachineJson = validatePluginJson(pluginMachineJson);
      const rules = require( './data/rules.json');
      const features = require( './data/features.json');
      options = await promptForFeature(options,features);
      options = await promptForFeatureRules(options,rules);
      await handleAddFeature(
        pluginDir,pluginMachine,pluginMachineJson,options
      );
      break;
    default:
      throw new Error(`Command plugin ${options.command} not found`);
      break;
  }

}
