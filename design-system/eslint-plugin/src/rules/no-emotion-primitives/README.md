This rule ensures that imports from `@atlaskit/primitives` are replaced with their Compiled
counterparts from `@atlaskit/primitives/compiled`. This helps ensure better performance and
consistency across the codebase.

## Examples

This rule marks code as violations when it uses the Emotion Primitives import path.

### Incorrect

```jsx
import { Box } from '@atlaskit/primitives';
import { Stack } from '@atlaskit/primitives';
```

### Correct

```jsx
import { Box } from '@atlaskit/primitives/compiled';
import { Stack } from '@atlaskit/primitives/compiled';
```

The rule will detect any imports from `@atlaskit/primitives` and suggest replacing them with the
compiled version.

## Options

`autofix`: When enabled, the rule will automatically fix imports to use the Compiled entrypoint
instead of just warning. Defaults to `false`.

## Configuration

Basic usage (warnings only):

```js
{
  '@atlaskit/design-system/use-compiled-primitives': 'warn'
}
```

With auto-fixing enabled:

```js
{
  '@atlaskit/design-system/use-compiled-primitives': ['warn', { autofix: true }]
}
```
