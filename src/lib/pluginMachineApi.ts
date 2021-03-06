import {
  error,
} from './log';
import {appUrl} from './config';
import axios from 'axios';
import pmCiApi from './pmCiApi';
export interface I_PluginMachineJson {
  pluginId: number;
  buildId: number;
  buildIncludes: string[];
  slug:string;
  appUrl?: string;
  buildSteps?: {
    dev: string[],
    prod: string[],
  },
  phpVersion?: '7.3'| '7.4'| '8.0'| '8.1',
  nodeVersion?: '14'| '16'| '17',
}
/**
 * Plugin Machine API client
 */
const pluginMachineApi = async (token:string) => {
    const pmCi = pmCiApi(token);
    const fs = require( 'fs');
    const packageJson = require(
      require('path').join(__dirname, '../package.json')
    );
    const {version} = packageJson;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': `Plugin Machine CLI / ${version}`,
    };

    //Axios instance for primary API, with auth token
    const apiInstance = axios.create({
      baseURL: appUrl('/api/v1'),
      timeout: 5000,
      headers
    });

    //Axios instance for plugins API, with auth token
    //Plugin update API uses a non-standard API prefix (OK, but why?)
    const pluginApiInstance = axios.create({
      baseURL: appUrl('/api/plugins'),
      timeout: 5000,
      headers
    });


    //Get the plugin machine json file for a saved plugin
    async function getPluginMachineJson(pluginId:string|number){
      return apiInstance.get(
        `/plugins/${pluginId}/code`,

              // @ts-ignore
      ).catch( ({response}) => {
        error(`Error getting plugin machine json for plugin ${pluginId}`);
        console.log(response.statusText,response.data);
        // @ts-ignore
      }).then( ({data}) => {
        return data;
      })
    }

    return {
      getPluginMachineJson,
      //Add a feature to a plugin
      addFeature: async (pluginMachineJson:I_PluginMachineJson,data:any)  =>{
        const {pluginId,buildId}=pluginMachineJson;

        return apiInstance.post(
          `/plugins/${pluginId}/builds/${buildId}/features`,
          JSON.stringify(data)
        )
        //@ts-ignore
        .catch( ({response}) => {
          error(`Error adding feature to plugin ${pluginId}`);
          if( response.data ){
            Object.keys(response.data).forEach( (key) => {
              error(`${key}: ${response.data[key]}`);
            });
          }
          throw new Error(
            response.statusText
          )
            //@ts-ignore
        }).then( ({data}) => {
            return {
              files: data.files,
              featureId:data.setting.id,
              main: data.main ? data.main : false,
            };
          });


      },
      //Get one file, from a feature
      getFeatureCode: async (pluginMachineJson:I_PluginMachineJson,featureId:number|string,file:string) => {
        const {pluginId,buildId}=pluginMachineJson;
        return apiInstance.get(
          `/plugins/${pluginId}/builds/${buildId}/features/${featureId}/code?file=${encodeURI(file)}`
        )
        //@ts-ignore
        .catch( e => {
          error(`Error getting feature ${featureId} for plugin ${pluginId}`);
        }).then( (r) => {
            if(r){
              return r.data;
            }
        } );
      },
      uploadFile:  async (fileName:string, pluginDir:string,pluginId:number) => {
        return pmCi.uploadVersion(
          fs.readFileSync(`${pluginDir}/${fileName}`),
          pluginId,
        )
        //@ts-ignore
        .catch( e => {
          error(`Error uploading file ${fileName}`);
          console.log(e);
          // @ts-ignore
        })
        .then( r => r );
      },
      getPlugins: async (page:number=1) =>{
        return pluginApiInstance(
          `/plugins?page=${page}`

          //@ts-ignore
        ).then( (r) => {
          console.log(r.data);
        });
      },
      //Get all versions of plugin
      getVersions: async (pluginMachineJson:I_PluginMachineJson) => {
        const {pluginId}=pluginMachineJson;

        return pluginApiInstance(
          `/${pluginId}/versions`

          //@ts-ignore
        ).catch( e => {
          error(`Error getting versions for plugin ${pluginId}`);
        }).then( ( r ) => {
            if( r ){
              return r.data;
            }
            throw new Error(`Error getting versions for plugin ${pluginId}`);
        });
      },
      //Write a file, with some saftery features
      writeFile: async(pluginDir:string,file:string,fileContents:string) => {
        //Has a path?
        const split = file.split('/');
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

  export default pluginMachineApi;
