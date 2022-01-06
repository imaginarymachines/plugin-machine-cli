const pluginMachineApi = async (token) => {
    const fetch = require('isomorphic-fetch');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const apiUrl = (endpoint) => `https://pluginmachine.app/api/v1${endpoint}`;

    async function getPluginMachineJson(pluginId){
      return fetch(
        apiUrl(`/plugins/${pluginId}/code`),
        {
          method: 'GET',
          headers,
        }

      ).then( r => r.json() ).then(r => {
        return r;
      })
    }
    const fs = require( 'fs');

    return {
      getPluginMachineJson,
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
        .catch(e => {
          console.log(e);
        }).then( r => r.json())
          .then(r => {
            return {
              files: r.files,
              featureId:r.setting.id
            };
          });


      },
      getFeatureCode: async (pluginMachineJson,featureId,file) => {
        const {pluginId,buildId}=pluginMachineJson;
        return fetch(
          apiUrl(`/plugins/${pluginId}/builds/${buildId}/features/${featureId}/code?file=${encodeURI(file)}`),
          {
            method: "GET",
          headers,        }
        ).then( r => r.text() ).then(r => {
          return r;
        });
      },
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
export default pluginMachineApi;
