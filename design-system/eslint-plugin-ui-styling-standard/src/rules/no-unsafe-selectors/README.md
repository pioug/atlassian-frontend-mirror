Disallows unsafe selectors in CSS-in-JS style objects.

This enables static analysis and prevents regressions and incidents when migrating between styling APIs.

Use this rule alongside [no-nested-selectors](https://atlassian.design/components/eslint-plugin-ui-styling-standard/no-nested-selectors/usage) as the rules are complementary.

## Examples

### Incorrect

**No @keyframes at-rules**

Use the `keyframes` CSS-in-JS API instead.

```ts
css({
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
});
```

**No legacy pseudo-element syntax**

Use the `::` double colon syntax for pseudo-elements.

_Auto-fixer is available for this violation._

```ts
css({
  ':after': {
    content: '""',
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});
```

**No increased specificity selectors**

Use styles that do not require increased specificity.

```ts
css({
  '&&': {
    color: 'red',
  },
});
```

**No restricted at-rules**

```ts
css({
  '@scope (.article-body) to (figure)': {
    img: {
      display: 'block',
    },
  },
});
```

**No restricted pseudos**

```ts
css({
  '&:first-child': {
    width: 100,
  },
});
```

**No ambiguous pseudos**

A pseudo-selector without a leading selector is ambiguous and is interpreted differently between contexts.

Most CSS-in-JS libraries will implicitly add the nesting selector `&` before ambiguous pseudo-selectors. This is often the desired behavior.

The CSS nesting specification, CSS pre-processors, newer versions of `styled-components` (version 6+) and potentially future versions of `@emotion/*` will treat ambiguous pseudo-selectors as descendant selectors.

Use explicit selectors. Do not rely on implicit behavior for pseudo-selectors.

_Auto-fixer is available for this violation. By default a nesting selector `&` is added unless the `shouldAlwaysInsertNestingSelectorForAmbiguousPseudos` option is disabled._

```ts
css({
  /**
   * This pseudo-class has no leading selector and is ambiguous.
   */
  ':hover': {},

  /**
   * In some contexts the above is treated as implicitly containing a nesting selector.
   */
  '&:hover': {},

  /**
   * In other contexts it is treated as a descendant selector.
   *
   * (The selectors below are equivalent.)
   */
  '*:hover': {},
  '& :hover': {},
  '& *:hover': {},
});
```

**No grouped at-rules**

Do not group at-rules with the `cssMap` API.

Write flattened at-rules instead.

```ts
cssMap({
  success: {
    '@media': {
      '(min-width: 900px)': {},
      '(min-width: 1200px)': {},
    },
  },
});
```

**No selectors object**

Do not use a selectors object with the `cssMap` API.

Refactor your styles so it is not required.

```ts
cssMap({
  success: {
    selectors: {
      '&:not(:active)': {
        backgroundColor: 'white',
      },
    },
  },
});
```

### Correct

```ts
const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

css({
  animationName: fadeIn,
});
```

```ts
css({
  '::after': {
    content: '""',
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});
```

```ts
css({
  '&:first-of-type': {
    width: 100,
  },
});
```

```ts
css({
  '&:hover': {},
});
```

```ts
cssMap({
  success: {
    '@media (min-width: 900px)': {},
    '@media (min-width: 1200px)': {},
  },
});
```

```ts
cssMap({
  success: {
    backgroundColor: 'white',
    '&:active': {
      backgroundColor: 'green',
    },
  },
});
```

## Options

### `importSources: string[]`

By default, this rule will check `css` usages from:

- `@atlaskit/css`
- `@atlaskit/primitives`
- `@compiled/react`
- `@emotion/react`
- `@emotion/core`
- `@emotion/styled`
- `styled-components`

To change this list of libraries, you can define a custom set of `importSources`, which accepts an array of package names (strings).
This will override the built-in allow-list.

### `shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: boolean`

By default this rule will always fix ambiguous pseudo-selectors by inserting a leading `&` (nesting selector).

Set `shouldAlwaysInsertNestingSelectorForAmbiguousPseudos` to `false` to disable this auto-fix. When disabled, a suggestion will be provided instead of an auto-fix.
