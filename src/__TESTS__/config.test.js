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

    it( 'overides pluginId' , () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir,{pluginId: 4312});
        expect(pluginMachineJson.pluginId).toEqual(4312);

        expect(Number.isNaN(pluginMachineJson.buildId)).toBe(false)


    });

    it( 'Returns buildId' , () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir,{buildId: 412});
        expect(pluginMachineJson.buildId).toEqual(412);
        expect(Number.isNaN(pluginMachineJson.pluginId)).toBe(false)
    });
})
