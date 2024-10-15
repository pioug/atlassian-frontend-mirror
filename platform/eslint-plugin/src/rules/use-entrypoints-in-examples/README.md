Using public entrypoints in our examples ensures that they reflect public API.

It also has benefits for:

- readability
- bundle and code analysis

## Examples

This rule marks imports as violations when they reach into the `src` folder through relative file
paths.

### Incorrect

```js
import Button from '../../../src';

import { IconButton } from '../../../src/new';
```

### Correct

```js
import Button from '@atlaskit/button';

import { ExampleHelper } from '../not-src';
```
