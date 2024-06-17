Blocks providing static values through the `style` prop, which should only be used to provide
dynamic values (values unknown at build time).

Use the `css` prop for providing static values instead.

## Examples

### Incorrect

```tsx
import { token } from '@atlaskit/tokens';

const Component = () => (
	<div
		style={{
			margin: 0,
			color: token('color.text.danger'),
		}}
	/>
);
```

### Correct

Although `token` is a function call, it is statically resolvable by Compiled and should not be used
in the `style` prop.

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

type Props = { width: string };

const baseStyles = css({ margin: 0, color: token('color.text.danger') });

const Component = ({ width }: Props) => (
	<div
		css={baseStyles}
		style={{
			width: props.width,
			'--my-nested-width': props.width,
		}}
	/>
);
```
