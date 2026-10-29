Blocks the `styled` API, which creates unnecessary indirection.

This indirection:

- obfuscates which tag is being rendered
- adds linting complexity
- promotes exported styles
- can complicate refactoring

Use module-scoped `cssMap()` or `css()` from `@atlaskit/css` instead, and apply styles directly to
the element. Keep runtime-only values in the `style` prop.

## Examples

### Incorrect

```tsx
import styled from 'styled-components';

const Component = styled.div`
	color: red;
`;
export default styled.div({ color: 'red' });
```

```tsx
import styled2 from '@emotion/styled';

export const Component = styled2('div')`…`;
```

```tsx
import styled from 'styled-components';
import { styled as styled3 } from '@compiled/react';

const Component = styled.div`color: red;`
export const ComponentTwo = styled3(Component)({ … });
```

```tsx
import styled from 'styled-components';

export default styled.div.attrs((props) => ({ 'data-testid': props.testId }))({
	color: 'red',
});
```

```tsx
import styled from 'styled-components';

export default styled.div.attrs((props) => ({ 'data-testid': props.testId }))`
	color: red;
`;
```

### Correct

```tsx
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { color: token('color.text.subtlest') },
});

const Component = ({ children }) => <div css={styles.root}>{children}</div>;
```

```tsx
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { color: token('color.text.subtlest') },
});

const Component = ({ children }) => <Box xcss={styles.root}>{children}</Box>;
```

## FAQ

### How will I extend like `styled(Button)`?

Don't modify the styles of components you don't own, unless they provide an explicit bounded
interface for doing so — such as the `xcss` prop.

Use props (excluding `className` which is prohibited) to modify component styles instead.

The Atlassian Design System, for example, no longer supports `styled(Button)` because it is unsafe
for us to evolve the system with.
