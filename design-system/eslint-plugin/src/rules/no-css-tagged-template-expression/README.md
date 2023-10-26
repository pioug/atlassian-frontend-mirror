Disallows any `css` tagged template expressions that originate from `@emotion/react`, `@emotion/core`, `compiled/react` or `styled-components`.

Tagged template expressions cannot be type safe and are difficult to parse correctly. Will auto fix ` css`` ` to the preferred `css({})` call expression syntax.

Thank you to the [Compiled team for their rule](https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-css-tagged-template-expression) from which this was ported.

## Incorrect

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

## Correct

```js
import { css } from '@emotion/react';

css({ color: 'blue' });

const styles = css({
  color: 'blue',
  fontWeight: 500,
});
```

## Limitations

- Comments are not auto-fixable. You will need to manually convert usages containing functions.
