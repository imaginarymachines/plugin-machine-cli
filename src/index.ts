#!/usr/bin/env node
import hi from './lib/hi';
import {info,error} from './lib/log';

switch(process.argv[2]){
    case 'hi':
        info(hi(process.argv[2]|| 'Roy'));
    break;
    case 'upload':
        require('./commands/upload.js').cli(process.argv);
    break;
    case 'plugin':
        require('./commands/plugin.js').cli(process.argv);
    break;
    case 'login':
        require('./commands/login.js').cli(process.argv);
    break;
    case 'npm':
    case 'yarn':
    case 'node':
    case 'wp':
    case 'composer':
    case 'docker':
        require('./commands/docker.js').cli(process.argv);
    break;
    case '-v':
    case 'v':
    case 'version':
        require('./commands/version.js').cli(process.argv);
        break;
    case 'debug':
        info( 'DEBUG INFO:')
        require('./commands/debug.js').cli(process.argv);
    break;
    default:
        error( `ERROR: ${process.argv[2]} Command not found`);
    break;
}



export {};
