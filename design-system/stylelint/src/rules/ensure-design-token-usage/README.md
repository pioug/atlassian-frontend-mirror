# ensure-design-token-usage

Disallow colors which are not sourced from the global theme using design token CSS variables.

```css
a {
  color: #fff;
  /*     ↑ Colors like this */
}
```

## Options

`true`

The following patterns are considered problems:

```css
a { color: #FFF; }
```

```css
div { background-color: #FF0000; }
```

The following patterns are *not* considered problems:

```css
a { color: var(--ds-text-inverse, #FFFF); }
```

```css
div { background-color: var(--ds-text-accent-red, #FF0000); }
```
