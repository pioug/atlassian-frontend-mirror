ButtonGroup should have an accessible name or a reference to it, so that upon opening, users of
assistive technologies could have contextual information of interaction with current element.

## Examples

This rule will indicate user with warning to strongly recommend usage of either `label` or `titleId`
prop.

### Incorrect

```tsx
<ButtonGroup>
 ^^^^^^^^^^^ Missing either `label` or `titleId` prop.
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>

<ButtonGroup label="">
             ^^^^^ `label` prop is missing accessible name value.
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>

<h2 id="button-group-title">ButtonGroup content title</hi>
<ButtonGroup titleId="">
             ^^^^^^^ `titleId` prop is missing reference value.
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>

<h2 id="button-group-title">ButtonGroup content title</h2>
<ButtonGroup titleId="button-group-title" label="">
             ^^^^^^^                      ^^^^^ Do not include both `titleId` and `label` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `label` to provide accessible name explicitly.
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>
```

### Correct

```tsx
<ButtonGroup label="ButtonGroup content title">
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>

<h2 id="button-group-title">ButtonGroup content title</h2>
<ButtonGroup titleId="button-group-title">
  <Button>Save</Button>
  <Button>Edit</Button>
  <Button>Delete</Button>
</ButtonGroup>
```
