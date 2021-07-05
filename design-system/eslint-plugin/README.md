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
+    '@atlaskit/eslint-plugin-design-system',
  ],
};
```

Turn on the rules.

```diff
module.exports = {
  extends: [
+    'plugin:@atlaskit/eslint-plugin-design-system/recommended',
  ],
};
```

Rules will where possible come with fixers.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring eslint in their [documentation](https://eslint.org/docs/user-guide/configuring).
