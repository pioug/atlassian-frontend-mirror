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

## Deprecated imports entries in the default deprecated.json file

The deprecated imports entry contains the following fields:

- `packagePath`, which is the name of the package. For example: `@atlaskit/navigation-next` and `@atlaskit/navigation`.
  With the package path as the key, you can either provide the values as:
  - `message`**(optional)**, the message to display when the deprecated packages path is used. For example: `multi-select is deprecated. Please use '@atlaskit/select' instead.`
    Or as:
  - `imports`, which is an array of named imports to be deprecated. Each named import has the following fields:
    - `importName`, which is the name of the import to be deprecated. For example: `assistive` and `visuallyHidden`.
    - `message`**(optional)**, which is the message to display when the deprecated import is used. For example: `The assistive mixin is deprecated. Please use `@atlaskit/visually-hidden` instead.`.

Rules may come with fixers to assist.
For individual rules see the [`rules`](./src/rules) folder,
however its strongly recommended to use the rules as above.
You can read more about configuring eslint in their [documentation](https://eslint.org/docs/user-guide/configuring).
