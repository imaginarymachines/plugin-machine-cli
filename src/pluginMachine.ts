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
    const token = options.token || getAuthToken(pluginDir);

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
        token
    }
};

async function pluginBuild(options: any): Promise<{
    message: string,
    outputDir:string
}> {
    const {
        pluginDir,
        buildDir,
        dockerApi,
        pluginMachineJson,
    } = await creator(options);
    const {buildPlugin,copyBuildFiles} = require('./lib/zip');

    return new Promise( async (resolve,reject) => {
        await buildPlugin(pluginMachineJson,'prod',dockerApi)
            //@ts-ignore
            .catch(err => {reject({error: err})})
            .then(async () => {
                //Copy build files to buildDir if --buildDir is set
                if( buildDir ){
                    copyBuildFiles(pluginMachineJson,buildDir,pluginDir);
                    resolve({
                        message: 'Plugin built and copied',
                        outputDir: `${pluginDir}/${buildDir}`
                    });

                }else{
                    resolve({
                        message: 'Plugin built',
                        outputDir: pluginDir
                    });
                }
            });

    });


}

async function pluginZip(options: any):Promise< {
    fileName: string;
    message: string;
}>{
    const {
        buildDir,
        pluginDir,
        pluginMachineJson,
    } = await creator(options);
    const {makeZip,zipDirectory} = require('./lib/zip');
    return new Promise( async (resolve,reject) => {

          //If --buildDir arg passed, zip the build dir
          if( buildDir ){
            let {fileName} =await zipDirectory(
                buildDir, pluginMachineJson.slug,pluginDir
            ).catch(() => reject(
                {message: 'Plugin zip not created'}
            ));
            resolve({
                message: 'Plugin zip created',
                fileName
            });
          }else{
            //Else use pluginMachine.json to find files to zip
            let {fileName} = await makeZip(pluginDir,pluginMachineJson)
            //@ts-ignore
            .catch(err => reject({message:err}))
                resolve({
                message: 'Plugin zipped',
                fileName
            });
          }


    });

}
type T_UploadReturn = Promise<{
    message:string;
    url:string;
}>;
async function uploader(options: any):T_UploadReturn{
    const {
        pluginDir,
        pluginMachineJson,
        token
    } = await creator(options);
    checkLogin(token);
    const pmCiApi = require( "./lib/pmCiApi").default;
    const client = pmCiApi(token);
    let {fileName} = options;

    if( !fileName ) {
        fileName = `${pluginMachineJson.slug}.zip`;
    }

    return new Promise( async (resolve,reject) => {
        try {
            let r = await client.uploadVersion(
                fileName.startsWith(pluginDir) ? fileName :`${pluginDir}/${fileName}`,
                pluginMachineJson.pluginId
            );

            resolve({message: 'Upload completed',url:r.url});
        } catch (error) {
            console.log({error});
            reject({error: 'Upload failed'});
        }
    });

}

async function builder(options: any){
    let {outputDir,message} = await pluginBuild(options).catch(
        (e:Error) => {
            console.log(e);
            throw e;
        }
    );
    console.log({message,outputDir});
    let zipped = await pluginZip({
        ...options,
        buildDir: options.buildDir ? outputDir :false
    });

    console.log(zipped.message);
    let uploaded = await uploader({
        ...options,
        fileName: zipped.fileName
    });
    console.log(uploaded.message);
    console.log(uploaded.url);
    return {
        message: uploaded.message,
        url: uploaded.url
    }
}

export {
    pluginBuild,
    pluginZip,
    uploader,
    builder
}
