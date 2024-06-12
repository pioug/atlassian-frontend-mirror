This rule prevents usage of the `className` prop in JSX.

Avoid `className` because it invites the use of unsafe global styles and is impossible to determine
via local tooling. Use props for configuration and typical CSS-in-JS for styling or `xcss` for
bounded overrides.

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

<div css={css({ padding: '10px' })} />;
```

```tsx
<MyComponent isDisabled={isDisabled} />
```

## FAQ

### What if I'm using `className` to target elements with JavaScript?

There are some cases where a selector is required to integrate with a 3rd party library, such as
legacy code using jQuery.

Use a `ref` if possible. Otherwise, if you _must_ have a selector, use a `data-*` attribute that
gives enough context and is unique enough, for example `data-editor-table-target="true"`.
