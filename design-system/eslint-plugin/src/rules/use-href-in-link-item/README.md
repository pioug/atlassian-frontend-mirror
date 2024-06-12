The `LinkItem` component in `@atlaskit/menu` will be requiring the `href` prop in future releases.
If no valid `href` prop is required, consider using the `ButtonItem` component.

## Examples

### Incorrect

```tsx
<LinkItem>Button</LinkItem>
 ^^^^^^^^
```

### Correct

```tsx
<LinkItem href="http://example.com">Link</LinkItem>
```
