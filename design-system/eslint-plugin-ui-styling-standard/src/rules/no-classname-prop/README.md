Blocks the `className` prop, which encourages unsafe global styles and cannot be statically
resolved.

Use the `css` prop for styling, with props for configuration and `xcss` for bounded overrides.

## Examples

### Incorrect

```tsx
<div className="my-class">
```

```tsx
<MyComponent className={isDisabled ? 'disabled' : undefined} />
```

### Correct

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const myStyles = css({ padding: token('space.100') });

<div css={myStyles} />;
```

```tsx
<MyComponent isDisabled={isDisabled} />
```

```tsx
import { Checkbox } from '@atlaskit/checkbox';

<Checkbox xcss={{ alignItems: 'center' }} />;
```

Pass-through `props.xcss` are allowed, expecting this to be typed, refer to
[@atlaskit/css](https://atlassian.design/components/css/overview#building-reusable-components)

```tsx
import { StrictXCSSProp } from '@atlaskit/css';

const Component = (props: { xcss?: StrictXCSSProp<'color', never> }) => (
	<div className={props.xcss} />
);
```

## FAQ

### What if I'm using `className` to target elements with JavaScript?

There are some cases where a selector is required to integrate with a 3rd party library, such as
legacy code using jQuery.

Use a `ref` if possible. Otherwise, if you _must_ have a selector, use a `data-*` attribute that
gives enough context and is unique enough, for example `data-editor-table-target="true"`.
