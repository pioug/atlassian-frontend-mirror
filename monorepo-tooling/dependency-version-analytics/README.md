# `@atlaskit/dependency-version-analytics`

This is a tool that sends dependency version upgrade analytics to the GASv3 pipeline by running inside a product codebase and analysing git history.

## Install

`yarn add --dev @atlaskit/dependency-version-analytics @atlassiansox/analytics-node-client`

The `@atlassiansox/analytics-node-client` package is a peer dependency as it is a private package and so must be installed alongside the tool.

## Commands

Commands are exposed via both the CLI and programatically.

### populate-product \<product>

Sends analytics events of atlaskit dependency changes to package.json that have occurred since the tool was last run.

Run `yarn dependency-version-analytics --help` for more info.

#### Example

```sh
$ atlaskit-version-analytics populate-product jira
```

#### Description

Reads the git history of changes to package.json in the current branch (assumed to be master) since the tool was last run, tracks changes to dependencies and sends analytics in the format specified by http://go.atlassian.com/dataportal/analytics/registry/17058.

This command is intended to be used in product CI pipelines to record dep changes over time.

Dependency versions are compared to the versions when the tool was last run, which is marked by a git tag that the tool creates and updates on each run.

For initial publishing of historical events, the `--reset` flag can be used to send changes that have occurred since the start of history.

For supported package scopes [refer](./src/commands/populate-historic-data/util/allowed-scopes.ts)

### populate-package \<package>

Sends analytics events for published versions of the specified package.

Run `yarn dependency-version-analytics --help` for more info.

#### Example

```sh
$ atlaskit-version-analytics populate-package @atlaskit/button
```

#### Description

Reads the version history of the package from npm and sends events for versions published since the time specified by `--since`, or all versions if not specified.

This command will be used to record when new versions of the supported packages are published in this repo https://bitbucket.org/atlassian/atlaskit-version-analytics.

## Local development

### 1) Use yarn link

This will run the 'dev' mode of the tool and compile typescript on the fly. Any changes made to the source will instantly reflect in the product repo.

1. Run `yarn link` inside the package
2. `cd` to the root of the `alassian-frontend` repo then run `yarn build @atlaskit/dependency-version-analytics`
2. Run `yarn link '@atlaskit/dependency-version-analytics'` inside the product repo of your choosing or in the [`atlaskit-version-analytics`](https://bitbucket.org/atlassian/atlaskit-version-analytics/src/master/) repo to test your changes

Make dev changes + save.

### 2) Use yalc publish

This will run the built version of the tool that will be published to npm. It will use the compiled typescript output and will not allow 'hot module reload'.

1. Install yalc globally - `yarn global add yalc`

After each dev change,

1. Run `yarn build @atlaskit/dependency-version-analytics` outside the package
2. Run `yalc publish` inside the package
3. Run `yalc add '@atlaskit/dependency-version-analytics'` inside the product repo of your choosing
