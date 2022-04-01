
const {exec} = require( 'shelljs' );

//@todo use this, for now using link
const runCommand = (command) => {
    if( command.startsWith( 'plugin-machine' ) ) {
        command = command.replace( 'plugin-machine', '' );
    }
    const child = exec(`node dist/index.js ${command}`, {async:true});
    child.stdout.on('data', function(data) {

    });
}
describe( 'running commands to make sure there are no errors', () => {

    it( 'Gets node version', () => {
        exec('plugin-machine node -v');
    });

    it( 'Get npm version', () => {
        exec('plugin-machine npm -v');
    }
    );

    it( 'Gets yarn version', () => {
        exec('plugin-machine yarn -v');
    }
    );
    it( 'Gets composer version', () => {
        exec('plugin-machine composer --version');
    }
    );
});
