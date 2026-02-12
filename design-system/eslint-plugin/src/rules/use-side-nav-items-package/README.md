## Examples

This rule raises a violation for usages of `@atlaskit/navigation-system/side-nav-items/*` or for
importing side-nav item names from the root `@atlaskit/navigation-system` barrel. This is to assist
with the migration to the dedicated package `@atlaskit/side-nav-items`.

### Incorrect

```jsx
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { ButtonMenuItem, MenuList } from '@atlaskit/navigation-system';
```

### Correct

```jsx
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { Main, Root } from '@atlaskit/navigation-system';
import { ButtonMenuItem, MenuList } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
```
