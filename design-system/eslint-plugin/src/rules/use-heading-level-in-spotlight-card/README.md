The `SpotlightCard` component in `@atlaskit/onboarding` will be requiring the `headingLevel` prop in future releases.

## Examples

### Incorrect

```tsx
<SpotlightCard heading="Heading">Spotlight card contents</SpotlightCard>
 ^^^^^^^^^^^^^
```

### Correct

```tsx
<SpotlightCard heading="Heading" headingLevel={2}>
  Spotlight card contents
</SpotlightCard>
```
