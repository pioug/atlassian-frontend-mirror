# no-deprecated-design-token-usage

Disallow usage of deprecated design tokens.

```css
a {
  color: var(--ds-background-brand, #e9f2ff);
  /*         ↑ Deprecated tokens like this */
}
```

## Autofix

Replaces deprecated tokens with the recommended replacement token.

## Options

`true`

The following patterns are considered problems:

```css
a {
  color: var(--ds-background-brand, #e9f2ff);
}
```

The following patterns are _not_ considered problems:

```css
a {
  color: var(--ds-text-selected, #e9f2ff);
}
```
