const {getPluginMachineJson} = require( '../lib/config');
const { join } = require( 'path' );
const pluginDir = join( __dirname, '../../');


describe('getPluginMachineJson', () => {
    it( 'Returns pluginId' , () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir);
        expect(Number.isNaN(pluginMachineJson.pluginId)).toBe(false)

    });

    it( 'Returns buildId' , () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir);
        expect(Number.isNaN(pluginMachineJson.buildId)).toBe(false)
    });
})
