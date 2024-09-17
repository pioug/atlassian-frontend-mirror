TagGroup should have an accessible name or a reference to it, so that upon opening, users of
assistive technologies could have contextual information of interaction with current element.

## Examples

This rule will indicate user with warning to strongly recommend usage of either `label` or `titleId`
prop.

### Incorrect

```tsx
<TagGroup>
 ^^^^^^^^ Missing either `label` or `titleId` prop.
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>

<TagGroup label="">
          ^^^^^ `label` prop is missing accessible name value.
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>

<h2 id="tag-group-title">TagGroup content title</hi>
<TagGroup titleId="">
          ^^^^^^^ `titleId` prop is missing reference value.
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>

<h2 id="tag-group-title">TagGroup content title</h2>
<TagGroup titleId="tag-group-title" label="">
          ^^^^^^^                   ^^^^^ Do not include both `titleId` and `label` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `label` to provide accessible name explicitly.
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>
```

### Correct

```tsx
<TagGroup label="TagGroup content title">
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>

<h2 id="tag-group-title">TagGroup content title</h2>
<TagGroup titleId="tag-group-title">
  <Tag text="Jira">
  <Tag text="Confluence">
  <Tag text="Platform">
</TagGroup>
```
