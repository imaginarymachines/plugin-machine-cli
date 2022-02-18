
const fs = require('fs');
const { join } = require( 'path' );
const { homedir } = require( 'os' );

import { I_PluginMachineJson } from './pluginMachineApi';
let pluginMachineJson : I_PluginMachineJson;

const highlight = (string:string) => string;
//Get current pluginMachine.json file
export const getPluginMachineJson = (pluginDir:string, opts = {} ) => {
    if( ! pluginMachineJson ){
      if(  fs.existsSync(`${pluginDir}/pluginMachine.json`) ){
        pluginMachineJson = require(
            join(pluginDir, 'pluginMachine.json')
        );
      }else{
        pluginMachineJson = {pluginId: 0, buildId: 0,buildIncludes: [],slug: ''};
      }
    }

    pluginMachineJson = Object.assign(pluginMachineJson, opts);
    //@ts-ignore
    pluginMachineJson.pluginId = parseInt(pluginMachineJson.pluginId, 10);
       //@ts-ignore
    pluginMachineJson.buildId = parseInt(pluginMachineJson.buildId, 10);
        //@ts-ignore
    if( ! pluginMachineJson.hasOwnProperty('appUrl')|| false == pluginMachineJson.appUrl ){
      pluginMachineJson.appUrl = 'https://pluginmachine.app';
    }


  return pluginMachineJson;

};
//Get auth token from auth.json, if set
export const getAuthToken = () => {
  const authConfig = getAuthConfig();
  if( authConfig.hasOwnProperty('token') ){
    return authConfig.token;
  }
  return false;
};

export const getPluginDir = () => {
  const {cwd}= require( 'process');
  return cwd();
}

//update auth.json contents
export  const updateAuthConfig = (newData:any) => {
    // read existing config
    const currentData = readAuthConfigFile();
    if( ! currentData ){
        writeToAuthConfigFile(newData);
    }else{
        writeToAuthConfigFile({
            ...currentData,
            ...newData
        });
    }
    return getAuthConfig();
};

//Get auth.json contantes
export  const getAuthConfig = () => {
    const config = readAuthConfigFile();
    return config ? config : {};
}


// Path to auth.json
export  const AUTH_CONFIG_FILE_PATH = `${homedir()}/.plugin-machine-php-cli/auth.json`;

// reads "auth config" file atomically
// @see https://github.com/vercel/vercel/blob/f18bca97187d17c050695a7a348b8ae02c244ce9/packages/cli/src/util/config/files.ts#L53-L57
export  const readAuthConfigFile = () => {
  if( ! fs.existsSync(AUTH_CONFIG_FILE_PATH) ){
    return false;
  }
  try {
    const config = fs.readFileSync(AUTH_CONFIG_FILE_PATH);
    return JSON.parse(config);
  return config;
  } catch (error) {
    return false;
  }

};

//Placeholder error handler
export  const error = (message:string) => message;

//Write to auth.json
//@see https://github.com/vercel/vercel/blob/f18bca97187d17c050695a7a348b8ae02c244ce9/packages/cli/src/util/config/files.ts#L59-L91
export  const writeToAuthConfigFile = (authConfig:any) => {
    if (authConfig.skipWrite) {
      return;
    }
    try {
      return fs.writeFileSync(AUTH_CONFIG_FILE_PATH,
        JSON.stringify(authConfig), {
        flags: 'w+',
      });
    } catch (err) {
      // @ts-ignore
      if (err.code === 'EPERM') {
        console.error(
          error(
            `Not able to create ${highlight(
              AUTH_CONFIG_FILE_PATH
            )} (operation not permitted).`
          )
        );
        process.exit(1);
              // @ts-ignore
      } else if (err.code === 'EBADF') {
          error(
            `Not able to create ${highlight(
              AUTH_CONFIG_FILE_PATH
            )} (bad file descriptor).`
          )
        process.exit(1);
      }

      throw err;
    }
  };


// Returns whether a directory exists
export const isDirectory = (path:string) => {
    try {
        return fs.lstatSync(path).isDirectory();
    } catch (_) {
        // We don't care which kind of error occured, it isn't a directory anyway.
        return false;
    }
};


export const appUrl = (endpoint:string):string => {
  return `${pluginMachineJson.appUrl}${endpoint}`;
};

export const apiUrl = (endpoint:string):string => `${appUrl(`/api/v1${endpoint}`)}`;
