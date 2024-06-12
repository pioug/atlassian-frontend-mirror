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
a {
	color: #fff;
}
```

```css
div {
	background-color: #ff0000;
}
```

The following patterns are _not_ considered problems:

```css
a {
	color: var(--ds-text-inverse, #ffff);
}
```

```css
div {
	background-color: var(--ds-text-accent-red, #ff0000);
}
```
