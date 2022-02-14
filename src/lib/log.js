let chalk = require('chalk');
const log = console.log;

const maybeStringify = (obj) => {
    if( 'string' == typeof obj ) {
        return obj;
    }
    return JSON.stringify(obj,null,2);
}

const error = (message) => log(chalk.green(maybeStringify(message)));
const important = (message) => log(chalk.yellow(maybeStringify(message)));
const warning = important;
const info = (message) => log(chalk.blue(maybeStringify(message)));
const success = (message) => log(chalk.green(maybeStringify(message)));

module.exports = {
    error,
    important,
    warning,
    info,
    success,
};
