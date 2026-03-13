Disallows usage of the deprecated `spacing` prop on icon components from `@atlaskit/icon/core`,
`@atlaskit/icon-lab/core`, and `@atlassian/icon-private/core`.

The `spacing` prop is deprecated. Use `<Box padding="...">` from `@atlaskit/primitives/compiled` to
apply spacing around icons instead.

## Examples

### Incorrect

```tsx
import AddIcon from '@atlaskit/icon/core/add';

// ❌ Using deprecated spacing prop
<AddIcon label="Add" spacing="spacious" />
<AddIcon label="Add" spacing="compact" />
<AddIcon label="Add" spacing="none" />
```

### Correct

```tsx
import AddIcon from '@atlaskit/icon/core/add';
import { Box } from '@atlaskit/primitives/compiled';

// ✅ Using Box for spacing
<Box padding="space.050">
  <AddIcon label="Add" />
</Box>

// ✅ No spacing needed
<AddIcon label="Add" />
```

## Migration

Use the `icon-spacing-to-box-primitive` codemod to migrate existing usages:

| Before               | After (medium)                            | After (small)                             |
| -------------------- | ----------------------------------------- | ----------------------------------------- |
| `spacing="spacious"` | `<Box padding="space.050"><Icon /></Box>` | `<Box padding="space.075"><Icon /></Box>` |
| `spacing="compact"`  | `<Box padding="space.050"><Icon /></Box>` | `<Box padding="space.025"><Icon /></Box>` |
| `spacing="none"`     | Just remove the prop                      | Just remove the prop                      |
