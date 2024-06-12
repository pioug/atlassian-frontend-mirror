This rule ensures the `cx()` function is only used within the `xcss` prop. This aids tracking what
styles are applied to a jsx element.

The `cx` function is checked only if it is imported from `@compiled/react` or `@atlaskit/css`.

Passing arguments to the `cx()` function is how you compose styles (combine more than one set of
styles together) with XCSS. This is a workaround for the more conventional array syntax (e.g.
[in Emotion](https://emotion.sh/docs/composition)) `<div xcss={[style1, style2]} />` not giving
robust enough type checking.

## Examples

### Incorrect

```js
import { cx, cssMap } from '@compiled/react';

const styles = cssMap({
	text: { color: 'red' },
	bg: { background: 'blue' },
});

const joinedStyles = cx(styles.text, styles.bg);

<Button xcss={joinedStyles} />;
```

### Correct

```js
import { cx, cssMap } from '@compiled/react';

const styles = cssMap({
	text: { color: 'red' },
	bg: { background: 'blue' },
});

<Button xcss={cx(styles.text, styles.bg)} />;
```
