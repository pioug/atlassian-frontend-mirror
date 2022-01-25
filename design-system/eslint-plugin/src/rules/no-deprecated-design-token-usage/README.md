# @atlaskit/eslint-plugin-design-system/no-deprecated-design-token-usage

Will catch deprecated token usage and autofix a replacement.

It's recommended to set this rule to "warn" on error to allow for new and old tokens to exist side-by-side for the duration of the deprecation period and avoid big-bang migrations.

Once the deprecation period is over for a token, it will be moved into `deleted` state, at which point the counterpart of this rule `eslint-plugin-design-system/no-unsafe-design-token-usage` will begin to throw errors.

Run `eslint --fix` will automatically apply replacement tokens.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import { token } from '@atlaskit/tokens';

css({
  color: token('i.am.deprecated'), // 👎
});
```

```js
css({
  color: token('i.am.a.token'), // 👍
})
```
