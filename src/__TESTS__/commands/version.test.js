describe( 'Version command', () => {
    const shell = require('shelljs');
    it( 'runs the version command', () => {
        shell.exec( 'plugin-machine version' );
    });
});
