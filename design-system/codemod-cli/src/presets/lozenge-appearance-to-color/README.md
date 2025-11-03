# Lozenge Appearance to Color Codemod

This codemod migrates Lozenge components from the deprecated `appearance` prop to the new `color`
prop.

## What it does

### 1. Renames `appearance` prop to `color`

Maps existing semantic values directly to equivalent semantic color values:

```tsx
// Before
<Lozenge appearance="success">Success</Lozenge>
<Lozenge appearance="default">Default</Lozenge>
<Lozenge appearance="inprogress">In Progress</Lozenge>

// After
<Lozenge color="success">Success</Lozenge>
<Lozenge color="default">Default</Lozenge>
<Lozenge color="inprogress">In Progress</Lozenge>
```

### 2. Handles dynamic values with comments

For dynamic `appearance` values, adds a comment to verify the values:

```tsx
// Before
<Lozenge appearance={getStatus()}>Dynamic</Lozenge>;

// After
{
	/* FIXME: This Lozenge component uses a dynamic `appearance` prop that has been renamed to `color`.
Please verify that the values being passed are valid color values (semantic: default, inprogress, moved, new, removed, success). */
}
<Lozenge color={getStatus()}>Dynamic</Lozenge>;
```

### 3. Validates appearance values and warns about invalid ones

For invalid semantic `appearance` values, adds a warning comment:

```tsx
// Before
<Lozenge appearance="invalid">Invalid</Lozenge>;

// After
{
	/* FIXME: This Lozenge component uses an invalid `appearance` value "invalid" that has been renamed to `color`.
Valid semantic color values are: default, inprogress, moved, new, removed, success.
Please update this value to a valid semantic color or use a custom color value. */
}
<Lozenge color="invalid">Invalid</Lozenge>;
```

## Usage

### Run from the platform directory

```bash
# Navigate to platform directory first
cd platform

# Run the codemod using the preset
npx @atlaskit/codemod-cli --preset lozenge-appearance-to-color [target-path]

# Examples:
npx @atlaskit/codemod-cli --preset lozenge-appearance-to-color src/
npx @atlaskit/codemod-cli --preset lozenge-appearance-to-color src/components/MyComponent.tsx

# Alternative: Run the specific transform directly
npx @atlaskit/codemod-cli --transform packages/design-system/codemod-cli/src/presets/lozenge-appearance-to-color/codemods/lozenge-appearance-to-color.ts [target-path]
```

### Semantic value mapping

The following appearance values map directly to color values:

| Appearance   | Color (mapped to) |
| ------------ | ----------------- |
| `default`    | `default`         |
| `inprogress` | `inprogress`      |
| `moved`      | `moved`           |
| `new`        | `new`             |
| `removed`    | `removed`         |
| `success`    | `success`         |

## What you need to do after running the codemod

1. **Review dynamic values**: Look for FIXME comments about dynamic `color` props and verify the
   values being passed are valid.

2. **Test your changes**: Ensure the visual appearance matches your expectations after the
   migration.

## Files that will be transformed

The codemod only transforms files that:

- Import Lozenge from `@atlaskit/lozenge`
- Use the `appearance` prop on Lozenge components

Files without Lozenge imports or usage will remain unchanged.
