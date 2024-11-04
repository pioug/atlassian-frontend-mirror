Blocks styles that are difficult or impossible to statically analyze.

## Examples

### Function calls

#### Incorrect

Function calls are blocked as arguments or as values, unless they are specified in
`allowedFunctionCalls` (or in the default list).

```tsx
import { css } from '@compiled/react';

function getStyles() {
	return { width: 100 };
}

const styles = css(getStyles());
```

```tsx
import { css } from '@compiled/react';

function getWidth() {
	return 100;
}

const styles = css({
	width: getWidth(),
});
```

#### Correct

Use inline literals for static values.

```tsx
import { css } from '@compiled/react';

const styles = css({ width: 100 });
```

Use the `style` prop for dynamic values.

```tsx
const Component = ({ width }) => <div style={{ width }} />;
```

Some functions such as `tokens()` are allowed.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = css({ padding: token('space.100') });
```

### Dynamic keys

#### Incorrect

Dynamic keys are blocked, unless they are specified in `allowedDynamicKeys` (or in the default
list).

```tsx
import { css } from '@compiled/react';

const HOVER_SELECTOR = '&:hover';
const MARGIN = 'margin';

const styles = css({
	[HOVER_SELECTOR]: {
		[MARGIN]: 0,
	},
	[`${HOVER_SELECTOR} > p`]: {
		width: 100,
	},
});
```

#### Correct

Use literal values for pseudo-states and property names.

Don't use nested selectors, apply styles directly instead.

```tsx
import { css } from '@compiled/react';

const styles = css({
	'&:hover': {
		margin: 0,
	},
});

const paragraphStyles = css({
	width: 100,
});
```

### Variables

#### Incorrect

Variables are only allowed as values if they:

- have a simple, static value
- are defined in the same file

```tsx
import { css } from '@compiled/react';
import { HEIGHT } from '../shared';

const styles = css({
	height: HEIGHT,
});
```

#### Correct

Use inlined values.

```tsx
import { css } from '@compiled/react';

const styles = css({
	height: '32px',
});
```

Alternatively, define variables in the same file.

```tsx
import { css } from '@compiled/react';

const HEIGHT = '32px';

const styles = css({
	height: HEIGHT,
});
```

### Object access

#### Incorrect

Don't access object members in values.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const colors = {
	text: token('color.text'),
};

const styles = css({
	color: colors.text,
});
```

#### Correct

Use inlined values.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = css({
	color: token('color.text'),
});
```

### Spread elements

#### Incorrect

Don't use the spread operator in styles.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const subtleTextStyles = {
	color: token('color.text.subtle'),
};

const styles = css({
	...subtleTextStyles,
	margin: 0,
});
```

#### Correct

Use the `css` prop to compose styles.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const subtleTextStyles = {
	color: token('color.text.subtle'),
};

const styles = css({
	margin: 0,
});

const Component = () => <div css={[subtleTextStyles, styles]} />;
```

### Array values

#### Incorrect

Don't use array values. This syntax is not supported by Compiled, or most other CSS-in-JS libraries.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const boldMixin = { fontWeight: token('font.weight.bold') };

const styles = css({
	'&::before': [boldMixin, { color: token('color.text.danger') }],
});
```

#### Correct

Use a single object with inlined styles.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = css({
	'&::before': {
		fontWeight: token('font.weight.bold'),
		color: token('color.text.danger'),
	},
});
```

## Options

### `allowedDynamicKeys: [string, string][]`

Use this to allow specified imports as dynamic keys, in addition to the built-in allow-list.

Each value should be a two-element array. The first item is the entrypoint, and the second item is a
named export.

Default imports are not supported.

```tsx
// eslint.config.cjs

// ...
      rules: {
        '@atlaskit/eslint-plugin-ui-styling-standard/no-unsafe-values': [
          'error',
          {
            allowedDynamicKeys: [
              ['@atlaskit/primitives/responsive', 'media'],
            ]
          },
        ],
        // ...
      },
// ...
```

### `allowedFunctionCalls: [string, string][]`

Use this to allow specific functions to be called, in addition to the built-in allow-list.

Each value should be a two-element array. The first item is the entrypoint, and the second item is a
named export.

Default imports are not currently supported.

```tsx
// eslint.config.cjs

// ...
      rules: {
        '@atlaskit/eslint-plugin-ui-styling-standard/no-unsafe-values': [
          'error',
          {
            allowedFunctionCalls: [
              ['@atlaskit/tokens', 'token'],
            ]
          },
        ],
        // ...
      },
// ...
```

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
