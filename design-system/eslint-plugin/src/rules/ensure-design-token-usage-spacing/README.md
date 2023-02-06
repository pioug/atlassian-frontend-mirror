# @atlaskit/eslint-plugin-design-system/ensure-design-token-usage-spacing

Complement to the `ensure-design-token-usage` rule - but for spacing. Ensures a codebase uses the global `token` function rather than using hard-coded values.
This ruleset is great for codebases that are both starting to adopt tokens, and ones that already have adopted them. It helps new contributors from accidentally adding hard-coded spacing values.

## Examples

👎 Example of **incorrect** code for this rule:

```js
css({
  padding: 'red',
            ^^^
});
```

```js
css({
  margin: gridSize(),
          ^^^^^^^^^
})
```

👍 Example of **correct** code for this rule:

```js
import { token } from '@atlaskit/tokens';

css({
  padding: token('space.100'),
});
```
