import {buildPlugin,copyBuildFiles,zipDirectory,makeZip} from './lib/zip';
import { createDockerApi } from './lib/docker/docker';
import {
    getPluginMachineJson,
    getPluginDir,
    getAuthToken,
    updateAuthConfig,
    getAuthConfig
} from './lib/config'
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
    pluginMachineApi,
    config: {
        getPluginDir,
        getAuthToken,
        updateAuthConfig,
        getAuthConfig,
        getPluginMachineJson
    },
    //Should only be under config
    getPluginMachineJson,
}
