## Examples

This rule marks code as violations when a shape token should be used. It will auto-fix values that
can be mapped 1:1 with an ADS shape token. Values that can't be mapped to a token will still be
reported, however no auto-fix will happen.

### Incorrect

```jsx
const someStyles = css({
  borderRadius: '3px';
           			^^^^^
  borderWidth: '2px';
           		 ^^^^^
})
```

### Correct

```jsx
import { token } from '@atlaskit/tokens'

const someStyles = css({
  borderRadius: token('radius.small');
  borderRadius: token('border.width.outline');
})
```

See the list of available shape tokens on the
[ADS website](https://atlassian.design/components/tokens/all-tokens).
