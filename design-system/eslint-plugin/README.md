# Design System ESLint Plugin

This plugin contains rules that should be used when working with the [Atlassian Design System](https://atlassian.design).

## Installation

```sh
yarn add @atlaskit/eslint-plugin-design-system -D
```

## Configuration

Use the recommended config to get reasonable defaults recommended by the Atlassian Design System:

```diff
module.exports = {
  extends: [
+    'plugin:@atlaskit/design-system/recommended',
  ],
};
```

We don't recommended maintaining your own configuration.
If you do not use our config you will need to specify individual rules and configuration.
Add the plugin to your `.eslintrc.js` file.

```diff
module.exports = {
  plugins: [
+    '@atlaskit/design-system',
  ],
};
```

Enable the rules that you would like to use.

```diff
module.exports = {
  rules: [
+    '@atlaskit/design-system/no-deprecated-apis': 'error',
  ],
};
```

## Rules

<!-- START_RULE_CODEGEN -->
<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->

| Rule                                                                                                    | Description                                                                                     | Recommended | Fixable | Suggestions |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------- | ------- | ----------- |
| <a href="./src/rules/ensure-design-token-usage/README.md">ensure-design-token-usage</a>                 | Enforces usage of design tokens.                                                                |             | Yes     | Yes         |
| <a href="./src/rules/ensure-design-token-usage-spacing/README.md">ensure-design-token-usage-spacing</a> | Enforces usage of spacing design tokens rather than hard-coded values.                          |             | Yes     |             |
| <a href="./src/rules/icon-label/README.md">icon-label</a>                                               | Enforces accessible usage of icon labels when composed with Atlassian Design System components. | Yes         | Yes     |             |
| <a href="./src/rules/no-banned-imports/README.md">no-banned-imports</a>                                 | Disallow importing banned modules.                                                              | Yes         |         |             |
| <a href="./src/rules/no-deprecated-apis/README.md">no-deprecated-apis</a>                               | Disallow using deprecated APIs.                                                                 | Yes         |         |             |
| <a href="./src/rules/no-deprecated-design-token-usage/README.md">no-deprecated-design-token-usage</a>   | Disallow using deprecated design tokens.                                                        |             | Yes     |             |
| <a href="./src/rules/no-deprecated-imports/README.md">no-deprecated-imports</a>                         | Disallow importing deprecated modules.                                                          | Yes         |         |             |
| <a href="./src/rules/no-margin/README.md">no-margin</a>                                                 | Disallow using the margin CSS property.                                                         |             |         |             |
| <a href="./src/rules/no-unsafe-design-token-usage/README.md">no-unsafe-design-token-usage</a>           | Enforces design token usage is statically and locally analyzable.                               |             | Yes     |             |
| <a href="./src/rules/use-primitives/README.md">use-primitives</a>                                       | Encourage the usage of primitives components.                                                   |             | Yes     |             |
| <a href="./src/rules/use-visually-hidden/README.md">use-visually-hidden</a>                             | Enforce usage of the visually hidden component.                                                 | Yes         | Yes     |             |

<!-- END_CODEGEN -->
