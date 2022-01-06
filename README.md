# Plugin Machine CLI

Command line interface for [Plugin Machine](https://pluginmachine.com).

## Install


## Commands

 Login to plugin machine.
	- `plugin-machine login {token}`
    - [When logged in, go to /dashboard/user](https://pluginmachine.app/dashboard/user) to see API token.
- Write pluginMachine.json for a plugin
    - `plugin-machine plugin config {pluginId}`
    - Requires login
- Add a feature to current plugin
    - `plugin-machine plugin add`
    - Requires login
- ZIP plugin for release
    - `plugin-machine plugin zip`
- Output some debug information
	- `plugin-machine debug`

## Development

- Git clone
- Install
    - `yarn`
