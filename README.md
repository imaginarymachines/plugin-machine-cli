# Plugin Machine CLI

Command line interface for [Plugin Machine](https://pluginmachine.com).

- ![npm](https://img.shields.io/npm/v/plugin-machine?style=flat-square)
- [![Tests](https://github.com/imaginarymachines/plugin-machine-cli/actions/workflows/node.js.yml/badge.svg)](https://github.com/imaginarymachines/plugin-machine-cli/actions/workflows/node.js.yml)
## Install

- Install globally, which is recommended:
    - `npm i plugin-machine -g`
- Install as a dependency of plugin:
    - `npm i plugin-machine`
- Use via npx
    - `npx plugin-machine login`

## Commands

Many commands require login. You can either use the login command, which presists your token in your host machine's file system, or you can use the `--token` flag.

### Login
- Login to plugin machine.
    - `plugin-machine login {token}`
    - [When logged in, go to /dashboard/api](https://pluginmachine.app/dashboard/api) to see API token.

### Plugin
> These Commands Require login

All `plugin` commands will assume that the current directory is the root directory of the plugin. You may pass a different directory with --pluginDir flag: `plugin-machine plugin add --pluginDir=../something`.

#### Write pluginMachine.json for a plugin

- Update pluginMachine.json
    - `plugin-machine plugin config`
- Download pluginMachine.json for a plugin
    - `plugin-machine plugin config --pluginId=7`
#### Add a feature to current plugin

- `plugin-machine plugin add`

#### Build plugin

This command runs any npm or composer commands found in pluginMachine.json's "buildSteps" key.

- Prepare for a production-ready, installable zip.
  - `plugin-machine plugin build`
- Optionally, copy files to a directory
  - `plugin-machine plugin build --buildDir=build`

You can also pass a phpVersion and/or nodeVersion value.

- `plugin-machine plugin build --nodeVersion=16 --phpVersion=7.4`
- Allowed values for `--nodeVersion`:
  - '12', '14', '16', '17'
- Allowed values for `--phpVersion`:
  - '7.3', '7.4', '8.0', '8.1'

#### ZIP plugin for release

- Zip files, based on pluginMachine.json's "buildIncludes" key.
  - `plugin-machine plugin zip`

- Zip files, in directory set in --buildDir option
  - `plugin-machine plugin zip --buildDir=build`

- Build and then zip build
  - `plugin-machine plugin build --buildDir=plugin-name`
  - `plugin-machine plugin zip --buildDir=plugin-name`

- Upload file
  - `plugin-machine plugin upload --fileName=something.zip --filePath=/full/path/to/zip.zip

### Debug
- Output some debug information
	- `plugin-machine debug`

### Get Version
- Output some debug information
	- `plugin-machine version`

### Docker

Docker shortcuts:

- Kill all Docker containers running on the machine:
    - `plugin-machine docker kill`
    - Runs: `docker kill $(docker ps -q)`

## Node API

You can also install this as a module in a node.js project, and use the api directly.

```js
import {createDockerApi,getPluginMachineJson,pluginMachineApi} from 'plugin-machine';

//Create instance of Docker API
const pmDockerApi = await createDockerApi({
  //options are optional
});

//Get the pluginMachine.json file for the plugin
const pluginMachineJson = getPluginMachineJson(
  '/path/pluginMachine.json',
  //Optional ovverides
  {}
);
```

### Plugin Machine API

```js
import {pluginMachineApi} from 'plugin-machine';
//Get token from somewhere
let token = '';
const pluginMachine = await pluginMachineApi(token);
```

- Get the plugin machine json file for a saved plugin
```js
  await pluginMachine.getPluginMachineJson(pluginId);
```
- Add a feature to a plugin
```js
  await pluginMachine.addFeature(pluginMachineJson,data)
```
- Get one file, from a feature
```js
  await pluginMachine.getFeatureCode(
      pluginMachineJson,
      featureId,
      file
  );
```
- Upload a new version
  - `${pluginMachineJson.slug}.zip` must exist.
```js
  await pluginMachine.uploadVersion(
    pluginMachineJson,
    version,
    pluginDir

  )
```
- Upload a zip file
  - `${pluginMachineJson.slug}.zip` must exist.
```js
  await pluginMachine.uploadFile(
    fileName, filePath
  )
```

- Get all versions of plugin
```js
  let versions =await pluginMachine.uploadVersion(
    pluginMachineJson,

  );
```


### Using The Builder

#### Build Plugin & Zip

```js
import {builder,createDockerApi,getPluginMachineJson} from 'plugin-machine';
const {
  buildPlugin,
  makeZip,
} = builder;
//Setup pmDockerApi and pluginMachineJson first.
const pmDockerApi = await createDockerApi({});
const pluginMachineJson = getPluginMachineJson('/path/pluginMachine.json');
const
buildPlugin(
  pluginMachineJson,
  'prod',
  pmDockerApi
).then( () => {
  console.log('built!');
  makeZip(
    './',//dir plugin is in
    pluginMachineJson
  ).then( () => {
    console.log('zipped');
  })
});

```

#### Build Plugin & Copy Files

```js
import {builder,createDockerApi,getPluginMachineJson} from 'plguin-machine';
const {
  buildPlugin,
  copyBuildFiles,
  zipDirectory
} = builder;
//Setup pmDockerApi and pluginMachineJson first.
const pmDockerApi = await createDockerApi({});
const pluginMachineJson = getPluginMachineJson('/path/pluginMachine.json');
await
buildPlugin(
  pluginMachineJson,
  'prod',
  pmDockerApi
).then( () => console.log('built!'));
await copyBuildFiles(
  pluginMachineJson,
  './',//plugin root directory
  'output'//subdir of plugin dir to copy file sto
).then( () => console.log('copied!'));
await zipDirectory(
    './output',
    'plugin-slug'
).then( () => console.log('zipped!'));

```



## Development


### Required

- Node.js 14+

### Commands


  - `npm start`
    - run cli
  - `npm run dev`
    - run force debug cli
  - `npm run type-check`
    - run type-check and lint
  - `npm run lint`
    - run type-check and lint, fixing fixable errors
  - `npm run build`
    - run swc
      - this only development, not production
  - `npm run test`
    - launches test runner by watch mode
  - `npm run test:ci`
    - Runs tests for CI, IE once, not a watcher.
  - `npm run coverage`
    - ~~get coverage report~~
