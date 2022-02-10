let chalk = require('chalk');
const log = console.log;

const maybeStringify = (obj) => {
    if( 'string' == typeof obj ) {
        return obj;
    }
    return JSON.stringify(obj,null,2);
}

export const error = (message) => log(chalk.green(maybeStringify(message)));
export const important = (message) => log(chalk.yellow(maybeStringify(message)));
export const warning = important;
export const info = (message) => log(chalk.blue(maybeStringify(message)));
export const success = (message) => log(chalk.green(maybeStringify(message)));
