# Lozenge Appearance Semantic Migration Codemod

This codemod migrates Lozenge components to use the new semantic appearance values while keeping the
`appearance` prop.

## What it does

### 1. Updates `appearance` prop values to new semantics

Maps old semantic values to new semantic values:

```tsx
// Before
<Lozenge appearance="success">Success</Lozenge>
<Lozenge appearance="default">Default</Lozenge>
<Lozenge appearance="inprogress">In Progress</Lozenge>
<Lozenge appearance="moved">Moved</Lozenge>
<Lozenge appearance="new">New</Lozenge>
<Lozenge appearance="removed">Removed</Lozenge>

// After
<Lozenge appearance="success">Success</Lozenge>
<Lozenge appearance="neutral">Default</Lozenge>
<Lozenge appearance="information">In Progress</Lozenge>
<Lozenge appearance="warning">Moved</Lozenge>
<Lozenge appearance="discovery">New</Lozenge>
<Lozenge appearance="danger">Removed</Lozenge>
```

### 2. Handles dynamic values with comments

For dynamic `appearance` values, adds a comment to verify the values:

```tsx
// Before
<Lozenge appearance={getStatus()}>Dynamic</Lozenge>;

// After
{
	/* FIXME: This Lozenge component uses a dynamic `appearance` prop with updated semantic values.
Please verify that the values being passed use the new semantic values: neutral, information, warning, discovery, danger, success.
Old values mapping: default→neutral, inprogress→information, moved→warning, new→discovery, removed→danger, success→success. */
}
<Lozenge appearance={getStatus()}>Dynamic</Lozenge>;
```

### 3. Validates appearance values and warns about invalid ones

For unknown semantic `appearance` values, adds a warning comment:

```tsx
// Before
<Lozenge appearance="invalid">Invalid</Lozenge>;

// After
{
	/* FIXME: This Lozenge component uses an unknown `appearance` value "invalid".
Valid new semantic appearance values are: neutral, information, warning, discovery, danger, success.
Please update this value to a valid semantic appearance value. */
}
<Lozenge appearance="invalid">Invalid</Lozenge>;
```

## Usage

```bash
# From the platform directory
npx @atlaskit/codemod-cli --preset lozenge-appearance-semantic-migration [target-path]

# Examples:
npx @atlaskit/codemod-cli --preset lozenge-appearance-semantic-migration src/
npx @atlaskit/codemod-cli --preset lozenge-appearance-semantic-migration src/components/MyComponent.tsx
```

## Semantic value mapping

The following old appearance values map to new semantic values:

| Old Appearance | New Appearance        |
| -------------- | --------------------- |
| `default`      | `neutral`             |
| `inprogress`   | `information`         |
| `moved`        | `warning`             |
| `new`          | `discovery`           |
| `removed`      | `danger`              |
| `success`      | `success` (unchanged) |

## What you need to do after running the codemod

1. **Review dynamic values**: Look for FIXME comments about dynamic `appearance` props and verify
   the values being passed use the new semantic values.

2. **Test your changes**: Ensure the visual appearance matches your expectations after the
   migration.

3. **Update any hardcoded references**: If you have any constants or mappings that reference the old
   semantic values, update them manually.

## Files that will be transformed

The codemod only transforms files that:

- Import Lozenge from `@atlaskit/lozenge`
- Use the `appearance` prop on Lozenge components

Files without Lozenge imports or usage will remain unchanged.
