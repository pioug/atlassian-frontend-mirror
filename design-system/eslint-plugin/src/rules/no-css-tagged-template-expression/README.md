Disallows any `css` tagged template expressions that originate from a CSS-in-JS library, including
`@atlaskit/css`, `@compiled/react`, Emotion, and `styled-components`.

Tagged template expressions cannot be type safe and are difficult to parse correctly. Will auto fix
` css`` ` to the preferred `css({})` call expression syntax.

Thank you to the
[Compiled team for their rule](https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-css-tagged-template-expression)
from which this was ported.

## Examples

### Incorrect

```js
import { css } from '@emotion/react';

css`
	color: blue;
`;

const styles = css`
	color: blue;
	font-weight: 500;
`;
```

### Correct

```js
import { css } from '@emotion/react';

css({ color: 'blue' });

const styles = css({
	color: 'blue',
	fontWeight: 500,
});
```

## Options

### importSources

By default, this rule will check `css` usages from:

- `@atlaskit/css`
- `@atlaskit/primitives`
- `@compiled/react`
- `@emotion/react`
- `@emotion/core`
- `@emotion/styled`
- `styled-components`

To change this list of libraries, you can define a custom set of `importSources`, which accepts an
array of package names (strings).

```tsx
// [{ importSources: ['other-lib'] }]

import { css } from 'other-lib';

// Invalid!
export const styles = css``;
```

## Limitations

- Comments are not auto-fixable. You will need to manually convert usages containing functions.
