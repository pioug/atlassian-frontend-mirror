# Lozenge to Tag Migration Codemod

This codemod migrates Lozenge components with `isBold={false}` or without the `isBold` prop to Tag
components, establishing a clear visual hierarchy where Lozenges are used for high-prominence status
indicators and Tags for lower-prominence categorization.

## Migration Strategy with Fallback Support

This codemod adds **migration-specific props** to all migrated Tag components to support a gradual,
feature-flag-controlled rollout:

- `migration_fallback="lozenge"` - Tells the Tag component to render as a Lozenge until the feature
  flag is enabled
- `isRemovable={false}` - Ensures Tags are not removable by default (matching Lozenge behavior)

This approach allows Jira teams to migrate their code first, then enable the visual change via
feature flag in the Tag source code, avoiding surprise visual changes during deployment.

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
<Tag text="Success" color="lime" isRemovable={false} migration_fallback="lozenge" />
<Tag text="Subtle" color="standard" isRemovable={false} migration_fallback="lozenge" />
```

**Note:** The `migration_fallback="lozenge"` prop ensures the component renders as a Lozenge until
the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts` is enabled, allowing for gradual
rollout.

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

The codemod intelligently handles different types of children:

#### Simple text children

```tsx
// Before
<Lozenge appearance="success">Success Status</Lozenge>

// After
<Tag text="Success Status" color="lime" isRemovable={false} migration_fallback="lozenge" />
```

#### Variable children

```tsx
// Before
const label = 'Dynamic Label';
<Lozenge appearance="success">{label}</Lozenge>;

// After
const label = 'Dynamic Label';
/* TODO: FIXME: This Tag component uses a variable as the text prop. 
   Please verify that the variable contains a string value. */
<Tag text={label} color="lime" isRemovable={false} migration_fallback="lozenge" />;
```

#### Member expression children

```tsx
// Before
const data = { title: 'Title' };
<Lozenge appearance="success">{data.title}</Lozenge>;

// After
const data = { title: 'Title' };
/* TODO: FIXME: This Tag component uses a variable as the text prop. 
   Please verify that the variable contains a string value. */
<Tag text={data.title} color="lime" isRemovable={false} migration_fallback="lozenge" />;
```

#### Complex JSX children (not migrated)

```tsx
// Before
<Lozenge appearance="success">
  <strong>Bold</strong> text
</Lozenge>

// After (with warning comment)
/* TODO: FIXME: This Tag component has complex children that couldn't be
   automatically migrated to the text prop. */
<Tag color="lime" isRemovable={false} migration_fallback="lozenge" />
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

### Variable and member expression children

When the codemod detects variable or member expression children, it migrates them to the `text` prop
but adds a FIXME comment requesting verification:

```tsx
// ❌ May not work if variable is not a string
<Tag text={unknownVariable} color="lime" isRemovable={false} migration_fallback="lozenge" />;

// ✅ Works because variable is guaranteed to be a string
const label: string = getLabel();
<Tag text={label} color="lime" isRemovable={false} migration_fallback="lozenge" />;
```

**What to do:**

- Verify the variable contains a string value
- If uncertain about type, add TypeScript type annotations
- If not a string, convert the variable before passing to `text` prop

### Complex children

When children cannot be migrated (JSX elements, complex expressions), the codemod:

1. Removes the children
2. Adds a TODO comment explaining the issue
3. Keeps the migrated Tag with color and other props

```tsx
// ❌ Before (complex children)
<Lozenge appearance="success">
  <strong>{title}</strong> - {subtitle}
</Lozenge>

// After (requires manual migration)
/* TODO: This Tag component has complex children... */
<Tag color="lime" isRemovable={false} migration_fallback="lozenge" />
// You need to manually handle the complex content
```

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
<Tag
	text="Styled"
	color="lime"
	style={{ backgroundColor: 'red' }}
	isRemovable={false}
	migration_fallback="lozenge"
/>
```

### Unknown appearance values

Invalid appearance values get a warning:

```tsx
/* TODO: This Tag component uses an unknown appearance value "custom"... */
<Tag text="Custom" color="custom" isRemovable={false} migration_fallback="lozenge" />
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

1. **Review FIXME comments for variables**: Verify that variable and member expression children
   contain string values
   - Check type annotations: `const label: string = ...`
   - If not a string, convert before passing to `text` prop
   - Use `String()` or `.toString()` if needed

2. **Fix TODO comments for complex children**: Manually migrate components with JSX element children
   - Extract text content from complex structures
   - Consider if a simpler component would work better
   - Use a different approach if Tag cannot represent the content

3. **Enable the feature flag when ready**: The migrated Tags will render as Lozenges until you
   enable the `platform-dst-lozenge-tag-badge-visual-uplifts` feature flag, allowing you to:
   - Complete the code migration across your codebase
   - Test thoroughly before any visual changes occur
   - Enable the new visual style in a controlled manner

4. **Clean up migration props later**: After the feature flag is fully rolled out and stable, a
   follow-up codemod can be run to remove the `migration_fallback` and adjust `isRemovable` props as
   needed

5. **Test visual appearance**: Verify that migrated Tags have the expected visual prominence (after
   feature flag is enabled)

6. **Update tests**: Test IDs and component references may need updates

7. **Check accessibility**: Ensure migrated components maintain proper accessibility
   - Variables with aria labels should still be accessible
   - Complex children may have had semantic meaning that needs preserving

## Feature summary

| Feature              | Status                 | Details                                 |
| -------------------- | ---------------------- | --------------------------------------- |
| Simple text children | ✅ Automatic           | Converts to `text` prop                 |
| Variable children    | ✅ Automatic + Warning | Migrates with FIXME comment             |
| Member expressions   | ✅ Automatic + Warning | Supports `data.prop` and nested access  |
| Complex JSX children | ⚠️ Manual              | Keeps TODO comment for manual migration |
| Appearance mapping   | ✅ Automatic           | 6 semantic values mapped to colors      |
| Dynamic appearance   | ✅ Automatic + Warning | Migrates with FIXME comment             |
| Dynamic isBold       | ⚠️ Not migrated        | Adds warning comment only               |
| maxWidth prop        | ✅ Removed + Warning   | Removed with FIXME comment              |
| style prop           | ✅ Preserved + Warning | Kept but with FIXME comment             |
| Other props (testId) | ✅ Preserved           | Transferred to Tag component            |
| Import cleanup       | ✅ Automatic           | Removes Lozenge import if unused        |
| Tag import addition  | ✅ Automatic           | Added when migrations occur             |
| Renamed imports      | ✅ Automatic           | Handles `{ default as Badge }` syntax   |

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

## Common scenarios

### Scenario 1: Simple text - Fully automatic

```tsx
// ✅ No action needed
<Lozenge appearance="success">Status</Lozenge>
→ <Tag text="Status" color="lime" isRemovable={false} migration_fallback="lozenge" />
```

### Scenario 2: Variable text - Review type

```tsx
// ⚠️ Verify the variable is a string
const status = getStatus(); // Make sure this returns a string
<Lozenge>{status}</Lozenge>
→ <Tag text={status} color="standard" isRemovable={false} migration_fallback="lozenge" /> /* FIXME: Verify... */
```

### Scenario 3: Complex JSX - Manual migration

```tsx
// ❌ Requires manual work
<Lozenge appearance="success">
  <Icon /> <span>Custom</span>
</Lozenge>
→ <Tag color="lime" isRemovable={false} migration_fallback="lozenge" /> /* TODO: Manually convert... */
```

### Scenario 4: Bold variants - No migration

```tsx
// ✓ Left unchanged
<Lozenge isBold={true} appearance="success">
	Important
</Lozenge>
```

## Troubleshooting

### "Tag component uses a variable as the text prop" warning

- **Cause**: You have variable or member expression children
- **Fix**: Verify the variable is a string type, or convert it:
  `<Tag text={String(variable)} isRemovable={false} migration_fallback="lozenge" />`

### "complex children that couldn't be automatically migrated" warning

- **Cause**: Children contain JSX elements or complex expressions
- **Fix**: Manually extract the text content or consider using a different component structure

### "dynamic isBold prop" warning

- **Cause**: `isBold` prop has a dynamic value (variable, expression, etc.)
- **Fix**: Review if this component should be a Bold Lozenge or a Tag, then apply manually
