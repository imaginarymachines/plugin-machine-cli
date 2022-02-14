const shell = require('shelljs');
const {success,error} = require( '../log');

/**
 * Exit with success code
 */
 const exitSuccess = ({errorMessage}) => {
    success(errorMessage||'All done!');
    //barrel roll
    shell.exit(0);
}

/**
 * Exit with error code
 */
const exitError = ({errorMessage,errorCode = 1}) => {
    error( errorMessage ||'Exitting With Error!');
    shell.exit(errorCode);
}

module.exports = {
    exitSuccess,
    exitError
}
