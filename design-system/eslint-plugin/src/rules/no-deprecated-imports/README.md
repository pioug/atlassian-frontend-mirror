# @atlaskit/eslint-plugin-design-system/no-deprecated-imports

Ensures usage of up-to-date Atlassian Design System dependencies.

## Examples

👎 Example of **incorrect** code for this rule:

```ts
import Item from '@atlaskit/item';
                  ^^^^^^^^^^^^^^
```

```ts
import GlobalNav from '@atlaskit/global-navigation';
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

👍 Example of **correct** code for this rule:

```ts
import Modal from '@atlaskit/modal-dialog';
```

```ts
import { ButtonItem } from '@atlaskit/menu';
```
