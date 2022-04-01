describe( 'Calling plugin commands to check for errors', () => {
   const {exec} = require('shelljs');
   beforeAll(() => {
       exec( 'export PLUGIN_MACHINE_API_TOKEN=1234567890' );
       exec( 'plugin-machine login --token=fake --ci' );
    });

    afterAll(() => {
        shell.exec( 'unset PLUGIN_MACHINE_API_TOKEN' );
    });

    it( 'runs build command', () => {
        shell.exec( 'plugin-machine plugin build' );
    });

    it( 'runs the zip commands', () => {
        shell.exec( 'plugin-machine plugin zip' );
    });


});
