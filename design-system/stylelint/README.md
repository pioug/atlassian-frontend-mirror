# Design System Stylelint Plugin

This plugin contains rules that should be used when working with the [Atlassian Design System](https://atlassian.design).

## Installation

```sh
yarn add @atlaskit/stylelint-design-system -D
```

## Usage

Add the plugin to your Stylelint configuration file.

```diff
// .stylelintrc.js

module.exports = {
  plugins: [
+    '@atlaskit/stylelint-design-system',
  ],
};
```

Enable any desired rules.

```diff
module.exports = {
  rules: {
+    'design-system/ensure-design-token-usage': { color: true, spacing: true },
+    'design-system/no-deprecated-design-token-usage': true,
+    'design-system/no-unsafe-design-token-usage': [true, { shouldEnsureFallbackUsage: true }]
  },
};
```

Rules will come with fixers where possible.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring Stylelint in their [documentation](https://stylelint.io/user-guide/configure).

## Limitations

- This plugin has been tested and confirmed working with Stylelint versions 8.0.0 → 14.6.0.
- The [VS Code Stylelint plugin](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) no longer supports Stylelint versions 13.x and below. It currently still seems to work but use with caution.
- Due to Stylelint limitations, autofix can not be applied to problems individually. Instead autofixing needs to process an entire file, either by using the through VS Code Stylelint plugin command `Stylelint: Fix all auto-fixable Problems` or using command line `npx stylelint path/to/file --fix`
- Due to Stylelint limitations, each problem will only be "squiggly underlined" on the first character. Stylelint does not provide a character range of the problem to the VS Code plugin.
