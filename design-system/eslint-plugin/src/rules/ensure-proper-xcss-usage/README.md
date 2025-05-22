This ESLint rule enforces proper usage of the `xcss` prop with compiled Primitives from
`@atlaskit/primitives/compiled`.

### Incorrect

```tsx
import { Box } from '@atlaskit/primitives/compiled';
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
import { Box } from '@atlaskit/primitives/compiled';
import { cssMap } from '@atlaskit/css';

const styles = cssMap({
	root: { color: token('color.text.subtle') },
	secondary: { color: token('color.text.subtle') },
});

<Box xcss={styles.root} />;
```

### Alternative Correct Usage

```tsx
// ✅ Using inline styles (when cssMap is not needed)
import { Box } from '@atlaskit/primitives/compiled';

<Box xcss={{ color: 'red' }} />;

// ✅ Or continue using old primitives (but migration is recommended)
import { Box, xcss } from '@atlaskit/primitives';

const oldStyles = xcss({ color: 'red' });

<Box xcss={oldStyles} />;
```
