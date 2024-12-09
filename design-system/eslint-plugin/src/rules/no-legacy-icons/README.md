Icons are being updated with new designs, a simplified set of available icons and sizes, as well as
more consistent padding and spacing.

The new icon components allows your components to align with the new visual language - either by
default, or when enabled via a feature flag.

## Examples

This rule identifies usages of legacy icons from `@atlaskit/icon/glyph` that aren't yet migrated to
the new icon API. Legacy icons are only permitted when passed into a new "core" or "utility" icon
from `@atlaskit/icon`, `@atlaskit/icon-lab` or `@atlassian/icon-private`, via the
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

## Options

This rule comes with options to configure which errors display and in what detail - as well as how
icons should be migrated.

### shouldErrorForAutoMigration

Enables/disables errors for icons that are able to be automatically migrated. Defaults to `true`.

### shouldErrorForManualMigration

Enables/disables errors for icons that cannot be be automatically migrated and need manual review.
Defaults to `true`.

### shouldUseSafeMigrationMode

When `true`, the autofixer will only attempt to migrate icons that are visually similar. Defaults to
`false`.

### quiet

When `true`, the rule will only provide one error per icon usage, stating if the icon can be
automatically migrated or not
