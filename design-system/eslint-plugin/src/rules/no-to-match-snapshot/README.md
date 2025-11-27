This rule disallows the use of `toMatchSnapshot()` in favor of `toMatchInlineSnapshot()`.

## Examples

### Incorrect

```tsx
expect(container).toMatchSnapshot();
expect(container).toMatchSnapshot('snapshot-name');
expect(screen.getByTestId('test')).toMatchSnapshot();
```

### Correct

```tsx
expect(container).toMatchInlineSnapshot(`<div>test</div>`);
expect(container).toMatchInlineSnapshot(`
  <div>
    <span>test</span>
  </div>
`);
```

## Rationale

The use of `toMatchSnapshot()` is being deprecated in favor of `toMatchInlineSnapshot()` as part of
[DSTRFC-038](https://hello.atlassian.net/wiki/spaces/DST/pages/6105892000/DSTRFC-038+-+Removal+of+.toMatchSnapshot).
Inline snapshots provide several benefits:

- They keep the snapshot value close to the test code, making it easier to review changes
- They reduce the number of separate snapshot files that need to be maintained
- They make it clearer what the expected output is when reading the test

## When not to use it

This rule should be enabled for all test files to ensure consistent snapshot testing practices
across the codebase.
