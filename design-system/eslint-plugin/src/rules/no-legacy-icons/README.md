Icons are being updated with new designs, a simplified set of available icons and sizes, as well as
more consistent padding and spacing.

The new icon components allows your components to align with the new visual language - either by
default, or when enabled via a feature flag.

## Examples

This rule identifies usages of legacy icons from `@atlaskit/icon/glyph` and `@atlaskit/icon-object`,
that aren't yet migrated to the new icon API. Legacy icons are only permitted when passed into a new
"core" or "utility" icon from `@atlaskit/icon` or `@atlassian/icon-lab`, via the
`LEGACY_fallbackIcon` prop.

### Incorrect

```js
import ActivityIcon from '@atlaskit/icon/glyph/activity'
                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ legacy icon import

import { IconButton } from '@atlaskit/button/new'

<ActivityIcon label="Activity">
^^^^^^^^^^^^^^^^^^^^^^^ legacy icon

<IconButton icon={ActivityIcon} label="Activity"/>
                  ^^^^^^^^^^^^^ legacy icon
```

### Correct

```js
import AddIcon from '@atlaskit/icon/core/add';
import { IconButton } from '@atlaskit/button/new';

<AddIcon label="" />;
<IconButton
	icon={(iconProps) => <AddIcon LEGACY_fallbackIcon={AddIconLegacy} {...iconProps} />}
	label="Add to Cart"
/>;
```
