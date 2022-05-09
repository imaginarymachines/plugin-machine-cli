import { getAuthToken, getPluginDir, getPluginMachineJson } from "./lib/config";
import { createDockerApi, makeDockerArgs } from "./lib/docker/docker";
import { exitError } from "./lib/docker/exit";
import pluginMachineApi from "./lib/pluginMachineApi";
//Make sure we have a token
const checkLogin = (token:string) => {
    if( ! token ) {
      throw new Error('No token found, you must be logged in to use this command');
    }
    return token;
  }

const creator = async (options: any) => {

    const pluginDir = options.pluginDir || getPluginDir();
    //Set appUrl from options
    const appUrl = options.appUrl ? options.appUrl : 'https://pluginmachine.app';
    let pluginMachineJson = getPluginMachineJson(pluginDir,{
        appUrl
    });
    const pluginMachine = await pluginMachineApi(
        checkLogin(options.token || getAuthToken(pluginDir)),
    );

    const dockerApi = await createDockerApi(
        makeDockerArgs(pluginDir,pluginMachineJson))
    .catch(
        //@ts-ignore
        (e:Error) => {
            exitError({errorMessage: 'Error connecting to docker'})
    });

    const buildDir = options.buildDir || null;

    return {
        pluginDir,
        buildDir,
        dockerApi,
        pluginMachine,
        pluginMachineJson,


    }
};


async function pluginBuild(options: any){
    const {
        buildDir,
        dockerApi,
        pluginMachineJson,
    } = await creator(options);
    const {buildPlugin,copyBuildFiles} = require('./lib/zip');

    return new Promise( async (resolve,reject) => {
        await buildPlugin(pluginMachineJson,'prod',dockerApi)
        //@ts-ignore
        .catch(err => {console.log({err})})
        .then(async () => {
            //Copy build files to buildDir if --buildDir is set
            if( buildDir ){
              copyBuildFiles(pluginMachineJson,buildDir,pluginDir);
              resolve({message: 'Plugin built and copied'});

            }else{
                reject({message: 'Plugin built'});
            }
        });

    });


}

async function pluginZip(options: any){
    const {
        buildDir,
        pluginDir,
        pluginMachineJson,
    } = await creator(options);
    const {makeZip,zipDirectory} = require('./lib/zip');

    return new Promise( async (resolve,reject) => {

          //If --buildDir arg passed, zip the build dir
          if( buildDir ){
            await zipDirectory(buildDir, pluginMachineJson.slug,pluginDir).then(
              () => resolve({message: 'Plugin zip created'})
            ).catch(() => reject(
                {message: 'Plugin zip not created'}
            ));
          }

          //Else use pluginMachine.json to find files to zip
          await makeZip(pluginDir,pluginMachineJson)
            //@ts-ignore
            .catch(err => reject({message:err}))
            .then(async () => {
                resolve({message: 'Plugin zipped'});
            });
    });

}

async function upload(options: any){
    const {
        buildDir,
        dockerApi,
        pluginMachine,
        pluginMachineJson,
    } = await creator(options);

    return new Promise( async (resolve,reject) => {

    });

}

export {
    pluginBuild,
    pluginZip,
    upload
}
