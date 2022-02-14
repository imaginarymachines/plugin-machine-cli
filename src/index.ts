#!/usr/bin/env node
import hi from './lib/hi';
import {info} from './lib/log'
console.log(hi(process.argv[2]|| 'Roy'));
info(hi(process.argv[2]|| 'Roy'));
export {};
