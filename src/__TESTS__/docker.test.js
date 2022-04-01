describe( 'running commands to make sure there are no errors', () => {
    const shell = require('shelljs');

    it( 'Gets node version', () => {
        shell.exec('node -v');
    });

    it( 'Get npm version', () => {
        shell.exec('npm -v');
    }
    );

    it( 'Gets yarn version', () => {
        shell.exec('yarn -v');
    }
    );
    it( 'Gets composer version', () => {
        shell.exec('composer --version');
    }
    );
});
