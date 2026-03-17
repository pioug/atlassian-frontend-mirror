Disallows usage of the deprecated `spacing` prop on icon components from `@atlaskit/icon/core` and `@atlaskit/icon-lab/core`.

The `spacing` prop is deprecated. Wrap the icon in a `Flex` from `@atlaskit/primitives/compiled` with `cssMap` padding from `@atlaskit/css` instead.

## Examples

### Incorrect

```tsx
import AddIcon from '@atlaskit/icon/core/add';

// ❌ Using deprecated spacing prop
<AddIcon label="Add" spacing="spacious" />
<AddIcon label="Add" spacing="compact" />
```

### Correct

```tsx
/** @jsxRuntime classic */
/** @jsx jsx */
import { cssMap, jsx } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
  space050: {
    paddingBlock: token('space.050'),
    paddingInline: token('space.050'),
  },
});

// ✅ Using Flex with cssMap for spacing
<Flex xcss={iconSpacingStyles.space050}>
  <AddIcon label="Add" />
</Flex>

// ✅ No spacing needed (spacing="none")
<AddIcon label="Add" />
```

## Migration

Use the `next-icon-spacing-to-flex-primitive` codemod via `npx @atlaskit/codemod-cli` to migrate automatically, or use the 💡 IDE quick-fix suggestion from this ESLint rule.

Spacing token reference:

| `spacing` value | Icon size    | Token        | Result                   |
| --------------- | ------------ | ------------ | ------------------------ |
| `spacious`      | medium (16px) | `space.050` | 4px padding → 24px total |
| `compact`       | medium (16px) | `space.050` | 4px padding → 24px total |
| `spacious`      | small (12px)  | `space.075` | 6px padding → 24px total |
| `compact`       | small (12px)  | `space.025` | 2px padding → 16px total |
| `none`          | any           | —           | Remove prop, no Flex needed |
