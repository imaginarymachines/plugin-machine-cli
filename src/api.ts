import {buildPlugin,copyBuildFiles,zipDirectory,makeZip} from './lib/zip';
import { createDockerApi } from './lib/docker/docker';
import {getPluginMachineJson} from './lib/config'
import pluginMachineApi from './lib/pluginMachineApi';
/**
 * Exporting api for when used as module
 */

export default {
    builder: {
        buildPlugin,
        zipDirectory,
        makeZip,
        copyBuildFiles,
    },
    createDockerApi,
    getPluginMachineJson,
    pluginMachineApi
}
