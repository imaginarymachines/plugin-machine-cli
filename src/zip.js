const arg = require('arg');
const inquirer = require('inquirer');


const commandArgs = {
  'path': {
    type: String,
    name: 'path',
    'message': 'Path to zip file:',
    default: '',
  },
}
function parseArgumentsIntoOptions(rawArgs) {
  let _args = {};
  let args = Object.keys(commandArgs).forEach(key => {
    _args[`--${key}`] = commandArgs[key].type;
  });


  //https://www.npmjs.com/package/arg
    args = arg(
      _args,
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    path: args['--path'] || false,
  };
}

async function promptForMissingOptions(options) {
  const questions = [];



  if( 'string' !== typeof options.path || !options.path.length ) {
    questions.push({
      type: 'prompt',
      name: 'path',
      message: 'Path to zip',
      default: '',
    });

  }
  if( questions.length ) {
    const answers = await inquirer.prompt(questions);
    return Object.assign(options, answers);
  }
  return options;
}

export async function makeZip(pluginDir,pluginMachineJson) {
  function isDir(path) {
      try {
          var stat = fs.lstatSync(path);
          return stat.isDirectory();
      } catch (e) {
          // lstatSync throws an error if path doesn't exist
          return false;
      }
  }


  const fs = require("fs");
  const archiver = require("archiver");
  const {slug,buildIncludes} = pluginMachineJson;

  const output = fs.createWriteStream(`${slug}.zip`);
  const archive = archiver("zip");

  console.log("Zipping!");
  output.on("close", function () {
    console.log("Zipped!");
    console.log(archive.pointer() + " total bytes");
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  buildIncludes.forEach((name) => {

      if (fs.existsSync(`${pluginDir}/${name}`)) {
        if( isDir (name) ) {
          archive.directory(`${name}/`, name);
        }else{
          archive.append(fs.createReadStream(`${pluginDir}/${name}`), {
            name,
          });
        }
      }

  });


  archive.finalize();
}
