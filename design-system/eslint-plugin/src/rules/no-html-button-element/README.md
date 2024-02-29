HTML `<button>` elements should not be used. They can be replaced using the Button component or the Pressable primitive, which are ready made solutions made by the Atlassian Design System Team. This benefits analytics as they are fitted with tracking by default and provide safe access to design tokens for styling.

## Examples

This rule marks code as violations when it can be replaced with either a Button component or a Pressable primitive.

### Incorrect

```js
<button>Click me</button>
^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Correct

```js
<Button>Click me</Button>
^^^^^^^^^^^^^^^^^^^^^^^^^
```

```js
<Pressable>Click me</Pressable>
^^^^^^^^^^^^^^^^^^^^^^^^^
```
