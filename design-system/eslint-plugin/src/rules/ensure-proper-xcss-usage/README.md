This ESLint rule enforces proper usage of the `xcss` prop with compiled Primitives from
`@atlaskit/primitives/compiled`.

### Incorrect

```tsx
import { Box } from '@atlaskit/primitives/compiled/box';
import { xcss } from '@atlaskit/primitives';
import { cssMap } from '@atlaskit/css';

const oldStyles = xcss({
  color: 'red',
});

const styles = cssMap({
  root: { width: '100%' }
});

// ❌ xcss variable with compiled component
<Box xcss={oldStyles} />

// ❌ cssMap without key
<Box xcss={styles} />
```

### Correct

```tsx
import { Box } from '@atlaskit/primitives/compiled/box';
import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { color: token('color.text.subtle') },
	secondary: { color: token('color.text.subtle') },
});

<Box xcss={styles.root} />;
```

### Alternative Correct Usage

Use the component's built-in styling props when no style override is needed.

```tsx
import { Box } from '@atlaskit/primitives/compiled/box';

<Box padding="space.100" backgroundColor="color.background.neutral" />;
```
