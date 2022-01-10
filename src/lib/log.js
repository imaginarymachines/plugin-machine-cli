const log = console.log;


const chalk = {
    green:(str) => str,
    red:(str) => str,
    yellow:(str) => str,
    blue:(str) => str,
}


const maybeStringify = (obj) => {
    if( 'string' == typeof obj ) {
        return obj;
    }
    return JSON.stringify(obj,null,2);
}

export const error = (message) => log((maybeStringify(message)));
export const important = (message) => log(chalk.yellow(maybeStringify(message)));
export const info = (message) => log(chalk.blue(maybeStringify(message)));
export const success = (message) => log(chalk.green(maybeStringify(message)));
