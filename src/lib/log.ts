const log = console.log;


/**
 * I am chalk now!
 */
const chalk = {
    green:(message: string|any) => log('\x1b[32m%s\x1b[0m',maybeStringify(message)),
    red:(message: string|any) => log('\x1b[31m%s\x1b[0m',maybeStringify(message)),
    yellow:(message: string|any) => log('\x1b[33m%s\x1b[0m',maybeStringify(message)),
    blue:(message: string|any) => log('\x1b[35m%s\x1b[0m',maybeStringify(message)),
    pink:(message: string|any) => log('\x1b[36m%s\x1b[0m',maybeStringify(message)),
}

const maybeStringify = (obj: string|any) => {
    if( 'string' == typeof obj ) {
        return obj;
    }
    return JSON.stringify(obj,null,2);
}

export const error = (message:string) => log(chalk.green(maybeStringify(message)));
export const important = (message:string) => log(chalk.yellow(maybeStringify(message)));
export const warning = important;
export const info = (message:string) => log(chalk.blue(maybeStringify(message)));
export const success = (message:string) => log(chalk.green(maybeStringify(message)));
