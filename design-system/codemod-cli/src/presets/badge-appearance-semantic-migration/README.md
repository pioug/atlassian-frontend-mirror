# Badge Appearance Semantic Migration Codemod

This codemod migrates Badge components to use the new semantic appearance values while keeping the
`appearance` prop.

## What it does

### 1. Updates `appearance` prop values to new semantics

Maps old appearance values to new semantic values:

```tsx
// Before
<Badge appearance="added">{5}</Badge>
<Badge appearance="removed">{10}</Badge>
<Badge appearance="default">{3}</Badge>
<Badge appearance="primary">{7}</Badge>
<Badge appearance="primaryInverted">{2}</Badge>
<Badge appearance="important">{99}</Badge>

// After
<Badge appearance="success">{5}</Badge>
<Badge appearance="danger">{10}</Badge>
<Badge appearance="neutral">{3}</Badge>
<Badge appearance="information">{7}</Badge>
{/* FIXME: This Badge component used `appearance="primaryInverted"` which has been migrated to `appearance="inverse"`.
Please verify the visual appearance matches your expectations. */}
<Badge appearance="inverse">{2}</Badge>
<Badge appearance="danger">{99}</Badge>
```

### 2. Handles dynamic values with comments

For dynamic `appearance` values, adds a comment to verify the values:

```tsx
// Before
<Badge appearance={getStatus()}>{count}</Badge>;

// After
{
	/* FIXME: This Badge component uses a dynamic `appearance` prop with updated semantic values.
Please verify that the values being passed use the new semantic values: neutral, information, inverse, danger, success.
Old values mapping: default→neutral, primary→information, primaryInverted→inverse, added→success, removed→danger, important→danger. */
}
<Badge appearance={getStatus()}>{count}</Badge>;
```

### 3. Validates appearance values and warns about invalid ones

For unknown semantic `appearance` values, adds a warning comment:

```tsx
// Before
<Badge appearance="invalid">{42}</Badge>;

// After
{
	/* FIXME: This Badge component uses an unknown `appearance` value "invalid".
Valid new semantic appearance values are: success, danger, neutral, information, inverse.
Please update this value to a valid semantic appearance value. */
}
<Badge appearance="invalid">{42}</Badge>;
```

## Usage

```bash
# From the platform directory
npx @atlaskit/codemod-cli --preset badge-appearance-semantic-migration [target-path]

# Examples:
npx @atlaskit/codemod-cli --preset badge-appearance-semantic-migration src/
npx @atlaskit/codemod-cli --preset badge-appearance-semantic-migration src/components/MyComponent.tsx
```

## Semantic value mapping

The following old appearance values map to new semantic values:

| Old Appearance    | New Appearance | Notes |
| ----------------- | -------------- | ----- |
| `added`           | `success`      |       |
| `removed`         | `danger`       |       |
| `default`         | `neutral`      |       |
| `primary`         | `information`  |       |
| `primaryInverted` | `inverse`      |       |
| `important`       | `danger`       |       |

## What you need to do after running the codemod

1. **Review `primaryInverted` migrations**: The `primaryInverted` appearance has been migrated to
   `inverse`. Please verify the visual appearance matches your expectations.

2. **Review `important` migrations**: The `important` appearance has been migrated to `danger`.
   Please verify this semantic mapping is appropriate for your use case.

3. **Review dynamic values**: Look for FIXME comments about dynamic `appearance` props and verify
   the values being passed use the new semantic values.

4. **Test your changes**: Ensure the visual appearance matches your expectations after the
   migration.

5. **Update any hardcoded references**: If you have any constants or mappings that reference the old
   appearance values, update them manually.

## Files that will be transformed

The codemod only transforms files that:

- Import Badge from `@atlaskit/badge`
- Use the `appearance` prop on Badge components

Files without Badge imports or usage will remain unchanged.
