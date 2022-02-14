#!/usr/bin/env node
import hi from './lib/hi';
import {info} from './lib/log';
info(process.argv[2]);


switch(process.argv[2]){
    case 'hi':
        info(hi(process.argv[2]|| 'Roy'));
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
    default:
        info( 'DEBUG INFO:')
        require('./commands/debug.js').cli(process.argv);
        break;
    break;


}



export {};
