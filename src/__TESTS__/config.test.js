const {getPluginMachineJson,appUrl,apiUrl} = require( '../lib/config');
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
        expect(pluginMachineJson.pluginId).toBe(4312);
        expect(Number.isNaN(pluginMachineJson.buildId)).toBe(false)
    });

    it( 'Returns buildId' , () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir,{buildId: 412});
        expect(pluginMachineJson.buildId).toBe(412);
        expect(Number.isNaN(pluginMachineJson.pluginId)).toBe(false)
    });

    it( 'Ovverides all', () => {
        const data = {
            pluginId: 12,
            buildId: 2,
        };
        const pluginMachineJson = getPluginMachineJson(pluginDir,{
            pluginMachineJson: data,
        });
        expect(pluginMachineJson.pluginId).toEqual(12);

    });



})

describe( 'appUrl and apiUrl', () => {
    it( 'returns appUrl', () => {
        expect( typeof getPluginMachineJson(pluginDir).appUrl).toBe('string');
        expect( appUrl('/api')).toBe('https://pluginmachine.app/api');
    });

    it( 'returns appUrl if provided false for the URL', () => {
        expect( typeof getPluginMachineJson(pluginDir,{appUrl: false}).appUrl).toBe('string');
        expect( appUrl('/api')).toBe('https://pluginmachine.app/api');
    });

    it( 'Ovverides app url', () => {
        const pluginMachineJson = getPluginMachineJson(pluginDir, {appUrl: 'http://localhost:3000'})
        expect( pluginMachineJson.appUrl).toBe('http://localhost:3000')
        expect( appUrl('/api')).toBe('http://localhost:3000/api');
    });

    test( 'apiUrl', () => {
        expect( apiUrl('/spoons')).toBe('http://localhost:3000/api/v1/spoons');
    });
})
