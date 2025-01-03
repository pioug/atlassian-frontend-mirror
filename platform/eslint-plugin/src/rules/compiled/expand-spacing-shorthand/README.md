# `expand-spacing-shorthand`

This ESLint rule enforces the expansion of the CSS `padding` and `margin` shorthand properties into
its longhand equivalent `{spacing}Top`, `{spacing}Right`, `{spacing}Bottom`, `{spacing}Left`, where 
the property's value is either an Atlassian Design System token or a template literal which contains
a token, and the function call originates from `@compiled/react` or `@atlaskit/css`. 

## Rule details

👎 Examples of **incorrect** code for this rule:

```js
const styles = css({
	padding: token('space.200'),
});

const styles = css({
	margin: `${token('space.100')} 0 2px`,
});
```

👍 Examples of **correct** code for this rule:

```js
const styles = css({
	paddingTop: token('space.200'),
    paddingRight: token('space.200'),
    paddingBottom: token('space.200'),
    paddingLeft: token('space.200'),
});

const styles = css({
	marginTop: token('space.100'),
    marginRight: 0,
    marginBottom: '2px',
    marginLeft: 0,
});
```
