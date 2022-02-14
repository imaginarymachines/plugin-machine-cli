import {
  error,
  info,
} from './log';


import {appUrl,apiUrl} from './config';

export interface I_PluginMachineJson {
  pluginId: number;
  buildId: number;
  buildIncludes: string[];
  slug:string;
  appUrl?: string;
}
/**
 * Plugin Machine API client
 */
const pluginMachineApi = async (token:string) => {
    const FormData = require('form-data');
    const fetch = require('isomorphic-fetch');
    const fs = require( 'fs');
    const path = require('path');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    //Get full URL for plugin update API
    //Plugin update API uses a non-standard API prefix (OK, but why?)
    const pluginApiUrl = (endpoint:string) => `${appUrl(`/api/plugins${endpoint}`)}`;

    //Get the plugin machine json file for a saved plugin
    async function getPluginMachineJson(pluginId:string|number){
      return fetch(
        apiUrl(`/plugins/${pluginId}/code`),
        {
          method: 'GET',
          headers,
        }
      ).catch( e => {
        error(`Error getting plugin machine json for plugin ${pluginId}`);
        console.log(e);
      }).then( r => r.json() )
      .then( r => {
        return r;
      })
    }

    return {
      getPluginMachineJson,
      //Add a feature to a plugin
      addFeature: async (pluginMachineJson:I_PluginMachineJson,data:any)  =>{
        const {pluginId,buildId}=pluginMachineJson;
        return fetch(
          apiUrl(`/plugins/${pluginId}/builds/${buildId}/features`),
          {
            method: "POST",
            body: JSON.stringify(data),
            headers,
          }
        )
                  //@ts-ignore
        .catch( e => {
          error(`Error adding feature to plugin ${pluginId}`);
          console.log(e);
                    //@ts-ignore
        }).then( r => r.json())
                  //@ts-ignore
          .then(r => {
            return {
              files: r.files,
              featureId:r.setting.id,
              main: r.main ? r.main : false,
            };
          });


      },
      //Get one file, from a feature
      getFeatureCode: async (pluginMachineJson:I_PluginMachineJson,featureId:number|string,file:string) => {
        const {pluginId,buildId}=pluginMachineJson;
        return fetch(
          apiUrl(`/plugins/${pluginId}/builds/${buildId}/features/${featureId}/code?file=${encodeURI(file)}`),
          {
            method: "GET",
          headers,
                    }
        )
        //@ts-ignore
        .catch( e => {
          error(`Error getting feature ${featureId} for plugin ${pluginId}`);
          console.log(e);
                    //@ts-ignore
        }).then( (r) => r.text() ).then(r => {
          return r;
        });
      },
      //upoad a new version
      uploadVersion: async (pluginMachineJson:any,version:string,pluginDir:string) => {
        const {pluginId,slug} = pluginMachineJson;
        const fileName = `${slug}.zip`;
        let formdata = new FormData();
        formdata.append("zip", fileName, path.join(pluginDir,fileName));
        if( version ){
          formdata.append("version", version);
        }
        ////@ts-ignore
        const url = appUrl(`api/plugins/${pluginId}/versions`)``;
        console.log(url);
        return fetch(url, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "Accept-Encoding": "gzip, deflate",
            "Accept":"*/*",
          },
          body: formdata,
          redirect: 'follow'
        })
                  //@ts-ignore
          .then(response => response.text())
                    //@ts-ignore
          .then(r => {
            switch(r.status){
              case 400:
                //@ts-ignore
                return r.json().then(r => {
                  error(`Error uploading a ${version} update for plugin ${pluginId}`);
                  console.log(r.error);
                });
              case 401:
                console.log(headers);
                info(token);
                error(`Error uploading a ${version} update for plugin ${pluginId}`);
                throw new Error(r.statusText || 'Unauthorized');
              case 201:
              case 200:
                try {
                  return r.json();
                } catch (error) {
                  console.log({r,error});
                  throw error;
                }
              default:
                console.log(r);
                throw new Error(r.statusText || 'Unknown error');
            }


            throw new  Error(`Error uploading version ${version} for plugin ${pluginId}`);
          })
                  //@ts-ignore
          .catch(error => console.log('error', error));


      },
      //upoad a new version
      getVersions: async (pluginMachineJson:I_PluginMachineJson) => {
        const {pluginId}=pluginMachineJson;

        return fetch(
          pluginApiUrl(`/${pluginId}/versions`),
          {
            method: "GET",
            headers,
          }
          //@ts-ignore
        ).catch( e => {
          error(`Error getting versions for plugin ${pluginId}`);
          console.log(e);
                    //@ts-ignore
        }).then( r => r.json() ).then(r => {
            return r;
        });
      },
      //Write a file, with some saftery features
      writeFile: async(pluginDir:string,file:string,fileContents:string) => {
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

  export default pluginMachineApi;