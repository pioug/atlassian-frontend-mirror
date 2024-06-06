Section should have an accessible title or a reference to it, so that users of assistive
technologies could have contextual information of interaction with current element.

## Examples

This rule will indicate user with warning to strongly recommend usage of either `title` or `titleId`
prop.

### Incorrect

```tsx
<Section>
 ^^^^^^ Missing either `title` or `titleId` prop.
  Section content
</Section>

<Section title>
         ^^^^^ `title` prop is missing value.
  Section content
</Section>

<Section title="">
         ^^^^^ `title` prop is missing accessible name value.
  Section content
</Section>

<Section titleId>
         ^^^^^^^ `titleId` prop is missing reference value.
  <h1 id="section-title">Section content title</hi>
</Section>

<Section titleId="">
         ^^^^^^^ `titleId` prop is missing reference value.
  <h1 id="section-title">Section content title</hi>
</Section>

<Section titleId="section-title" title="Accessible title">
         ^^^^^^^                 ^^^^^ Do not include both `titleId` and `title` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `title` to provide accessible name explicitly.
  <h1 id="section-title">Section content title</hi>
</Section>
```

### Correct

```tsx
<Section title="Section content title">
  Section content
</Section>

<Section titleId="section-title">
  <h1 id="section-title">Section content title</hi>
</Section>
```
