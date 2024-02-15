Disallows `css` export declarations that originate from `@compiled/react` and `@atlaskit/css`, as well as any other CSS-in-JS library defined through the `importSources` option.

In Compiled, exporting css declarations may result in unexpected errors when imported, because its value will be `null` at runtime. Additionally, co-locating css definitions with their usage is considered best practice in order to improve code readability and build performance.

## Examples

### Incorrect

```tsx
import { css } from '@compiled/react';

export const styles = css({});

export default css({});
```

### Correct

```tsx
import { css } from '@compiled/react';

const styles = css({});
```

## Options

### importSources

By default, this rule will check `css` usages from `@compiled/react` and `@atlaskit/css`. To check `css` usages from other CSS-in-JS libraries, you can add the library's package name to `importSources`.

`importSources` accepts an array of package names (strings). `css` usages from `@compiled/react` and `@atlaskit/css` will always be checked, regardless of the value of `importSources`.

```tsx
// [{ importSources: ['@emotion/css'] }]

import { css } from '@emotion/css';

// Invalid!
export const styles = css({});
```
