# Plugin Machine CLI

Command line interface for [Plugin Machine](https://pluginmachine.com).

- ![npm](https://img.shields.io/npm/v/plugin-machine?style=flat-square)

## Install

- Install globally, which is recommended:
    - `npm i plugin-machine -g`
- Install as a dependency of plugin:
    - `npm i plugin-machine`
- Use via npx
    - `npx plugin-machine login`

## Commands

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

#### ZIP plugin for release
- `plugin-machine plugin zip`

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

## Development

- Git clone
    - `git@github.com:imaginarymachines/plugin-machine-cli.git`
- Install
    - `npm i`
- Run a command
    - `node bin/cli plugin add`
    - Use `--appUrl` to change URL of server
- Run tests
    - `yarn test`
