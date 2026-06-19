This rule helps migrate deprecated `<Lozenge>` props and appearance values to the new API, migrate
`<Badge>` component appearance prop to new semantic values, and migrate `<SimpleTag>` and
`<RemovableTag>` components to the new `<Tag>` or `<AvatarTag>` components as part of the Labelling
System Phase 1 migration.

## Examples

### Incorrect

```tsx
// Lozenge: isBold is deprecated — remove it regardless of value
<Lozenge isBold={false} appearance="success" />
<Lozenge isBold={true} appearance="success" />
<Lozenge isBold appearance="success" />
<Lozenge isBold={someVariable} />

// Lozenge: Old appearance values that need migration to new semantic values
<Lozenge appearance="default">Default</Lozenge>
<Lozenge appearance="inprogress">In Progress</Lozenge>
<Lozenge appearance="moved">Moved</Lozenge>
<Lozenge appearance="removed">Removed</Lozenge>
<Lozenge appearance="new">New</Lozenge>

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
// Lozenge: Use new semantic appearance values (no isBold prop)
<Lozenge appearance="success">Success</Lozenge>
<Lozenge appearance="neutral">Default</Lozenge>
<Lozenge appearance="information">In Progress</Lozenge>
<Lozenge appearance="warning">Moved</Lozenge>
<Lozenge appearance="danger">Removed</Lozenge>
<Lozenge appearance="discovery">New</Lozenge>

// Badge: New semantic appearance values
<Badge appearance="success">{5}</Badge>
<Badge appearance="danger">{10}</Badge>
<Badge appearance="neutral">{3}</Badge>
<Badge appearance="information">{7}</Badge>
<Badge appearance="inverse">{2}</Badge>
<Badge appearance="danger">{99}</Badge>

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

1. **Remove deprecated `isBold` prop from `<Lozenge>`**: The `isBold` prop is deprecated in the
   new Lozenge API. The rule warns and auto-removes it regardless of value (true, false, or
   dynamic). Both bold and subtle variants are now expressed via the `appearance` prop alone.

2. **Migrate Lozenge appearance values to new semantic values**: Detects old appearance values
   (`default`, `inprogress`, `moved`, `removed`, `new`) and auto-fixes them to new semantic values
   (`neutral`, `information`, `warning`, `danger`, `discovery`). The value `success` is unchanged.

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
│               │  │   gray        │
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
│               │  │ - Add         │
│               │  │   migration_  │
│               │  │   fallback=   │
│               │  │   "lozenge"   │
└───────────────┘  └───────────────┘
```

## Appearance Prop Handling

### Lozenge Appearance Value Migration

The new Lozenge API uses semantic color names. Old legacy appearance values are auto-fixed in-place:

| Old Appearance | New Appearance  |
| -------------- | --------------- |
| `default`      | `neutral`       |
| `inprogress`   | `information`   |
| `moved`        | `warning`       |
| `removed`      | `danger`        |
| `new`          | `discovery`     |
| `success`      | `success` (unchanged) |

The `<Lozenge>` component stays as `<Lozenge>` — it no longer migrates to `<Tag>`.

### isBold Prop

The `isBold` prop is **not flagged** by this rule. While the feature flag
`platform-dst-lozenge-tag-badge-visual-uplifts` is OFF, users still need `isBold` to render subtle
Lozenges. Removing it prematurely would break subtle Lozenges in those environments.

Once the feature flag is fully rolled out and the new Lozenge (always bold) is the only variant,
`isBold` cleanup can be handled in a separate codemod pass.

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

- ✅ Lozenge legacy appearance values migrated to new semantic values in-place
  (e.g., `appearance="inprogress"` → `appearance="information"`)
- ✅ Static Badge appearance prop values (e.g., `appearance="added"` → `appearance="success"`)
- ✅ SimpleTag/RemovableTag migration to `<Tag>` with color mapping and import updates
- ✅ SimpleTag/RemovableTag from subpaths (e.g., `@atlaskit/tag/simple-tag`) migration to main
  module
- ✅ SimpleTag/RemovableTag with Avatar migration to `<AvatarTag>` with render props pattern
- ✅ Static Tag color prop mapping (e.g., `color="blueLight"` → `color="blue"`)
- ✅ SimpleTag `isRemovable={false}` prop addition when migrating to Tag
- ✅ Subpath import conversion to main `@atlaskit/tag` module
- ❌ Dynamic Lozenge `appearance` prop values (warning with FIXME comment only)
- ❌ Dynamic Badge appearance expressions (warning only - requires manual review)
