let chalk = require('chalk');
const log = console.log;

const maybeStringify = (obj: string|any) => {
    if( 'string' == typeof obj ) {
        return obj;
    }
    return JSON.stringify(obj,null,2);
}

const error = (message:string) => log(chalk.green(maybeStringify(message)));
const important = (message:string) => log(chalk.yellow(maybeStringify(message)));
const warning = important;
const info = (message:string) => log(chalk.blue(maybeStringify(message)));
const success = (message:string) => log(chalk.green(maybeStringify(message)));

module.exports = {
    error,
    important,
    warning,
    info,
    success,
};
