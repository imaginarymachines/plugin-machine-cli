const {getPluginMachineJson,appUrl} = require( '../lib/config');
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

    it( 'returns appUrl', () => {
        expect( typeof getPluginMachineJson(pluginDir).appUrl).toEqual('string');
        expect( appUrl('/api')).toEqual('https://pluginmachine.app/api');
    });

    it( 'Ovverides app url', () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir, {appUrl: 'http://localhost:3000'})
        expect( pluginMachineJson.appUrl).toEqual('http://localhost:3000')
        expect( appUrl('/api')).toEqual('http://localhost:3000/api');

    });
})
