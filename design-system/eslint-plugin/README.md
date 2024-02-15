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

<!-- START_RULE_TABLE_CODEGEN -->
<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->

| Rule                                                                                                              | Description                                                                                                                                                                                                                                                                                                         | Recommended | Fixable | Suggestions |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- | ----------- |
| <a href="./src/rules/consistent-css-prop-usage/README.md">consistent-css-prop-usage</a>                           | Ensures consistency with `css` and `xcss` prop usages                                                                                                                                                                                                                                                               | Yes         | Yes     |             |
| <a href="./src/rules/ensure-design-token-usage/README.md">ensure-design-token-usage</a>                           | Enforces usage of design tokens rather than hard-coded values.                                                                                                                                                                                                                                                      | Yes         | Yes     | Yes         |
| <a href="./src/rules/ensure-design-token-usage-preview/README.md">ensure-design-token-usage/preview</a>           | Enforces usage of pre-release design tokens rather than hard-coded values.                                                                                                                                                                                                                                          |             | Yes     | Yes         |
| <a href="./src/rules/icon-label/README.md">icon-label</a>                                                         | Enforces accessible usage of icon labels when composed with Atlassian Design System components.                                                                                                                                                                                                                     | Yes         | Yes     |             |
| <a href="./src/rules/local-cx-xcss/README.md">local-cx-xcss</a>                                                   | Ensures the cx() function, which is part of the XCSS API, is only used within the xcss prop. This aids tracking what styles are applied to a jsx element.                                                                                                                                                           | Yes         |         |             |
| <a href="./src/rules/no-banned-imports/README.md">no-banned-imports</a>                                           | Disallow importing banned modules.                                                                                                                                                                                                                                                                                  | Yes         |         |             |
| <a href="./src/rules/no-css-tagged-template-expression/README.md">no-css-tagged-template-expression</a>           | Disallows any `css` tagged template expressions that originate from Emotion, Styled Components or Compiled                                                                                                                                                                                                          |             | Yes     |             |
| <a href="./src/rules/no-deprecated-apis/README.md">no-deprecated-apis</a>                                         | Disallow using deprecated APIs.                                                                                                                                                                                                                                                                                     | Yes         |         |             |
| <a href="./src/rules/no-deprecated-design-token-usage/README.md">no-deprecated-design-token-usage</a>             | Disallow using deprecated design tokens.                                                                                                                                                                                                                                                                            | Yes         | Yes     |             |
| <a href="./src/rules/no-deprecated-imports/README.md">no-deprecated-imports</a>                                   | Disallow importing deprecated modules.                                                                                                                                                                                                                                                                              | Yes         |         |             |
| <a href="./src/rules/no-empty-styled-expression/README.md">no-empty-styled-expression</a>                         | Forbids any styled expression to be used when passing empty arguments to styled.div() (or other JSX elements).                                                                                                                                                                                                      | Yes         |         |             |
| <a href="./src/rules/no-exported-css/README.md">no-exported-css</a>                                               | Forbid exporting `css` function calls. Exporting `css` function calls can result in unexpected behaviour at runtime, and is not statically analysable.                                                                                                                                                              | Yes         |         |             |
| <a href="./src/rules/no-exported-keyframes/README.md">no-exported-keyframes</a>                                   | Forbid exporting `keyframes` function calls. Exporting `css` function calls can result in unexpected behaviour at runtime, and is not statically analysable.                                                                                                                                                        | Yes         |         |             |
| <a href="./src/rules/no-invalid-css-map/README.md">no-invalid-css-map</a>                                         | Checks the validity of a CSS map created through cssMap. This is intended to be used alongside TypeScript's type-checking.                                                                                                                                                                                          | Yes         |         |             |
| <a href="./src/rules/no-margin/README.md">no-margin</a>                                                           | Disallow using the margin CSS property.                                                                                                                                                                                                                                                                             |             |         |             |
| <a href="./src/rules/no-nested-styles/README.md">no-nested-styles</a>                                             | Disallows use of nested styles in `css` functions.                                                                                                                                                                                                                                                                  | Yes         |         |             |
| <a href="./src/rules/no-physical-properties/README.md">no-physical-properties</a>                                 | Disallow physical properties and values in `css` function calls.                                                                                                                                                                                                                                                    |             | Yes     |             |
| <a href="./src/rules/no-unsafe-design-token-usage/README.md">no-unsafe-design-token-usage</a>                     | Enforces design token usage is statically and locally analyzable.                                                                                                                                                                                                                                                   | Yes         | Yes     |             |
| <a href="./src/rules/no-unsafe-style-overrides/README.md">no-unsafe-style-overrides</a>                           | Discourage usage of unsafe style overrides used against the Atlassian Design System.                                                                                                                                                                                                                                | Yes         |         |             |
| <a href="./src/rules/no-unsupported-drag-and-drop-libraries/README.md">no-unsupported-drag-and-drop-libraries</a> | Disallow importing unsupported drag and drop modules.                                                                                                                                                                                                                                                               | Yes         |         |             |
| <a href="./src/rules/prefer-primitives/README.md">prefer-primitives</a>                                           | Increase awareness of primitive components via code hints. Strictly used for education purposes and discoverability. To enforce usage please refer to the `use-primitives` rule.                                                                                                                                    |             |         |             |
| <a href="./src/rules/use-button-group-label/README.md">use-button-group-label</a>                                 | Ensures button groups are described to assistive technology by a direct label or by another element.                                                                                                                                                                                                                | Yes         |         | Yes         |
| <a href="./src/rules/use-drawer-label/README.md">use-drawer-label</a>                                             | Encourages to provide accessible name for Atlassian Design System Drawer component.                                                                                                                                                                                                                                 | Yes         |         | Yes         |
| <a href="./src/rules/use-heading-level-in-spotlight-card/README.md">use-heading-level-in-spotlight-card</a>       | Inform developers of eventual requirement of `headingLevel` prop in `SpotlightCard` component. The heading level should be the appropriate level according to the surrounding context.                                                                                                                              | Yes         | Yes     |             |
| <a href="./src/rules/use-href-in-link-item/README.md">use-href-in-link-item</a>                                   | Inform developers of eventual requirement of `href` prop in `LinkItem` component. Elements with a `link` role require an `href` attribute for users to properly navigate, particularly those using assistive technologies. If no valid `href` is required for your use case, consider using a `ButtonItem` instead. | Yes         | Yes     | Yes         |
| <a href="./src/rules/use-primitives/README.md">use-primitives</a>                                                 | Encourage the usage of primitives components.                                                                                                                                                                                                                                                                       |             | Yes     | Yes         |
| <a href="./src/rules/use-visually-hidden/README.md">use-visually-hidden</a>                                       | Enforce usage of the visually hidden component.                                                                                                                                                                                                                                                                     | Yes         | Yes     |             |

<!-- END_RULE_TABLE_CODEGEN -->
