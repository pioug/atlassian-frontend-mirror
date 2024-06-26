Using primitives allows you to delete bespoke component code and replace it with ready made
solutions made by the Atlassian Design System Team.

## Examples

This rule marks code as violations when it can be replaced 1:1 with a primitive component.

### Incorrect

```jsx
const someStyles = css({
  padding: '8px';
})

<div css={someStyles}>
^^^^^^^^^^^^^^^^^^^^^^
  // ...
</div>
```

### Correct

```jsx
const someStyles = xcss({
  padding: 'space.100';
})

<Box xcss={someStyles}>
  // ...
</Box>
```

Currently, the rule is extremely defensive, only reporting on `css` styles that contain:

- one, and only one, style property from this list:

  - padding
  - paddingBlock
  - paddingBlockEnd
  - paddingBlockStart
  - paddingBottom
  - paddingInline
  - paddingInlineEnd
  - paddingInlineStart
  - paddingLeft
  - paddingRight
  - paddingTop
  - margin
  - marginBlock
  - marginBlockEnd
  - marginBlockStart
  - marginBottom
  - marginInline
  - marginInlineEnd
  - marginInlineStart
  - marginLeft
  - marginRight
  - marginTop

- and where the style value is one of:
  - 0px
  - 2px
  - 4px
  - 6px
  - 8px
  - 12px
  - 16px
  - 20px
  - 24px
  - 32px
  - 40px
  - 48px
  - 64px
  - 80px

If these conditions are not met, then no violation will be reported.
