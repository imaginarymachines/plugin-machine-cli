#!/usr/bin/env node
import hi from './lib/hi';
import {info} from './lib/log';
info(process.argv[2]);


switch(process.argv[2]){
    case 'hi':
        info(hi(process.argv[2]|| 'Roy'));
    break;
    case 'plugin':
        require('./plugin.js').cli(process.argv);
    break;
    case 'login':
        require('./login.js').cli(process.argv);
    break;
    case 'docker':
        require('./docker.js').cli(process.argv);
    break;
    case '-v':
    case 'v':
    case 'version':
        require('./src/version.js').cli(process.argv);
        break;
    default:
        info( 'DEBUG INFO:')
        require('./src/debug.js').cli(process.argv);
        break;
    break;


}



export {};
