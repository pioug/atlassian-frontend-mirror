# @atlaskit/eslint-plugin-design-system/no-unsafe-design-token-usage

Ensures usages of the `token` function are done correctly, that up-to-date token names are being used, and that the resulting `var(--some-token)` statements aren't being used. This ruleset is great for codebases that have already adopted tokens.

## Examples

👎 Example of **incorrect** code for this rule:

```js
const textColor = 'red';

css({
  color: textColor,
         ^^^^^^^^^
});
```

```js
css({
  boxShadow: '0px 1px 1px var(--ds-accent-subtleBlue)',
                          ^^^^^^^^^^^^^^^^^^^^^^^^^^
})
```

👍 Example of **correct** code for this rule:

```js
import { token } from '@atlaskit/tokens';

css({
  boxShadow: token('elevation.shadow.card'),
});
```

```js
import { token } from '@atlaskit/tokens';

css`
  color: ${(token('color.text.highemphasis'), N20)};
`;
```
