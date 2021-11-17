import React from 'react';

import { code, DevPreviewWarning, md } from '@atlaskit/docs';

export default md`

${(<DevPreviewWarning />)}

This package exposes key functionality for using and maintaining Atlassian's design tokens and themes.

> Tokens are a single source of truth to name and store Atlassian design decisions.

See the [tokens reference](tokens/docs/tokens-reference) for the full list of available design tokens.

## Installation

${code`yarn add @atlaskit/tokens`}

## Usage

### Setup your environment

Before continuing ensure the CSS themes are installed, depending on your bundler, configuration may differ.

${code`
import '@atlaskit/tokens/css/atlassian-light.css';
import '@atlaskit/tokens/css/atlassian-dark.css';
`}

Themes will now be available for use by your application like so:

${code`
html[data-theme="light"] {
  --ds-background-sunken: #091E4208;
  --ds-background-default: #FFFFFF;
  --ds-background-card: #FFFFFF;
  --ds-background-overlay: #FFFFFF;
  ...
}

html[data-theme="dark"] {
  --ds-background-sunken: #03040442;
  --ds-background-default: #161A1D;
  --ds-background-card: #1D2125;
  --ds-background-overlay: #22272B;
  ...
}
`}

### Switching themes

Switching themes globally at runtime is now a simple matter of updating the \`data-theme\` attribute on your application's html tag.

${code`<html data-theme="dark" />`}

To make this easier we provide a \`setGlobalTheme\` method.

${code`
import { setGlobalTheme } from '@atlaskit/tokens';

setGlobalTheme('dark');
`}

### Using tokens

Accessing individual tokens can be done by simply using the css-variables mounted to the page.
However, it's best to always use the \`token()\` method to ensure you have proper prefixes, typechecking and linting.
So if a token ever changes, is deleted or used incorrectly you will know instantly.

The \`token\` function takes a dot-seperated token name and returns a valid [CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for the corresponding token.

_Note: This method will throw if an unknown token is provided._

${code`
import { token } from '@atlaskit/tokens';

token('color.background.default'); // var(-ds-color-background-default)
`}

If your application is not fully dependant on tokens, for example if you intend to iteratively migrate your application over bit-by-bit.
Using a fallback color from the \`@atlaskit/theme\` package is recommended. Meaning that you will not need to have the themes mounted
to the page globally at all times and can hide them behind a feature flag or user setting while you complete your migration.

The token method mirrors CSS custom properties, in that it allows you to provide a second argument that will only be activated if
a CSS custom property is not available at runtime.

${code`
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

token('color.background.default', N0); // var(-ds-color-background-default, #FFFFFF)
`}
`;
