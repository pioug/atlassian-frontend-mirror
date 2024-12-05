# `expand-background-shorthand`

This ESLint rule enforces the expansion of the CSS `background` shorthand property into
its longhand equivalent `backgroundColor`, where the `background`'s value is an Atlassian
Design System color token and the function call originates from `@compiled/react` or `@atlaskit/css`.

## Rule details

👎 Examples of **incorrect** code for this rule:

```js
const styles = css({
	background: token('color.background.neutral.hovered'),
});
```

👍 Examples of **correct** code for this rule:

```js
const styles = css({
	backgroundColor: token('color.background.neutral.hovered'),
});
```
