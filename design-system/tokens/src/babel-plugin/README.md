# BabelPluginTokens

A babel plugin to optimize performance and automatically add fallbacks for Design System tokens.

It replaces any calls to the `@atlaskit/tokens` token() function with the CSS value the function
would return (i.e. var(--token-name) or var(--token-name, {fallback}).

If there is a fallback defined in code, it’s inserted into the style (expressions are inserted using
template strings). If there is no fallback defined, the plugin can optionally find the token’s value
from the theme selected as default (light or legacy-light), and set it as the fallback.

## Usage

Add the plugin to your babel configuration:

```json
{
	"plugins": [
		[
			"@atlaskit/tokens/babel-plugin",
			{
				"shouldUseAutoFallback": false,
				"defaultTheme": "light",
				"shouldForceAutoFallback": false,
				"forceAutoFallbackExemptions": []
			}
		]
	]
}
```

### Options

- **`shouldUseAutoFallback`** (boolean, default: `true`): When enabled, the plugin will fetch the
  token's value from the default theme (either `light` or `legacy-light`) and use it as the fallback
  value.

- **`defaultTheme`** (string, default: `"light"`): Specifies the default theme to use for fetching
  token values. Supported values are `"light"` and `"legacy-light"`.

- **`shouldForceAutoFallback`** (boolean, default: `false`): When enabled, the plugin will enforce
  fallback values for all tokens unless they are exempted.

- **`forceAutoFallbackExemptions`** (array of strings, default: `[]`): A list of token name prefixes
  that should be exempted from forced fallback values. Please note that border.radius tokens are
  always skipped (regardless of this parameter) since they are not supported in the current ADS
  themes.

This is useful for cases where tokens are in use, but token definitions aren't present in the
top-level page CSS.
