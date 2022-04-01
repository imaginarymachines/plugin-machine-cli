describe( 'running commands to make sure there are no errors', () => {
    const shell = require('shelljs');

    it( 'Gets node version', () => {
        shell.exec('plugin-machine node -v');
    });

    it( 'Get npm version', () => {
        shell.exec('plugin-machine npm -v');
    }
    );

    it( 'Gets yarn version', () => {
        shell.exec('plugin-machine yarn -v');
    }
    );
    it( 'Gets composer version', () => {
        shell.exec('plugin-machine composer --version');
    }
    );
});
