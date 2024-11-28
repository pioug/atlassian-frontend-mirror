# `shorthand-property-sorting`

This ESLint rule enforces the expansion of CSS `border` shorthand property, into it's longhand
equivalents `borderStyle`, `borderWidth`, `borderColor`, for packages that originates from
`@compiled/react`, and `@atlaskit/css`.

## Rule details

👎 Examples of **incorrect** code for this rule:

```js
const styles = css({
	border: '1px solid black',
});

const styles = css({
	border: '1px solid',
});

const styles = css({
	border: '1px',
});
```

👍 Examples of **correct** code for this rule:

```js
const styles = css({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'black',
});
```

```js
const styles = css({
	border: '0', // exempted from our ESLint rule
});

const styles = css({
	border: 'none', // exempted from our ESLint rule
});

const styles = css({
	border: 'unset', // exempted from our ESLint rule
});

const styles = css({
	border: 'none !important', // exempted from our ESLint rule
});
```
