Design System layering surfaces, such as popup, tooltip, modal and drawer, are moving out of React
portals and into the browser top layer. The surface host, a `<div popover>` or a `<dialog>`, now
sits in your DOM, inside the element that renders it.

Your selectors can now reach it, in two ways:

- **The host receives your styles.** `& > div { padding: 0 }` never reached a portalled surface. Now
  it does, because the host is a `<div>`.
- **The host displaces your elements.** `& > *:first-child` counts the host too. When the host is
  first, your real first child stops matching.

`<style>`, `<script>`, `<template>`, `<link>` and `<noscript>` do the same. SSR and style injection
put them in the DOM, and positional selectors count them.

This rule finds these selectors. Where it can, it autofixes them without changing specificity.

For the full reasoning, see the top layer unsafe selectors decision doc, at
`platform/packages/design-system/top-layer/notes/decisions/top-layer-unsafe-selectors.md` in the
Atlassian Frontend monorepo.

## Examples

The rule checks `css`, `cssMap`, `xcss` and `styled` calls, `css` and `styled` tagged templates, and
object literals in the `css` prop.

**The autofix** adds a `:not(:where(…))` guard to each compound that a host can match. `:where()`
has no specificity, so the rule's weight does not change. The guard has two forms:

- **Narrow**, after `>`, `+` or `~`: excludes the host elements (`[popover], dialog`).
- **Wide**, after a descendant combinator: also excludes everything inside a surface
  (`[popover] *, dialog *`), because a surface can sit between the two compounds.

**No autofix** is possible for some selectors. The rule reports them, and you must change the code:

- **Positional pseudo-classes**: `:first-child`, `:last-child`, `:only-child`, `:nth-child()`,
  `:nth-last-child()` and their `:not()` forms. The only guard needs an `of S` clause, and
  Compiled's extract mode drops any rule that has one.
- **Of-type pseudo-classes**: `:first-of-type`, `:nth-of-type()` and the rest of the family. They
  count by tag name, so no guard can fix the count.
- **Some other patterns**, such as `:empty`, `& + span`, and `:hover` or `:focus-within` on a
  matched element. The report message gives the reason.

To fix these, name the element you mean with a class or a `data-` attribute. No host carries your
class, so the selector is safe and needs no guard.

### Incorrect

```tsx
import { css } from '@atlaskit/css';

// The host is a `<div>`, so it receives this.
css({ '& > div': { padding: 0 } });

// A surface can sit between `&` and the `div`, and its internals match.
css({ '& div': { padding: 0 } });

// Reported with no autofix: the host can take the first slot.
css({ '& > *:first-child': { marginBlockStart: 0 } });
```

### Correct

```tsx
import { css } from '@atlaskit/css';

// Narrow guard, after `>`.
css({
	'& > div:not(:where([popover], dialog))': { padding: 0 },
});

// Wide guard, after a descendant combinator.
css({ '& div:not(:where([popover], dialog, [popover] *, dialog *))': { padding: 0 } });

// Name the element instead of counting it.
css({ '& > .first-item': { marginBlockStart: 0 } });

// No host is a `<span>` or carries your class, so a child selector for either is safe.
css({ '& > span': { padding: 0 } });
css({ '& > .body': { padding: 0 } });
```

Write the guard in full at each site. Do not put it in a constant: the ratchet matches source text.

## Options

### `importSources`

The modules whose `css`, `cssMap`, `styled` and `xcss` exports the rule checks. Defaults to the
standard set.

### `reportSelectorsWithNoGuardForm`

`boolean`, default `true`. Report selectors that have no autofix. Turning this off also hides every
positional selector.

### `reportDynamicSelectors`

`boolean`, default `false`. Report selectors the rule skipped: selectors built from template
interpolations, and selectors that do not parse.

## When not to use it

If you target a surface on purpose with `[popover]` or `dialog`, the rule does not change that
compound.

The rule cannot see selectors in `.css` files, `injectGlobal` or `createGlobalStyle` bodies.
