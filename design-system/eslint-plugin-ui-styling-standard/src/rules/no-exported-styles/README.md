Blocks exports of `css`, `cssMap`, `keyframes`, `styled`, `xcss` styles, which are unsafe.

Use alongside `no-imported-style-values` which blocks consumption of imported styles.

Compiled style declarations are null at runtime, so using imported styles will cause unexpected
errors.

Co-locate style definitions with their usage instead. This will also improve code readability,
maintainability and build performance.

## Examples

### Incorrect

```tsx
import { css } from '@compiled/react';

export const styles = css({});

export default css({});
```

```tsx
import { keyframes } from '@compiled/react';

export const animation = keyframes({});

export default keyframes({});
```

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const colorStyles = css({
	color: token('color.text'),
});

const styles = {
	primary: {
		text: {
			color,
		},
	},
};

export default styles.primary.text.color;
```

### Correct

Co-locate styles with components to improve code readability, linting, and build performance.

```tsx
import { css } from '@compiled/react';

const styles = css({});

export const Component = () => <div css={styles} />;
```

```tsx
import { css, keyframes } from '@compiled/react';

const animation = keyframes({});
const styles = css({ animate: `${animation} 1s ease-in` });

export const Component = () => <div css={styles} />;
```

## Options

### `importSources: string[]`

By default, this rule will check styles using:

- `@atlaskit/css`
- `@atlaskit/primitives`
- `@compiled/react`
- `@emotion/react`
- `@emotion/core`
- `@emotion/styled`
- `styled-components`

Override this list with the `importSources` option, which accepts an array of package names.
