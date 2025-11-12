This rule helps migrate deprecated `<Lozenge>` usages to the new API or `<Tag>` component as part of
the Labelling System Phase 1 migration.

## Examples

### Incorrect

```tsx
// appearance prop should be renamed to color
<Lozenge appearance="success" />

// Non-bold Lozenge variants should migrate to Tag
<Lozenge isBold={false} />
<Lozenge /> // no isBold means implicit false

// Dynamic isBold expressions require manual review
<Lozenge isBold={someVariable} />
<Lozenge isBold={condition ? true : false} />
```

### Correct

```tsx
// Use color instead of appearance
<Lozenge color="lime" /> // note: success -> lime mapping

// Non-bold variants should use Tag component with mapped colors
<Tag color="lime" /> // success -> lime
<Tag color="standard" /> // default -> standard

// Bold Lozenge variants can stay as Lozenge
<Lozenge isBold />
<Lozenge isBold={true} />
```

## Rule Details

This rule enforces three migration patterns:

1. **Replace `appearance` → `color`**: Detects `<Lozenge appearance="..." />` and replaces the prop
   name with `color` while preserving the value.

2. **Migrate `isBold={false}` or missing `isBold` → `<Tag />`**: Detects non-bold Lozenge variants
   and suggests migrating to the Tag component, preserving other props like text, href, onRemove,
   etc. When migrating to Tag, appearance values are automatically mapped to the correct color
   values.

3. **Warn on dynamic `isBold` expressions**: Detects dynamic `isBold` props that cannot be safely
   auto-fixed and require manual review.

## Appearance to Color Value Mapping

When migrating from `<Lozenge>` to `<Tag>`, the appearance values are automatically mapped to the
correct Tag color values:

| Lozenge `appearance` | Tag `color`  |
| -------------------- | ------------ |
| `"success"`          | `"lime"`     |
| `"default"`          | `"standard"` |
| `"removed"`          | `"red"`      |
| `"inprogress"`       | `"blue"`     |
| `"new"`              | `"purple"`   |
| `"moved"`            | `"orange"`   |

Unknown appearance values will be passed through unchanged.

## Auto-fixes

- ✅ `appearance` prop renaming to `color`
- ✅ `isBold={false}` and missing `isBold` migration to `<Tag>`
- ❌ Dynamic `isBold` expressions (warning only)

## When not to use it

This rule should be disabled if you are not participating in the Labelling System Phase 1 migration
or if you need to maintain backward compatibility with the old Lozenge API.
