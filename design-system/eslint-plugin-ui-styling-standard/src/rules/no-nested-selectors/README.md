Blocks nested selectors in style declarations.

Use styles which do not require context from other elements.

## Examples

### Incorrect

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = css({
	h2: {
		font: token('font.heading.large'),
	},
});

const Component = () => (
	<div css={styles}>
		<h2>Heading</h2>
	</div>
);
```

```tsx
import { styled } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const Table = styled.table({
	border: `1px solid ${token('color.border')}`,
	td: {
		padding: token('space.100'),
	},
});
```

```tsx
import { styled } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const Component = styled.div({
	'.myclass': {
		padding: token('space.100'),
	},
});
```

### Correct

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const headingStyles = css({
	font: token('font.heading.large'),
});

const Component = () => (
	<div>
		<h2 css={headingStyles}>Heading</h2>
	</div>
);
```

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const tableStyles = css({
	border: `1px solid ${token('color.border')}`,
});

const tdStyles = css({
	padding: token('space.100'),
});
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
