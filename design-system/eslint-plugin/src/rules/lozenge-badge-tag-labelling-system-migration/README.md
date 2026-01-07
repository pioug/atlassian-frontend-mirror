This rule helps migrate deprecated `<Lozenge>` usages to the new API or `<Tag>` component, migrate
`<Badge>` component appearance prop to new semantic values, and migrate `<SimpleTag>` and
`<RemovableTag>` components to the new `<Tag>` or `<avatarTag>` components as part of the Labelling
System Phase 1 migration.

## Examples

### Incorrect

```tsx
// Non-bold Lozenge variants should migrate to Tag
<Lozenge isBold={false} />
<Lozenge /> // no isBold means implicit false

// Dynamic isBold expressions require manual review
<Lozenge isBold={someVariable} />
<Lozenge isBold={condition ? true : false} />

// Badge: Old appearance values that need migration
<Badge appearance="added">{5}</Badge>
<Badge appearance="removed">{10}</Badge>
<Badge appearance="default">{3}</Badge>
<Badge appearance="primary">{7}</Badge>
<Badge appearance="primaryInverted">{2}</Badge>
<Badge appearance="important">{99}</Badge>

// Badge: Dynamic appearance expressions require manual review
<Badge appearance={getStatus()}>{count}</Badge>
<Badge appearance={condition ? 'added' : 'removed'}>{num}</Badge>

// SimpleTag/RemovableTag: Old tag components that need migration
<SimpleTag>Hello</SimpleTag>
<SimpleTag color="blueLight">Hello</SimpleTag>
<SimpleTag elemBefore={<Avatar src="x" />}>Hello</SimpleTag>
<RemovableTag color="redLight">Hello</RemovableTag>
<RemovableTag elemBefore={<Avatar />}>Hello</RemovableTag>

// SimpleTag/RemovableTag from subpaths: Also need migration
import SimpleTag from '@atlaskit/tag/simple-tag';
<SimpleTag color="blueLight">Hello</SimpleTag>

import RemovableTag from '@atlaskit/tag/removable-tag';
<RemovableTag color="redLight">Hello</RemovableTag>
```

### Correct

```tsx
// Non-bold variants should use Tag component with appearance prop
<Tag appearance="success" />
<Tag appearance="default" />

// Bold Lozenge variants can stay as Lozenge
<Lozenge isBold />
<Lozenge isBold={true} />
<Lozenge appearance="success" isBold />

// Badge: New semantic appearance values
<Badge appearance="success">{5}</Badge>
<Badge appearance="danger">{10}</Badge>
<Badge appearance="neutral">{3}</Badge>
<Badge appearance="information">{7}</Badge>
<Badge appearance="inverse">{2}</Badge>
<Badge appearance="danger">{99}</Badge>

// Badge: Already using semantic values
<Badge appearance="success">{42}</Badge>

// SimpleTag/RemovableTag: Migrate to Tag component
import Tag from '@atlaskit/tag';
<Tag>Hello</Tag>
<Tag color="blue" isRemovable={false}>Hello</Tag>

// SimpleTag/RemovableTag: Migrate to AvatarTag with render props
import { AvatarTag } from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';
<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>

// SimpleTag/RemovableTag from subpaths: Also migrate to main module
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';
<Tag color="blue" isRemovable={false}>Hello</Tag>
<AvatarTag avatar={(props) => <Avatar {...props} />}>Hello</AvatarTag>
```

## Rule Details

This rule enforces multiple migration patterns:

1. **Migrate `isBold={false}` or missing `isBold` → `<Tag />`**: Detects non-bold Lozenge variants
   and suggests migrating to the Tag component, preserving other props including the `appearance`
   prop with its value.

2. **Warn on dynamic `isBold` expressions**: Detects dynamic `isBold` props that cannot be safely
   auto-fixed and require manual review.

3. **Migrate Badge appearance values**: Detects Badge components using old appearance values and
   migrates them to new semantic values.

4. **Warn on dynamic Badge appearance expressions**: Detects dynamic `appearance` props on Badge
   components that cannot be safely auto-fixed and require manual review.

5. **Migrate SimpleTag/RemovableTag to Tag**: Detects SimpleTag and RemovableTag components (from
   named imports or subpaths) and migrates them to the new Tag component, updating imports and
   handling color prop mapping.

6. **Migrate SimpleTag/RemovableTag with Avatar to AvatarTag**: Detects SimpleTag and RemovableTag
   components that use an Avatar component in the `elemBefore` prop and migrates them to the new
   `AvatarTag` component with render props pattern: `avatar={(props) => <Avatar {...props} />}`.
   Removes `appearance` and `color` props from AvatarTag migrations.

7. **Handle subpath imports**: Detects default imports from `@atlaskit/tag/simple-tag` and
   `@atlaskit/tag/removable-tag` and migrates them to the main `@atlaskit/tag` module with the
   appropriate component (Tag or AvatarTag).

8. **Handle default Tag imports**: Detects default imports from `@atlaskit/tag` (old RemovableTag)
   and checks if they need migration. If nothing needs migration, treats them as the new Tag
   component.

## Flowcharts

### Tag Migration Flowchart (SimpleTag/RemovableTag/Tag)

```
┌─────────────────────────────────────────────────────────────┐
│         Tag Migration (SimpleTag/RemovableTag/Tag)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Is default   │
                    │  Tag import   │
                    │  from         │
                    │  @atlaskit/   │
                    │  tag?         │
                    └───────┬───────┘
                            │
                ┌───────────┴───┐
                │               │
            YES │               │ NO
                │               │
                ▼               │
        ┌───────────────┐       │
        │ Check if      │       │
        │ already new   │       │
        │ Tag (nothing  │       │
        │ to migrate)   │       │
        └───────┬───────┘       │
                │               │
        ┌───────┴───────┐       │
        │               │       │
    YES │               │ NO    │
        │               │       │
        ▼               ▼       ▼
┌───────────────┐ ┌───────────────┐
│   SKIP        │ │  Check        │
│  (Already     │ │  elemBefore   │
│   migrated)   │ │  for Avatar   │
└───────────────┘ └───────┬───────┘
                          │
                  ┌───────┴───────┐
                  │               │
              YES │               │ NO
                  │               │
                  ▼               ▼
          ┌───────────────┐ ┌───────────────┐
          │ Migrate to    │ │ Migrate to    │
          │ AvatarTag     │ │ Tag           │
          │ - Convert     │ │ - Map colors  │
          │   elemBefore  │ │ - Add         │
          │   to avatar   │ │   isRemovable │
          │   render prop │ │   ={false}    │
          │ - Remove      │ │   (if         │
          │   appearance/ │ │   SimpleTag)  │
          │   color       │ │ - Update      │
          │               │ │   imports     │
          └───────────────┘ └───────────────┘
```

### Badge Migration Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                    Badge Migration                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Has          │
                    │  appearance   │
                    │  prop?        │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
            YES │                       │ NO
                │                       │
                ▼                       ▼
        ┌───────────────┐      ┌───────────────┐
        │  Is dynamic?  │      │   SKIP        │
        │  (variable/   │      │  (no          │
        │   expression) │      │   migration   │
        └───────┬───────┘      │   needed)     │
                │              └───────────────┘
        ┌───────┴───────┐
        │               │
    YES │               │ NO
        │               │
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│ Report        │ │ Map & fix     │
│ warning       │ │ appearance    │
│ (manual       │ │ value:        │
│  review)      │ │ - added →     │
│               │ │   success     │
│               │ │ - removed →   │
│               │ │   danger      │
│               │ │ - default →   │
│               │ │   neutral     │
│               │ │ - primary →   │
│               │ │   information │
│               │ │ - primaryIn   │
│               │ │   verted →    │
│               │ │   inverse     │
│               │ │ - important → │
│               │ │   danger      │
└───────────────┘ └───────────────┘
```

### Lozenge Migration Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                    Lozenge Migration                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Check isBold │
                    │  prop         │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│ isBold={false}│  │ No isBold prop │  │ isBold={true} │
│               │  │ (implicit      │  │ OR            │
│               │  │ false)         │  │ isBold        │
│               │  │                │  │ (implicit)    │
└───────┬───────┘  └───────┬────────┘  └───────┬───────┘
        │                  │                   │
        │                  │                   │
        ▼                  ▼                   ▼
┌────────────────────────────┐        ┌───────────────┐
│ Check if                   │        │ Stay as       │
│ appearance is              │        │ Lozenge       │
│ dynamic                    |        │ - Update      │
└───────┬────────────────────┘        │   appearance  │
        │                             │   if needed   │
┌───────┴─────────────────┐           └───────────────┘
│                         │
│ DYNAMIC                 │ NOT DYNAMIC
│                         │
▼                         ▼
┌───────────────┐  ┌───────────────┐
│ Report        │  │ Migrate to    │
│ warning       │  │ Tag           │
│ (manual       │  │ - appearance  │
│  review)      │  │   → color     │
│               │  │ - Map values: │
│               │  │   success →   │
│               │  │   lime        │
│               │  │   default →   │
│               │  │   standard    │
│               │  │   removed →   │
│               │  │   red         │
│               │  │   inprogress  │
│               │  │   → blue      │
│               │  │   new →       │
│               │  │   purple      │
│               │  │   moved →     │
│               │  │   yellow      │
│               │  │ - Remove      │
│               │  │   isBold      │
│               │  │ - Add         │
│               │  │   isRemov     │
│               │  │   able=       │
│               │  │   {false}     │
└───────────────┘  └───────────────┘
```

## Appearance Prop Handling

### Lozenge → Tag Migration

When migrating `<Lozenge>` to `<Tag>`, the `appearance` prop is converted to `color` prop with value
mapping.

### Lozenge Appearance → Tag Color Mapping

When migrating Lozenge to Tag, appearance values are mapped to color values:

| Lozenge Appearance | Tag Color  |
| ------------------ | ---------- |
| `success`          | `lime`     |
| `default`          | `standard` |
| `removed`          | `red`      |
| `inprogress`       | `blue`     |
| `new`              | `purple`   |
| `moved`            | `yellow`   |

**Note**: Dynamic appearance values in Lozenge components require manual review before migration.

### Badge Appearance Value Mapping

Badge components use the following appearance value mapping:

| Old Appearance    | New Appearance |
| ----------------- | -------------- |
| `added`           | `success`      |
| `removed`         | `danger`       |
| `default`         | `neutral`      |
| `primary`         | `information`  |
| `primaryInverted` | `inverse`      |
| `important`       | `danger`       |

### Tag Color Mapping

SimpleTag and RemovableTag color props are mapped to new semantic color values when migrating to
Tag:

| Old Color      | New Color |
| -------------- | --------- |
| `limeLight`    | `lime`    |
| `orangeLight`  | `orange`  |
| `magentaLight` | `magenta` |
| `greenLight`   | `green`   |
| `blueLight`    | `blue`    |
| `redLight`     | `red`     |
| `purpleLight`  | `purple`  |
| `greyLight`    | `gray`    |
| `tealLight`    | `teal`    |
| `yellowLight`  | `yellow`  |
| `grey`         | `gray`    |

## Auto-fixes

- ✅ `isBold={false}` and missing `isBold` migration to `<Tag>` with preserved `appearance` prop
- ✅ Static Badge appearance prop values (e.g., `appearance="added"` → `appearance="success"`)
- ✅ SimpleTag/RemovableTag migration to `<Tag>` with color mapping and import updates
- ✅ SimpleTag/RemovableTag from subpaths (e.g., `@atlaskit/tag/simple-tag`) migration to main
  module
- ✅ SimpleTag/RemovableTag with Avatar migration to `<AvatarTag>` with render props pattern
- ✅ Static Tag color prop mapping (e.g., `color="blueLight"` → `color="blue"`)
- ✅ SimpleTag `isRemovable={false}` prop addition when migrating to Tag
- ✅ Subpath import conversion to main `@atlaskit/tag` module
- ❌ Dynamic `isBold` expressions (warning only)
- ❌ Dynamic Badge appearance expressions (warning only - requires manual review)
