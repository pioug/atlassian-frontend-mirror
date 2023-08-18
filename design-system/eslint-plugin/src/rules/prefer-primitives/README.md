Using primitives allows you to delete bespoke component code and replace it with ready made solutions made by the Atlassian Design System Team.

## Examples

This rule marks code as violations when it may be able to be replaced with a primitive component.

### Incorrect

```js
<div />
^^^^^^^

<Component>
  <div css={someStyles}></div>
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
</Component>
```

### Correct

```js
<Box />
```

```js
<Component>
  <Box xcss={someStyles}></Box>
</Component>
```
