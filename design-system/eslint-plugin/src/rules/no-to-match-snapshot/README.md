This rule disallows the use of Jest snapshot matchers in unit tests:

- `toMatchSnapshot()`
- `toMatchInlineSnapshot()`

Use explicit assertions instead (for example `toEqual`, `toMatchObject`, `toContain`, or Testing
Library assertions like `toHaveTextContent`).

## Examples

### Incorrect

```tsx
expect(container).toMatchSnapshot();
expect(container).toMatchSnapshot('snapshot-name');
expect(screen.getByTestId('test')).toMatchSnapshot();
```

### Correct

```tsx
expect(container).toEqual(expect.any(HTMLElement));
expect(container.querySelector('span')).not.toBeNull();

// Testing Library examples
expect(screen.getByText('test')).toBeInTheDocument();
expect(screen.getByTestId('my-thing')).toHaveTextContent('test');
```

## Rationale

Snapshot matchers are intentionally disallowed in unit tests to avoid brittle, hard-to-review
baselines.

Instead of snapshots, assert on the specific behavior you care about (text, attributes, structure,
and key style properties) using explicit assertions.

If you’re migrating an existing snapshot-based test, a good approach is:

- replace snapshots with focused `toEqual` / `toMatchObject` assertions for data objects
- prefer Testing Library queries/assertions for UI behavior
- if you need to validate styles, assert on specific resolved style properties rather than a whole
  serialized blob

## When not to use it

This rule should be enabled for unit test files to enforce the snapshot-ban policy across the
codebase.

> Note: ESLint rule fixture tests may still include snapshot matcher examples because they exist to
> validate the lint rule behavior.
