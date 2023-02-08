# Tokens

Tokens are a single source of truth to name and store Atlassian design decisions.

## Installation

```sh
yarn add @atlaskit/tokens
```

## Usage

### Set global theme

To load and set themes into your app, call setGlobalTheme during runtime.

```tsx
import { setGlobalTheme } from '@atlaskit/tokens';

setGlobalTheme({ colorMode: 'light', light: 'light', dark: 'dark' });
```

### Token

Use the `token` function to get a [CSS variable](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for the named token.

```tsx
import { token } from '@atlaskit/tokens';

token('color.background.default');
```

### Learn more

To learn more about the tokens package API, view the [token package docs on atlassian.design](https://atlassian.design/components/tokens/code)

# BabelPlugin

A babel plugin to optimise performance and support fallbacks for Design System tokens.

It replaces any calls to the `@atlaskit/tokens` token() function with the CSS value the function would return (i.e. var(--token-name) or
variations with fallbacks).

If there’s no fallback, the plugin (optionally) finds the token’s value from the default Atlassian theme, and sets it as the fallback.

If there is a fallback defined in code, it’s inserted into the style (expressions are inserted using template strings).

## Usage

Add the plugin to your babel configuration:

```
{
  "plugins": ["@atlaskit/tokens/babel-plugin"]
}
```

### Options

Currently the plugin supports one option, `shouldUseAutoFallback`. When enabled, the plugin will fetch the token's value in the default
Atlassian theme (currently `atlassian-light`) and use it as the fallback value.

This is useful for cases where tokens are in use, but token definitions aren't present in the top-level page CSS.
