describe( 'Debug command', () => {
    const shell = require('shelljs');
    it( 'runs the debug command', () => {
        shell.exec( 'plugin-machine debug' );
    });
});
