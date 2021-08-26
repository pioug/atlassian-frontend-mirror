# Tokens

> ⚠️ This package is under development and comes with no semver guarantees,
> your app will break if you use this directly.

Tokens are a single source of truth to name and store Atlassian design decisions.

## Installation

```sh
yarn add @atlaskit/tokens
```

## Usage

### Setup your environment

Before continuing ensure the CSS themes are installed,
depending on your bundler configuration may differ.

```tsx
import '@atlaskit/tokens/css/atlassian-light.css';
import '@atlaskit/tokens/css/atlassian-dark.css';
```

### Token

Use the `token` function to get a [CSS variable](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for the named token.

```tsx
import { token } from '@atlaskit/tokens';

token('color.background.default');
```

### Set global theme

Change the global theme during runtime.

```tsx
import { setGlobalTheme } from '@atlaskit/tokens';

setGlobalTheme('light');
```
