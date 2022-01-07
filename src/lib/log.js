const chalk = require('chalk');
const log = console.log;


const error = (message) => log(chalk.green(message));
const important = (message) => log(chalk.yellow(message));
const info = (message) => log(chalk.blue(message));
const success = (message) => log(chalk.green(message));

export {
    error,
    important,
    info,
    success
}
