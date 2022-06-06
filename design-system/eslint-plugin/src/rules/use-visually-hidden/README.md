# @atlaskit/eslint-plugin-design-system/use-visually-hidden

This rule provides a suggestion to Design System consumers to be made aware of ready-made solutions.

## Examples

👎 Example of **incorrect** code for this rule:

```js
import { css } from '@emotion/core';

const visuallyHiddenStyles = css({
  width: '1px',
  height: '1px',
  padding: '0',
  position: 'absolute',
  border: '0',
  clip: 'rect(1px, 1px, 1px, 1px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
    ^^^^
```

```js
import styled from '@emotion/styled';

const VisuallyHidden = styled.span`
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  whiteSpace: nowrap;
`;
  ^^^^
```

```js
import { visuallyHidden } from '@atlaskit/theme/constants';

const VisuallyHidden = styled.span`${visuallyHidden()}`;
                                     ^^^^^^^^^^^^^^
```

👍 Example of **correct** code for this rule:

```js
import VisuallyHidden from '@atlaskit/visually-hidden';
```
