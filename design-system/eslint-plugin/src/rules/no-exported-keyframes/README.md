Disallows `keyframes` export declarations that originate from `@compiled/react`, as well as any other CSS-in-JS library defined through the `importSources` option.

In Compiled, exporting keyframes declarations may result in unexpected errors when imported, because its value will be `null` at runtime. Additionally, co-locating keyframes definitions with their usage is considered best practice in order to improve code readability and build performance.

## Examples

<!-- To fill out -- tell us when this rule will mark violations. -->

### Incorrect

```tsx
import { keyframes } from '@compiled/react';

export const animation = keyframes({});

export default keyframes({});
```

### Correct

```tsx
import { keyframes } from '@compiled/react';

const animation = keyframes({});
```

## Options

### importSources

By default, this rule will check `keyframes` usages from `@compiled/react`. To check `keyframes` usages from other CSS-in-JS libraries, you can add the library's package name to `importSources`.

`importSources` accepts an array of package names (strings). `keyframes` usages from `@compiled/react` will always be checked, regardless of the value of `importSources`.

```tsx
// [{ importSources: ['@emotion/css'] }]

import { keyframes } from '@emotion/css';

// Invalid!
export const styles = keyframes({});
```
