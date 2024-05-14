Popup should have an accessible name or a reference to it when `role="dialog"`, so that upon opening, users of assistive technologies could have contextual information of interaction with current element.

## Examples

This rule will indicate user with warning to strongly recommend usage of either `label` or `titleId` prop.

### Incorrect

```tsx
<Popup role="dialog">
 ^^^^^^ Missing either `label` or `titleId` prop.
  Popup content
</Popup>

<Popup role="dialog" label>
                     ^^^^^ `label` prop is missing value.
  Popup content
</Popup>

<Popup role="dialog" label="">
                     ^^^^^ `label` prop is missing accessible name value.
  Popup content
</Popup>

<Popup role="dialog" titleId>
                     ^^^^^^^ `titleId` prop is missing reference value.
  <h1 id="popup-title">Popup content title</hi>
</Popup>

<Popup role="dialog" titleId="">
                     ^^^^^^^ `titleId` prop is missing reference value.
  <h1 id="popup-title">Popup content title</hi>
</Popup>

<Popup role="dialog" titleId="popup-title" label="">
                     ^^^^^^^               ^^^^^ Do not include both `titleId` and `label` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `label` to provide accessible name explicitly.
  <h1 id="popup-title">Popup content title</hi>
</Popup>
```

### Correct

```tsx
<Popup role="dialog" label="Popup content title">
  Popup content
</Popup>

<Popup role="dialog" titleId="popup-title">
  <h1 id="popup-title">Popup content title</hi>
</Popup>
```
