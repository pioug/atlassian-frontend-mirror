Blocks dynamic styles (function expressions) in style declarations.

This ensures that style declarations:

- are statically analyzable
- can be efficiently extracted into atomic CSS
- are more readable and deterministic, thus easier to maintain

## Examples

### Incorrect

```tsx
import { styled } from '@compiled/react';

const Component = styled.div<{ width: number }>((props) => ({
	width: props.width,
}));
```

```tsx
import styled from 'styled-components';

const Component = styled.div<{ width: number }>({
	width: (props) => props.width,
});
```

```tsx
import styled from 'styled-components';

const Container = styled.div<{ hasPadding: boolean }>({
	padding: ({ hasPadding }) => (hasPadding ? token('space.100', '8px') : token('space.0', '0px')),
});
```

### Correct

Define all styles statically, and dynamically apply them using the `css` prop. Use the `style` prop
for values that are only known at runtime.

For further guidance, consult our
[migration guide](https://atlassian.design/components/eslint-plugin-ui-styling-standard/migration-guide).

#### Flags

If you have a style that is on/off depending on a prop, use the `css` prop to conditionally apply
it.

```tsx
import { css } from '@compiled/react';

const baseStyles = css({ padding: token('space.0') });
const hasPaddingStyles = css({ padding: token('space.100') });

const Container = ({ hasPadding = false }: { hasPadding?: boolean }) => {
	return <div css={[baseStyles, hasPadding && hasPaddingStyles]} />;
};
```

#### Variants

If you have variants which are known ahead of time, use `cssMap` to define them and the `css` prop
to conditionally apply it.

```tsx
import { css } from '@compiled/react';

const baseStyles = css({ width: 100 });
const stylesMap = cssMap({
  primary: {
    background: token('color.background.brand.bold'),
    '&:hover': { background: token('color.background.brand.bold.hovered') },
  },
  error: {
    background: token('color.background.warning.bold'),
    '&:hover': { background: token('color.background.warning.bold.hovered') },
  }
});

const Wrapper = ({ appearance = 'primary' }: { appearance?: 'primary' | 'error' }) => (
  <div css={[baseStyles, stylesMap[appearance]} />
);
```

#### Dynamic values

If you have styles which are truly dynamic, use the `style` prop.

This approach should be used as a last resort.

```tsx
import { css } from '@compiled/react';

const Component = ({ width }: { width: number }) => {
	return <div style={{ width }} />;
};
```

```tsx
import { css } from '@compiled/react';

const containerStyles = css({
	'&::before': {
		width: 'var(--ak-example-width)',
	},
});

function Example({ width }: { width: number }) {
	return <div css={containerStyles} style={{ '--ak-example-width': `${width}px` }} />;
}
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
