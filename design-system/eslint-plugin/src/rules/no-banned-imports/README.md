# @atlaskit/eslint-plugin-design-system/no-banned-imports

Prevents usage of private or experimental Atlassian Design System packages.

## Examples

👎 Example of **incorrect** code for this rule:

```ts
import noop from '@atlaskit/ds-lib/noop';
                  ^^^^^^^^^^^^^^^^^^^^^
```

```ts
import { Text } from '@atlaskit/ds-explorations';
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```
