# Tag to New Tag Migration

This codemod migrates `@atlaskit/tag` components to the new Tag and AvatarTag API.

## Overview

This codemod migrates the old Tag component API to the new Tag/AvatarTag API, handling various
import patterns and transforming components based on whether they contain an Avatar.

## Import Detection

The codemod recognizes the following Tag import patterns:

- `import Tag from '@atlaskit/tag'` → RemovableTag (default behavior)
- `import { RemovableTag } from '@atlaskit/tag'` → RemovableTag
- `import { SimpleTag } from '@atlaskit/tag'` → SimpleTag
- `import RemovableTag from '@atlaskit/tag/removable-tag'` → RemovableTag
- `import SimpleTag from '@atlaskit/tag/simple-tag'` → SimpleTag

## Transformation Rules

### 1. Tags with Avatar in elemBefore → AvatarTag

For Tag components that have an Avatar from `@atlaskit/avatar` as the only child in the `elemBefore`
prop:

**Transforms:**

- Component name: `Tag` → `AvatarTag`
- Import: Add `import { AvatarTag } from '@atlaskit/tag'`
- Prop `elemBefore` → `avatar`
- Avatar is converted to render props:
  `(avatarProps) => <Avatar {...avatarProps} ...originalProps />`
- `appearance` prop → removed
- `color` prop → removed
- If original was SimpleTag: add `isRemovable={false}`

**Before:**

```tsx
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

<Tag
	appearance="rounded"
	color="greyLight"
	text="John Doe"
	elemBefore={<Avatar src="user.jpg" />}
/>;
```

**After:**

```tsx
import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

<AvatarTag text="John Doe" avatar={(avatarProps) => <Avatar {...avatarProps} src="user.jpg" />} />;
```

### 2. All Other Tags → Tag (default import)

For Tag components without an Avatar in `elemBefore`, or with non-Avatar content:

**Transforms:**

- Import: Change to `import Tag from '@atlaskit/tag'`
- Component name: Normalized to `Tag`
- `appearance` prop → removed
- `color` prop values migrated using COLOR_MAP (see below)
- If color value cannot be mapped: Add TODO comment for manual migration
- If original was SimpleTag: add `isRemovable={false}`

**Before:**

```tsx
import { SimpleTag } from '@atlaskit/tag';

<SimpleTag appearance="rounded" color="blueLight" text="Label" />;
```

**After:**

```tsx
import Tag from '@atlaskit/tag';

<Tag color="blue" text="Label" isRemovable={false} />;
```

### 3. Color Migrations

The codemod migrates color values as follows:

- `limeLight` → `lime`
- `orangeLight` → `orange`
- `magentaLight` → `magenta`
- `greenLight` → `green`
- `blueLight` → `blue`
- `redLight` → `red`
- `purpleLight` → `purple`
- `greyLight` → `gray` (note: spelling change)
- `tealLight` → `teal`
- `yellowLight` → `yellow`
- `grey` → `gray` (spelling change)

Valid colors that don't need migration:

- `lime`, `orange`, `magenta`, `green`, `blue`, `red`, `purple`, `gray`, `teal`, `yellow`,
  `standard`

For custom/unknown color values, the codemod adds a TODO comment for manual migration.

### 4. Import Updates

The codemod automatically updates and consolidates imports:

**Before:**

```tsx
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';

<div>
	<Tag elemBefore={<Avatar src="user.jpg" />} text="User" />
	<Tag text="Label" color="blueLight" />
</div>;
```

**After:**

```tsx
import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';
import { AvatarTag } from '@atlaskit/tag';

<div>
	<AvatarTag avatar={(avatarProps) => <Avatar {...avatarProps} src="user.jpg" />} text="User" />
	<Tag text="Label" color="blue" />
</div>;
```

## Edge Cases Handled

1. **Renamed imports**: Preserves custom import names during transformation
2. **Multiple Tag types in same file**: Correctly handles mix of RemovableTag and SimpleTag
3. **Custom Avatar components**: Only migrates if Avatar is from '@atlaskit/avatar'
4. **Mixed usage**: File can have both AvatarTag and regular Tag instances
5. **Dynamic color values**: Leaves unchanged if not in COLOR_MAP and not a valid color
6. **elemBefore with non-Avatar content**: Keeps as regular Tag with elemBefore prop
7. **Existing render props**: If Avatar is already a function, leaves it unchanged

## Import Management

The codemod:

1. Removes all old Tag imports (from main entry point and sub-entry points)
2. Adds new imports in the following order (after Avatar import if present):
   - `import Tag from '@atlaskit/tag'` (if needed)
   - `import { AvatarTag } from '@atlaskit/tag'` (if needed)

## Usage

```bash
npx @atlaskit/codemod-cli --preset tag-to-newTag-migration [target]
```

## Manual Review Needed

After running this codemod:

1. **Dynamic color values**: If you use dynamic color values (e.g., `color={someVariable}`), ensure
   they're updated to use the new color names.

2. **Custom Avatar components**: The codemod only recognizes Avatar components imported from
   `@atlaskit/avatar`. If you have a custom Avatar component, it won't be detected and won't trigger
   the migration to AvatarTag.

3. **Custom/unknown color values**: Look for TODO comments added by the codemod where color values
   couldn't be automatically migrated.

4. **Test your changes**: Verify that the visual appearance and behavior of your tags remain as
   expected, especially for AvatarTag components with the new render props pattern.

## Notes

- This codemod only migrates Tags with Avatar in `elemBefore` to AvatarTag when the Avatar is
  imported from `@atlaskit/avatar`
- The `appearance` prop is removed from all Tag components as it's no longer supported
- The `color` prop is removed from AvatarTag components
- The `isRemovable` prop is automatically added based on import type:
  - Default import or `RemovableTag` → no prop needed (default is true)
  - `SimpleTag` → `isRemovable={false}`
- Works with imports from all entry points: `@atlaskit/tag`, `@atlaskit/tag/removable-tag`,
  `@atlaskit/tag/simple-tag`
- Handles renamed imports correctly
- Avatar components are converted to render props to allow proper prop spreading
