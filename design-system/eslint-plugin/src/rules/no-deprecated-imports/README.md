# @atlaskit/eslint-plugin-design-system/no-deprecated-imports

Ensures usage of up-to-date Atlassian Design System dependencies.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import Item from '@atlaskit/item';
                          ^^^^
```

```js
import GlobalNav from '@atlaskit/global-navigation';
                          ^^^^
```

👍 Example of **correct** code for this rule:

```js
import Modal from '@atlaskit/modal-dialog';
```

```js
import { ButtonItem } from '@atlaskit/menu';
```
