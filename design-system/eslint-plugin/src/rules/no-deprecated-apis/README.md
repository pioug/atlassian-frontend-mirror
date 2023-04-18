# @atlaskit/eslint-plugin-design-system/no-deprecated-api-usage

Ensures usage of up-to-date Atlassian Design System API usage.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import { ButtonItem } from '@atlaskit/menu';

const Element = () => (
  <ButtonItem cssFn={cssFn()} />
              ^^^^
);
```

```js
import Drawer from '@atlaskit/drawer';

const Element = () => (
  <Drawer overrides={overrides} />
          ^^^^^^^^^
);
```

👍 Example of **correct** code for this rule:

```js
import { SomeElement } from 'some-other-library';

const Element = () => <SomeElement cssFn={cssFn()} />;
```

```js
import { ButtonItem } from '@atlaskit/menu';

const Element = () => <ButtonItem />;
```

```js
import Drawer from '@atlaskit/drawer';

const Element = () => <Drawer />;
```

## Usage

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
