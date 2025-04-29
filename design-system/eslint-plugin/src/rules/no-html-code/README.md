Don't use native HTML code element. The Atlassian Design System provides a ready-made code component
that ensures accessible implementations and consistent ADS styling.

Use the Atlassian Design System [Code](/components/code/) component when suitable.

## Examples

This rule marks code as violations when it finds native HTML code elements.

### Incorrect

```jsx
<code>yarn changeset</code>
 ^^^^ Using a native HTML `<code>`
```

### Correct

```jsx
import { Code } from '@atlaskit/code';

<Code>yarn changeset</Code>;
```
