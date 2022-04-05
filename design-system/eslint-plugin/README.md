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
+    '@atlaskit/design-system/no-deprecated-api-usage': 'error'
    }
  }
};
```

Rules will where possible come with fixers.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring eslint in their [documentation](https://eslint.org/docs/user-guide/configuring).
