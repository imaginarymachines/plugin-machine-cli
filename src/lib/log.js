const chalk = require('chalk');
const log = console.log;


const maybeStringify = (obj) => {
    if( 'string' == typeof obj ) {
        return String;
    }
    return JSON.stringify(obj,null,2);
}

const error = (message) => log(chalk.green(maybeStringify(message)));
const important = (message) => log(chalk.yellow(maybeStringify(message)));
const info = (message) => log(chalk.blue(maybeStringify(message)));
const success = (message) => log(chalk.green(maybeStringify(message)));

export {
    error,
    important,
    info,
    success
}
