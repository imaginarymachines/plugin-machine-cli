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
      if( pluginMachineJson.buildSteps){
        if( pluginMachineJson.buildSteps[env]){
        pluginMachineJson.buildSteps[env].forEach(
          async(step) => {
            await docker.run(step).catch(exitError);
          }
        )
        }
      }
      resolve(true);
    });
}
/**
 * Make a zip file of a plugin.
 */
export async function makeZip(
  pluginDir:string,
  pluginMachineJson: I_PluginMachineJson
) {
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

  const output = fs.createWriteStream(`${slug}.zip`);
  const archive = archiver('zip');

  console.log('Zipping!');

  return new Promise( async (resolve,reject) => {
    output.on('close', function () {
      console.log('Zipped!');
      console.log(archive.pointer() + ' total bytes');
      resolve(true);
    });

    //@ts-ignore
    archive.on('error', function (err) {
      console.log({err});
      reject(false);
    });

    archive.pipe(output);

    buildIncludes.forEach((name) => {
        if (fs.existsSync(`${pluginDir}/${name}`)) {
          if( isDir (name) ) {
            archive.directory(`${name}/`, name);
          }else{
            archive.append(fs.createReadStream(`${pluginDir}/${name}`), {
              name,
            });
          }
        }

    });


    archive.finalize();

  });


}
