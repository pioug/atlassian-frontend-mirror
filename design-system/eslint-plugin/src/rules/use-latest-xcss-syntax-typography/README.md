## Description

Soon, applying `fontSize`, `lineHeight`, `fontWeight` with `xcss` will be deprecated. Please refrain
from adding new usages, as you will need to remove them soon anyway. As an alternative, you can use
the `Text` and `Heading` primitives.

## Examples

### Incorrect

```jsx
const myStyles = xcss({
	fontSize: '14px',
	^^^^^^^^^^^^^^^^
	lineHeight: '20px',
	^^^^^^^^^^^^^^^^^^
	fontWeight: 500,
	^^^^^^^^^^^^^^^
});

<Box as="p" xcss={myStyles}>
	...
</Box>;
```

### Correct

```jsx
import { Text } from '@atlaskit/primitives';

<Text weight="medium">...</Text>;
```
