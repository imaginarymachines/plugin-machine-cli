#!/usr/bin/env node
import hi from './lib/hi';

console.log(hi(process.argv[2]|| 'Roy'));

export {};
