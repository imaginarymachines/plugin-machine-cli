const arg = require('arg');
const inquirer = require('inquirer');
const { getAuthToken, getPluginDir, getPluginMachineJson,appUrl,apiUrl } = require( './lib/config');

const {
  error,
  important,
  info,
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

  const pluginApiUrl = (endpoint) => `${appUrl(`/plugins${endpoint}`)}`;

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
    //upoad a new version
    uploadVersion: async (pluginMachineJson,version) => {
      const {pluginId,slug} = pluginMachineJson;
      let readStream = fs.createReadStream(`${slug}.zip`);
      const fileSizeInBytes = fs.statSync(`${slug}.zip`).size;
      const data = {
        file: readStream,
        version
      }

      return fetch(
        pluginApiUrl(`/${pluginId}/versions`),
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-length": fileSizeInBytes
          },
          body:  {
            zip: readStream,
            version
          }
        }
      ).catch( e => {
        error(`Error uploading version${version} for plugin ${pluginId}`);
        console.log(e);
      }).then( r => {
        try {
          return r.json();
        } catch (error) {
          console.log({r,error});
        }
      } ).then(r => {
          return r;
      });
    },
    //upoad a new version
    getVersions: async (pluginMachineJson) => {
      const {pluginId}=pluginMachineJson;

      return fetch(
        pluginApiUrl(`/${pluginId}/versions`),
        {
          method: "GET",
          headers,
        }
      ).catch( e => {
        error(`Error getting versions for plugin ${pluginId}`);
        console.log(e);
      }).then( r => r.json() ).then(r => {
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
    },

  };

}



function parseArgumentsIntoOptions(rawArgs) {
//https://www.npmjs.com/package/arg
  const args = arg(
    {
      '--pluginId': String,
      '--feature': String,
      '--pluginDir': String,
      '--appUrl': String,
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
    appUrl: args['--appUrl'] || false,

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

async function promptForZipOptions(options) {
  const questions = [{
    type: 'list',
    name: 'version',
    message: 'Would you like to create a new release?',
    choices:[
      {
        name: 'NO',
        value: false,
      },
      {
        value: 'patch',
        name: 'Yes, a patch release',
      },
      {
        name: 'Yes, a minor release',
        value: 'minor',
      },
      {
        name: 'Yes, a major release',
        value: 'release',
      },
    ]
  }];

  options = await promptForMissingOptions(options,questions);


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
  info( `Saved new ${feature} feature with id ${featureId}`);

  const promises = [];
  if( files.length ){
    files.forEach(async(file) => {
      let fileContents = await pluginMachine.getFeatureCode(pluginMachineJson,featureId,file);
      promises.push(
        await pluginMachine.writeFile(pluginDir,file,fileContents).catch(e => {
            throw new Error(e);
        }).then(() => {
          info(`Added ${file}`);
        })
      )});
  }

  const outputMain = async () => {
    if( main && main.length ){
      important( 'IMPORTANT!')
      important( 'You must add this to the main file of your plugin:')
      if( Array.isArray(main)){
        main.forEach(main => {
          important( main);
        });
      }else if( 'string' === typeof main ){
        important( main );
      }
    }
  }
  Promise.all(promises).then(outputMain);

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
  let pluginMachineJson = getPluginMachineJson(pluginDir,{
    //Allow app/api URL to be overridden from --appUrl flag
    appUrl:options.appUrl,
  });
  const pluginMachine = await pluginMachineApi(
    checkLogin(options.token || getAuthToken(pluginDir)),
  );
  console.log({options})

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
      options = await promptForZipOptions(options);
      await handleZip(pluginDir,pluginMachineJson);
      if( options.version){
        await pluginMachine.uploadVersion(pluginMachineJson,options.version);
      }
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
