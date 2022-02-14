const log = console.log;

const chalk = {
    green:(string: string) => string,
    red:(string: string) => string,
    yellow:(string: string) => string,
    blue:(string: string) => string,
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
