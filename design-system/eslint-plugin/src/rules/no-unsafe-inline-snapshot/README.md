This rule enforces guardrails on `toMatchInlineSnapshot()` usage to prevent snapshots from becoming
too large or containing internal implementation details.

## Examples

### Incorrect

```tsx
// Snapshot exceeds 100 lines
expect(container).toMatchInlineSnapshot(`
  ${Array(101).fill('<div>line</div>').join('\n')}
`);

// Contains className attribute
expect(container).toMatchInlineSnapshot(`<div className="my-class">test</div>`);

// Contains style attribute
expect(container).toMatchInlineSnapshot(`<div style="color: red">test</div>`);

// Contains style block
expect(container).toMatchInlineSnapshot(`
  <div>
    <style>.test { color: red; }</style>
  </div>
`);
```

### Correct

```tsx
// Small snapshot without internal details
expect(container).toMatchInlineSnapshot(`<div>test</div>`);

// className marked as REDACTED
expect(container).toMatchInlineSnapshot(`<div className="REDACTED">test</div>`);

// style marked as REDACTED
expect(container).toMatchInlineSnapshot(`<div style="REDACTED">test</div>`);

// style block containing REDACTED
expect(container).toMatchInlineSnapshot(`
  <div>
    <style>REDACTED</style>
  </div>
`);
```

## Rationale

Inline snapshots should focus on testing the structure and content of components, not their internal
implementation details. This rule helps ensure that:

1. **Snapshots remain maintainable**: By limiting snapshots to 100 lines, they stay readable and
   easier to review
2. **Implementation details are hidden**: className and style attributes are implementation details
   that can change frequently and make snapshots brittle
3. **Tests focus on behavior**: By excluding internal details, tests focus on what the component
   renders, not how it's styled

If you need to include className or style information in a snapshot for testing purposes, mark them
as `"REDACTED"` to indicate that these are intentionally excluded implementation details.

## When not to use it

This rule should be enabled for all test files to ensure consistent snapshot testing practices
across the codebase.
