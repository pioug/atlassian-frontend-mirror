Blocks the `styled` API, which creates unnecessary indirection.

This indirection:

- obfuscates which tag is being rendered
- adds linting complexity
- promotes exported styles
- can complicate refactoring

Use the `css` API instead. It has better performance and clarity.

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
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';

const styles = css({ color: token('color.text.subtlest') });

const Component = ({ children }) => {
	return <div css={styles}>{children}</div>;
};
```

```tsx
import { Box, xcss } from '@atlaskit/primitives';

const styles = xcss({
	color: 'color.text.subtlest',
});

const Component = ({ children }) => {
	return <Box xcss={styles}>{children}</Box>;
};
```

## FAQ

### How will I extend like `styled(Button)`?

Don't modify the styles of components you don't own, unless they provide an explicit bounded
interface for doing so — such as the `xcss` prop.

Use props (excluding `className` which is prohibited) to modify component styles instead.

The Atlassian Design System, for example, no longer supports `styled(Button)` because it is unsafe
for us to evolve the system with.
