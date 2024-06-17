Blocks global styles through CSS-in-JS and CSS module imports.

Use local styles so that style dependencies are statically resolvable.

The only global styling that should be used is `@atlaskit/css-reset`.

## Examples

### Incorrect

```tsx
import { Global } from '@emotion/react';

<Global
	styles={{
		'.some-class': {
			fontSize: 50,
			textAlign: 'center',
		},
	}}
/>;
```

```tsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle({
	body: {
		margin: 0,
	},
});
```

```tsx
import { injectGlobal } from 'styled-components';

injectGlobal({
	body: {
		margin: 0,
	},
});
```

```tsx
<style>
	{`
    .some-class {
      color: red;
    }
  `}
</style>
```

### Correct

```tsx
import '@atlaskit/css-reset';
```
