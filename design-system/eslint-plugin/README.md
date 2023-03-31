# Design System ESLint Plugin

This plugin contains rules that should be used when working with the [Atlassian Design System](https://atlassian.design).

## Installation

```sh
yarn add @atlaskit/eslint-plugin-design-system -D
```

## Usage

Add the plugin to your `.eslintrc.js` file.

```diff
module.exports = {
  plugins: [
+    '@atlaskit/design-system',
  ],
};
```

Extend the configuration file.

```diff
module.exports = {
  extends: [
+    'plugin:@atlaskit/design-system/recommended',
  ],
};
```

Enable any desired rules.

```diff
module.exports = {
  rules: {
+    '@atlaskit/design-system/ensure-design-token-usage': ['error', { 'shouldEnsureFallbackUsage': true }],
+    '@atlaskit/design-system/no-deprecated-design-token-usage': 'warn',
+    '@atlaskit/design-system/no-unsafe-design-token-usage': ['error', { 'shouldEnsureFallbackUsage': true }],
+    '@atlaskit/design-system/use-visually-hidden': 'error',
+    '@atlaskit/design-system/no-deprecated-imports': 'error',
+    '@atlaskit/design-system/no-deprecated-api': 'error',
    }
  }
};
```

## Usage of '@atlaskit/design-system/no-deprecated-api'

You can use the `@atlaskit/design-system/no-deprecated-api` rule to check for deprecated API usage in your codebase. The rule can take one option - `deprecatedConfig`, if not provided, the rule will use the default config file. If provided, the rule will override the default config file and use the config file provided.
See the examples below:
[Usage with default deprecated APIs config](###Usage-with-default-deprecated-APIs-config)
[Overwrite default deprecated APIs config](###Overwrite-default-deprecated-APIs-config)

### Default deprecated APIs config

The default config containing the deprecated APIs config for this rule. You can import the default config file from `@atlaskit/eslint-plugin-design-system`.

```js
import { configs } from '@atlaskit/eslint-plugin-design-system';
const { deprecatedConfig } = configs;
```

In the default config file you can find the following fields:

- `deprecatedAPI`, which is the deprecated props. Each prop has the following fields:

  - `moduleSpecifier`, which is the module specifier of the package in which the prop was deprecated. For example: `@atlaskit/button`.
  - `namedSpecifier`**(optional)**, which is an array of named specifiers of the package in which the prop was deprecated. For example: `Button`.
  - `actionableVersion`**(optional)**, which is the version of the package in which the prop can be actioned on. For example: `1.0.0`.

### Usage with default deprecated APIs config

Enable the rule as other rules if you want to use the default deprecated APIs config. The rule will automatically load the default config file and use it.

Enable the rule in your `.eslintrc.js` file:

```js
rules: {
  '@atlaskit/design-system/no-deprecated-api': 'error'
}
```

### Overwrite default deprecated APIs config

You can overwrite the default deprecated APIs to suits your needs. You can do this by providing the `deprecatedConfig` option to the rule. The option can be partial of the default config file, or a new config that contatins the required fields described in the [Default deprecated APIs config](###Default-deprecated-APIs-config) section.

The plugin also provides a `filterActionableDeprecations` util function that accepts the `deprecated APIs config` and `your root package.json` as params, and will filter the default deprecated APIs config based on the package versions listed in the package.json file, and return a list of actionable entries.
Example:

```js
import { configs } from '@atlaskit/eslint-plugin-design-system';
import packageJson from '.path-to/package.json';

rules: {
  '@atlaskit/design-system/no-deprecated-api': ['error', {
    'deprecatedConfig': filterActionableDeprecations(configs.deprecatedConfig, JSON.parse(packageJson)),
  }]
}
```

## Deprecated imports enries in the default deprecated.json file

The deprecated imports entry contains the following fields:

- `packagePath`, which is the name of the package. For example: `@atlaskit/navigation-next` and `@atlaskit/navigation`.
  With the package path as the key, you can either provide the values as:
  - `message`**(optional)**, the message to display when the deprecated packages path is used. For example: `multi-select is deprecated. Please use '@atlaskit/select' instead.`
    Or as:
  - `imports`, which is an array of named imports to be deprecated. Each named import has the following fields:
    - `importName`, which is the name of the import to be deprecated. For example: `assistive` and `visuallyHidden`.
    - `message`**(optional)**, which is the message to display when the deprecated import is used. For example: `The assistive mixin is deprecated. Please use `@atlaskit/visually-hidden` instead.`.

Rules may come with fixers to assist.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring eslint in their [documentation](https://eslint.org/docs/user-guide/configuring).
