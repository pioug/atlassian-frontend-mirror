Using deprecated design tokens is dangerous as they will eventually be deleted after the sunset period.
This rule helps you move to non-deprecated design tokens.

## Examples

This rule will mark usage of deprecated design tokens as violations.

## Incorrect

```js
import { token } from '@atlaskit/tokens';

css({ color: token('i.am.deprecated') });
                    ^^^^^^^^^^^^^^^
css({ color: token('i.am.a.token') });
                    ^^^^^^^^^^^^^
```

## Options

It's recommended to set this rule to "warn" to allow for new and old tokens to exist side-by-side for the duration of the deprecation period and avoid big-bang migrations.

Once the deprecation period is over for a design token it will be moved into `deleted` state at which point the counterpart of this rule `no-unsafe-design-token-usage` will mark violations as errors.

Running `eslint --fix` will automatically apply replacement tokens if present.
