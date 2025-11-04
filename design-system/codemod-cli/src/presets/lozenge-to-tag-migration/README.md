# Lozenge to Tag Migration Codemod

This codemod migrates Lozenge components with `isBold={false}` or without the `isBold` prop to Tag
components, establishing a clear visual hierarchy where Lozenges are used for high-prominence status
indicators and Tags for lower-prominence categorization.

## What it does

### 1. Migrates specific Lozenge variants to Tag

**Migrated:**

- `<Lozenge />` (without isBold prop)
- `<Lozenge isBold={false} />`

**NOT Migrated:**

- `<Lozenge isBold />` (boolean prop)
- `<Lozenge isBold={true} />`

```tsx
// Before
<Lozenge appearance="success">Success</Lozenge>
<Lozenge isBold={false} appearance="default">Subtle</Lozenge>

// After
<Tag text="Success" color="lime" />
<Tag text="Subtle" color="standard" />
```

### 2. Maps appearance to color values

| Lozenge appearance | Tag color  |
| ------------------ | ---------- |
| `success`          | `lime`     |
| `default`          | `standard` |
| `removed`          | `red`      |
| `inprogress`       | `blue`     |
| `new`              | `purple`   |
| `moved`            | `orange`   |

### 3. Converts children to text prop

```tsx
// Before
<Lozenge appearance="success">Success Status</Lozenge>

// After
<Tag text="Success Status" color="lime" />
```

### 4. Removes incompatible props

- **`isBold={false}`**: Removed (not needed in Tag)
- **`maxWidth`**: Removed with TODO comment (Tag doesn't support this)

### 5. Adds import for Tag component

```tsx
// Automatically adds when needed
import Tag from '@atlaskit/tag';
```

## Warnings and manual review

### Dynamic isBold values

For dynamic `isBold` props, the codemod adds a warning without migrating:

```tsx
// Before
<Lozenge isBold={shouldBeBold} appearance="success">Dynamic</Lozenge>

// After (with warning comment)
/* TODO: This Lozenge has a dynamic isBold prop. Please manually review... */
<Lozenge isBold={shouldBeBold} appearance="success">Dynamic</Lozenge>
```

### Style prop

Components with `style` props are migrated but include a warning:

```tsx
// After migration (with warning)
/* TODO: This Tag component has a style prop that was kept during migration... */
<Tag text="Styled" color="lime" style={{ backgroundColor: 'red' }} />
```

### Unknown appearance values

Invalid appearance values get a warning:

```tsx
/* TODO: This Tag component uses an unknown appearance value "custom"... */
<Tag text="Custom" color="custom" />
```

## Usage

```bash
# From the platform directory
npx @atlaskit/codemod-cli --preset lozenge-to-tag-migration [target-path]

# Examples:
npx @atlaskit/codemod-cli --preset lozenge-to-tag-migration src/
npx @atlaskit/codemod-cli --preset lozenge-to-tag-migration src/components/MyComponent.tsx
```

## What you need to do after running the codemod

1. **Review TODO comments**: Address any warnings about dynamic props, styles, or unknown values

2. **Test visual appearance**: Verify that migrated Tags have the expected visual prominence

3. **Update tests**: Test IDs and component references may need updates

4. **Check accessibility**: Ensure migrated components maintain proper accessibility

## Design rationale

This migration establishes a clear visual hierarchy:

- **Lozenge** (`isBold={true}` or `isBold`): High-prominence filled backgrounds for status and
  important metadata that should draw attention
- **Tag** (migrated from `isBold={false}` variants): Lower-prominence outlined styles for
  categorization and supporting information

## Files that will be transformed

The codemod only transforms files that:

- Import Lozenge from `@atlaskit/lozenge`
- Use Lozenge components without `isBold` or with `isBold={false}`

Files without Lozenge imports or only using bold Lozenges will remain unchanged.
