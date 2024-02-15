# CSS

Style components backed by Atlassian Design System design tokens powered by Compiled CSS-in-JS.

## Installation

First [set up Compiled](https://compiledcssinjs.com/docs/installation).

```sh
yarn add @atlaskit/css
```

Update your Compiled config to have `importSources` point to `@atlaskit/css`:

```diff
{
+  "importSources": ["@atlaskit/css"]
}
```

## Usage

```jsx
import { css } from '@atlaskit/css';

const basicStyles = css({
  color: 'var(--ds-link)',
});

<div css={basicStyles} />;
```
