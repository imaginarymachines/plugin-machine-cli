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
import {
    pluginBuild,
    pluginZip,
    uploader
} from './pluginMachine'

/**
 * Exporting api for when used as module
 */
export default {
    //Primary functions
    pluginMachine: {
        pluginBuild,
        pluginZip,
        uploader
    },
    //Lower-level build function
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
