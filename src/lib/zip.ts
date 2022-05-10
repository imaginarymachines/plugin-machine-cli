import { info } from 'console';
import { I_DockerApi } from './docker/docker';
import { exitError } from './docker/exit';
import { I_PluginMachineJson } from './pluginMachineApi';



/**
 * Run plugin build steps
 */
export async function buildPlugin(
  pluginMachineJson: I_PluginMachineJson,
  env: 'prod'|'dev',
  docker: I_DockerApi,
  ){
    return new Promise( async (resolve) => {
      resolve(true);
      if( pluginMachineJson.buildSteps){
        if( pluginMachineJson.buildSteps[env]){
          pluginMachineJson.buildSteps[env].forEach(
            async(step) => {
              await docker.run(step).catch(exitError);
            }
          );
        }
      }
      resolve(true);
    });
}

export async function copyBuildFiles(
  pluginMachineJson: I_PluginMachineJson,
  buildDir: string,
  pluginDir: string,
){
  const fs = require('fs-extra');
  const path = require('path');
  const {buildIncludes} = pluginMachineJson;

  function withoutBasename(filePath:string){
    return filePath.replace(path.basename(filePath),'');
  }
  function isDir(path:string) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
  }

  const copyOptions = {
    overwrite : true,
    errorOnExist : false,
    preserveTimestamps : true,
  }
  //Make sure we have a build dir.
  fs.ensureDirSync(buildDir)
  buildIncludes.forEach((name) => {
    if (fs.existsSync(`${pluginDir}/${name}`)) {
      //Make sure directories exist.
      if( isDir(`${pluginDir}/${name}`)){
        fs.ensureDirSync(`${pluginDir}/${name}`)
      }else{
        fs.ensureDirSync(withoutBasename(`${pluginDir}/${name}`));
      }
      fs.copySync(`${pluginDir}/${name}`, `${pluginDir}/${buildDir}/${name}`,{
        options:copyOptions
      });
    }else{
      info( `${pluginDir}/${name} does not exist`);
    }
  });
}

export type T_ZipReturn = Promise<{
  fileName: string
}>;
/**
 * Zip a directory
 */
export async function zipDirectory(
  buildDir:string,
  slug:string,
  pluginDir:string
):T_ZipReturn{
  const fs = require('fs-extra');
  const file = `${pluginDir}/${slug}.zip`;
  const output = fs.createWriteStream(file);

  const archive = require('archiver')('zip');

  return new Promise( async (resolve,reject) => {
    output.on('close', function () {
      console.log('Zipped!');
      console.log(archive.pointer() + ' total bytes');
      resolve({fileName:file});
    });

    //@ts-ignore
    archive.on('error', function (err) {
      console.log({err});
      reject(false);
    });

    archive.pipe(output);

    archive.directory(buildDir, '/');
    archive.finalize();
  });

}
/**
 * Make a zip file of a plugin.
 */
export async function makeZip(
  pluginDir:string,
  pluginMachineJson: I_PluginMachineJson
):T_ZipReturn {
  function isDir(path:string) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
  }

  const fs = require('fs');
  const archiver = require('archiver');
  const {slug,buildIncludes} = pluginMachineJson;
  const fileName = `${pluginDir}/${slug}.zip`;
  const output = fs.createWriteStream(fileName);
  const archive = archiver('zip');

  console.log('Zipping!');

  return new Promise( async (resolve,reject) => {
    output.on('close', function () {
      console.log(`ZIPPED: ${slug}.zip`);
      console.log(archive.pointer() + ' total bytes');
      resolve({fileName});
    });

    //@ts-ignore
    archive.on('error', function (err) {
      console.log({err});
      reject(false);
    });

    archive.pipe(output);

    buildIncludes.forEach((name) => {
      let fileName = `${pluginDir}/${name}`;
      if (fs.existsSync(fileName)) {
        if( isDir (fileName) ) {
          archive.directory(fileName, name);
        }else{
          archive.append(
            fs.createReadStream(
              fileName
            ),{
              name,
            }
          );
        }
      }

    });


    archive.finalize();

  });


}
