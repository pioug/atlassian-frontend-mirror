# no-unsafe-design-token-usage

Disallow usage of non-existent or deleted design tokens. Optionally will disallow token usage without fallbacks specified.

```css
a {
  color: var(--ds-background-brand, #E9F2FF);
  /*         ↑ Deprecated tokens like this */
}
```
## Autofix

Replaces deleted tokens with the recommended replacement token. This may not work if the token has been hard deleted.
## Options

`true`

The following patterns are considered problems:

```css
/* Does not exist */
p { color: var(--ds-non-existent); }
```

```css
/* Deleted token */
div {  background-color: var(--ds-background-overlay); }
```

The following patterns are *not* considered problems:

```css
div { background-color: var(--ds-surface-overlay); }
```


`shouldEnsureFallbackUsage: true`

Ensures the CSS variable has a fallback specified.

The following patterns are considered problems:

```css
/* Missing a fallback */
a { color: var(--ds-text-brand); }
```

The following patterns are *not* considered problems:

```css
div { background-color: var(--ds-surface-overlay, #FFFFFF); }
```
