# no-deprecated-design-token-usage

Disallow usage of deprecated design tokens.

```css
a {
  color: var(--ds-background-brand, #E9F2FF);
  /*         ↑ Deprecated tokens like this */
}
```

## Autofix

Replaces deprecated tokens with the recommended replacement token.

## Options

`true`

The following patterns are considered problems:

```css
a { color: var(--ds-background-brand, #E9F2FF); }
```

The following patterns are *not* considered problems:

```css
a { color: var(--ds-text-selected, #E9F2FF); }
```

