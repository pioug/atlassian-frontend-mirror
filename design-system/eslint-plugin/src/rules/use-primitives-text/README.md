Using primitives allows you to delete bespoke component code and replace it with ready made solutions made by the Atlassian Design System Team.

## Examples

This rule marks code as violations when it can be replaced 1:1 with one or multiple primitive components.

### Incorrect

```jsx
<span>^^^^^^^^^^^^^^^^^^^^^^ // ...</span>
```

### Correct

```jsx
<Text variant="ui">// ...</Text>
```

Currently, the rule is extremely defensive, only reporting on certain p, span, strong and em elements that don't have any props outside of `key`, `id` and `data-testid`.
