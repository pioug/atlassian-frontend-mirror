# BabelPluginTokens

A babel plugin to optimize performance and automatically add fallbacks for Design System tokens.

It replaces any calls to the `@atlaskit/tokens` token() function with the CSS value the function would return (i.e. var(--token-name) or var(--token-name, {fallback}).

If there is a fallback defined in code, it’s inserted into the style (expressions are inserted using template strings).
If there is no fallback defined, the plugin can optionally find the token’s value from the default Atlassian theme, and sets it as the fallback.

## Usage

Add the plugin to your babel configuration:

```
{
  "plugins": ["@atlaskit/babel-plugin-tokens"]
}
```

### Options

Currently the plugin supports one option, `shouldUseAutoFallback`. When enabled, the plugin will fetch the token's value in the default theme(s) (currently `light spacing`) and use it as the fallback value.

This is useful for cases where tokens are in use, but token definitions aren't present in the top-level page CSS.
