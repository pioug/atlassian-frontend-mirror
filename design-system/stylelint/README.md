# Design System Stylelint Plugin

This plugin contains rules that should be used when working with the [Atlassian Design System](https://atlassian.design).

## Installation

```sh
yarn add @atlaskit/stylelint-design-system -D
```

## Usage

Add the plugin to your `.stylelintrc.js` file.

```diff
module.exports = {
  plugins: [
+    '@atlaskit/stylelint-design-system',
  ],
};
```

Turn on the rules.

```diff
module.exports = {
  rules: {
+    'design-system/ensure-design-token-usage': true,
+    'design-system/no-unsafe-design-token-usage': [true, { shouldEnsureFallbackUsage: true }]
  },
};
```

Rules will where possible come with fixers.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring stylelint in their [documentation](https://stylelint.io/user-guide/configure).
