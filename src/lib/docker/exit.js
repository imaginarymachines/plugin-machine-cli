import {success,error} from  '../log';
import shell from   'shelljs'

/**
 * Exit with success code
 */
 export const exitSuccess = ({errorMessage}) => {
    success(errorMessage||'All done!');
    //barrel roll
    shell.exit(0);
}

/**
 * Exit with error code
 */
export const exitError = ({errorMessage,errorCode = 1}) => {
    error( errorMessage ||'Exitting With Error!');
    shell.exit(errorCode);
}
