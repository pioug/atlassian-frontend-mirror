Don't use native HTML images. The Atlassian Design System provides a ready-made image component that
ensures accessible implementations and provides access to ADS styling features like design tokens.

Use the Atlassian Design System [Image](/components/image/) component when suitable.

## Examples

This rule marks code as violations when it finds native HTML image elements.

### Incorrect

```jsx
<img src="foo.jpg" alt="The word 'foo' written on a white background." />
 ^^^ Using a native HTML `<img>`

<div role="img" src="foo.jpg" alt="The word 'foo' written on a white background." />
 ^^^ Using `role="img"` to create images

```

### Correct

```jsx
import Image from '@atlaskit/image';

<Image src="foo.jpg" alt="The word 'foo' written on a white background." />;
```
