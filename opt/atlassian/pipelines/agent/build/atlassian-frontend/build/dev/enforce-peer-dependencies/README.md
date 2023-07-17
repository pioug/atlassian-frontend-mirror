# @atlaskit/enforce-peer-dependencies

A tool to enforce compatible versions of peer dependencies on selected packages.

## Usage

Simply add a postinstall script `"postinstall": "npx @atlaskit/enforce-peer-dependencies"` inside `package.json` of a package for the enforcement.

When this package is installed on the consumer's side, it will check all its peer dependencies and fail the install if any unmet version is found.

## Options

`--internal-packages`: Only check atlassian, atlaskit or atlassiansox scoped peer dependencies

`--verbose`: Show logs on stdout in CI for easier debugging. Since logs in postinstall scripts are suppressed by default, run `yarn --verbose` in Yarn 1 or `yarn --inline-builds` in Yarn 3 if you want to view logs when running on local.
