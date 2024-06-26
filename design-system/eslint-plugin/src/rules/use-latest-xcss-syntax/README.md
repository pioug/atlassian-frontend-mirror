## Description

Soon, non-token values for the following properties will raise TypeScript errors. This rule prevents
new violations from being written until blockers are resolved.

## Examples

### Incorrect

```jsx
const someStyles = xcss({
  margin: '8px';
          ^^^^^
})
```

### Correct

```jsx
const someStyles = xcss({
  margin: 'space.100';
})
```

See the list of available space tokens on the
[ADS website](https://atlassian.design/foundations/spacing#space-tokens).

For Atlassians:

- See [go/xcss-spacing](https://go.atlassian.com/xcss-spacing) for context on why this is happening,
  and how you can prepare.
