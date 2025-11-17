This rule helps migrate deprecated `<Lozenge>` usages to the new API or `<Tag>` component as part of
the Labelling System Phase 1 migration.

## Examples

### Incorrect

```tsx
// Non-bold Lozenge variants should migrate to Tag
<Lozenge isBold={false} />
<Lozenge /> // no isBold means implicit false

// Dynamic isBold expressions require manual review
<Lozenge isBold={someVariable} />
<Lozenge isBold={condition ? true : false} />
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
```

## Rule Details

This rule enforces two migration patterns:

1. **Migrate `isBold={false}` or missing `isBold` → `<Tag />`**: Detects non-bold Lozenge variants
   and suggests migrating to the Tag component, preserving other props including the `appearance`
   prop with its value.

2. **Warn on dynamic `isBold` expressions**: Detects dynamic `isBold` props that cannot be safely
   auto-fixed and require manual review.

## Appearance Prop Handling

Both `<Lozenge>` and `<Tag>` now use the `appearance` prop with new semantic values. The rule will
automatically map old appearance values to the new semantic values when they differ.

### Appearance Value Mapping

The rule includes a mapping function that will update old appearance values to new semantic values:

```tsx
// Example mappings (to be updated with actual semantic values)
'success' → 'success'      // or new semantic equivalent
'default' → 'default'      // or new semantic equivalent
'removed' → 'removed'      // or new semantic equivalent
'inprogress' → 'inprogress' // or new semantic equivalent
'new' → 'new'             // or new semantic equivalent
'moved' → 'moved'         // or new semantic equivalent
```

**Note**: The current implementation preserves existing values. The mapping will be updated once the
new semantic values are finalized.

## Auto-fixes

- ✅ `isBold={false}` and missing `isBold` migration to `<Tag>` with preserved `appearance` prop
- ❌ Dynamic `isBold` expressions (warning only)
