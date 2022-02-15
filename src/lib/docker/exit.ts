import {success,error} from  '../log';
//@ts-ignore
import shell from 'shelljs'

/**
 * Exit with success code
 */
 export function exitSuccess(opts : {message?:string}){
    success(opts.message||'All done!');
    //barrel roll
    shell.exit(0);
}

/**
 * Exit with error code
 */
export const exitError = (opts : {errorMessage?:string,errorCode?:number}) => {
    error( opts.errorMessage ||'Exitting With Error!');
    shell.exit(opts.errorCode||1);
}
