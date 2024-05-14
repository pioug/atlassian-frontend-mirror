Ensures usage of `@compiled/react` over other CSS-in-JS libraries.

**WARNING**

It may be unsafe to mix usages of `@compiled/react` with other CSS-in-JS libraries.

When converting to `@compiled/react` verify ALL changes.

For this reason, the auto-fixer has been disabled by default.

## Examples

### Incorrect

```js
import { css } from '@emotion/core';
import styled from '@emotion/styled';
```

```js
/** @jsx jsx */
import { jsx } from '@emotion/react';
```

```js
import styled, { css } from 'styled-components';
```

### Correct

```js
import { css, styled } from '@compiled/react';
```

```js
/** @jsx jsx */
import { jsx } from '@compiled/react';
```

## Options

### `canAutoFix: boolean`

Determines whether or not the auto-fixer is enabled.

Defaults to `false` due to safety concerns when mixing Compiled and other CSS-in-JS libraries.

Even when enabled, the auto-fixer will only convert usages that are deemed safe.
Currently this is limited to purely static styles where all keys and values are simple literals.
