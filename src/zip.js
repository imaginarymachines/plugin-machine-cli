
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
