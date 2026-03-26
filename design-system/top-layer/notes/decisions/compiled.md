# Top-Layer Styling: Compiled Gap Analysis

## Overview

The top-layer package has styling that bypasses Compiled in several places. This document walks
through each gap, shows what the code looks like today, and what it could look like if Compiled
supported it.

---

## Change 1: Add `:popover-open` pseudo-class to Compiled types + ESLint

**Complexity:** Trivial. Two one-line additions in known locations, plus tests.

**Browser support:** CSS Selectors Level 4. Chrome 114+ (May 2023), Firefox 125+ (Apr 2024), Safari
17+ (Sept 2023). Same baseline as the Popover API itself — if top layer works, `:popover-open`
works. **Within our browser matrix.**

`:popover-open` is the browser pseudo-class that matches a popover element while it's showing. It's
equivalent to `[open]` for dialogs. Currently not recognized by Compiled's `CSSPseudoClasses` type
or the ESLint `allowedPseudos` list.

### Before

Raw CSS string because `:popover-open` can't be used in `cssMap`:

```typescript
const FADE_CSS = `
[data-ds-popover-fade]:popover-open {
  opacity: 1;
  transition-duration: 350ms;
}
`;
```

### After

`:popover-open` works in `cssMap` like any other pseudo-class:

```typescript
const styles = cssMap({
	fade: {
		opacity: 0,
		transition:
			'opacity 175ms cubic-bezier(0.15, 1, 0.3, 1), overlay 175ms allow-discrete, display 175ms allow-discrete',
		'&:popover-open': {
			opacity: 1,
			transitionDuration: '350ms',
		},
	},
});
```

**What to change:**

1. `@compiled/react` source (`types.ts`): add `| '&:popover-open'` to the `CSSPseudoClasses` union —
   this is a single string literal addition to an existing union type on one line
2. `packages/design-system/eslint-plugin-ui-styling-standard/src/rules/no-unsafe-selectors/constants.tsx`:
   add `'&:popover-open'` to the `cssPseudos` array — one line, and the `allowedPseudos` Set is
   derived automatically
3. Update/add unit tests for both

---

## ~~Change 2: Add `@starting-style` to ESLint `ignoredAtRules`~~ (Done)

`@starting-style` is already in the `ignoredAtRules` Set in
`packages/design-system/eslint-plugin-ui-styling-standard/src/rules/no-unsafe-selectors/constants.tsx`,
alongside `@container`, `@media`, `@supports`, and `@property`. The `navigation-system` package
already uses `@starting-style` in `cssMap` without any `eslint-disable` comments.

---

## Change 3: Add `@position-try` to Compiled types + ESLint

**Complexity:** ESLint part is trivial (same as Change 2). Compiled part is unknown — needs
investigation into whether the SWC transformer can emit global at-rules, which may require
architectural changes.

**Browser support:** CSS Anchor Positioning Level 1. Same support as CSS Anchor Positioning overall
— Chrome 125+ (May 2024), Firefox 131+ (Oct 2024), Safari 18.2+ (Dec 2024). **94% of Jira users**
per project-goals.md, with gaps in ~27% of Safari users and ~31% of Firefox users (those on older
majors). Within our browserslist policy.

`@position-try` defines named fallback positions for CSS Anchor Positioning. Currently the arrow
preset injects these as raw CSS strings.

### Before

Raw CSS string with named `@position-try` rules:

```typescript
const ARROW_CSS = `
@position-try --ds-arrow-block-start {
  position-area: block-start;
  margin: 0;
  margin-block-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-block-end {
  position-area: block-end;
  margin: 0;
  margin-block-start: var(--ds-arrow-size, 8px);
}
/* ... 8 more @position-try rules ... */
`;
```

### After

`@position-try` as a recognized at-rule in Compiled types:

```typescript
const styles = cssMap({
	arrowBlockStart: {
		'@position-try --ds-arrow-block-start': {
			positionArea: 'block-start',
			margin: 0,
			marginBlockEnd: 'var(--ds-arrow-size, 8px)',
		},
	},
	// ...
});
```

**Note:** `@position-try` is structurally different from `@media`/`@supports` — it defines a named
rule, not a conditional block. Whether Compiled's compiler can handle `@position-try --name { ... }`
as a top-level at-rule (not scoped to a class) needs investigation. This may not be expressible in
`cssMap` at all since it's a global named rule, not a component-scoped style.

**What to change:**

1. ESLint (easy): Add `'@position-try'` to `ignoredAtRules` in the ESLint plugin — one line
2. Compiled (hard/unknown): `@position-try` is a global named at-rule (like `@keyframes`). Compiled
   already handles `@keyframes` specially — need to investigate whether the same mechanism can be
   extended to `@position-try`. The SWC transformer would need to:
   - Recognize `@position-try --name` as a global at-rule
   - Emit it unscoped (not wrapped in a class selector)
   - Deduplicate across components that reference the same rule name

---

## Change 4: Allow `var(--*)`, `calc(...)`, and `'none'` in `cssMap` value types

**Complexity:** Medium. Multiple type changes across a code-generated schema, requiring careful
thought about how permissive to be without losing type safety.

**Browser support:** N/A — `var()`, `calc()`, and `none` are universally supported CSS features.
This is purely a Compiled type system gap.

The value types for `cssMap` come from `DesignTokenStyles`, which is code-generated by
`packages/design-system/tokens/scripts/style-dictionary/formatters/typescript-css-type-schema.tsx`.
The generated output lives at
`packages/design-system/tokens/src/entry-points/css-type-schema.codegen.tsx`. Several CSS values in
`dialog-content.tsx` require `@ts-expect-error` because the strict types don't accept them.

### Before

Three `@ts-expect-error` comments in the `dialog-content.tsx` `cssMap` block, plus two in
`popover.tsx`:

```typescript
// dialog-content.tsx
const styles = cssMap({
	dialog: {
		// @ts-expect-error -- cssMap types do not include 'none'
		maxWidth: 'none',
		// @ts-expect-error -- cssMap types do not include 'none'
		maxHeight: 'none',
		'&::backdrop': {
			// @ts-expect-error -- cssMap types do not include blanket token
			backgroundColor: token('color.blanket'),
		},
	},
});

// popover.tsx
const styles = cssMap({
	root: {
		// @ts-expect-error -- cssMap types do not include 'auto' for inset
		inset: 'auto',
		// @ts-expect-error -- cssMap types do not include 'transparent' for background
		background: 'transparent',
	},
});
```

### After

All values accepted natively, no `@ts-expect-error`:

```typescript
// dialog-content.tsx
const styles = cssMap({
	dialog: {
		maxWidth: 'none',
		maxHeight: 'none',
		'&::backdrop': {
			backgroundColor: token('color.blanket'),
		},
	},
});

// popover.tsx
const styles = cssMap({
	root: {
		inset: 'auto',
		background: 'transparent',
	},
});
```

**What to change:**

These are five sub-problems across `dialog-content.tsx` and `popover.tsx`:

1. **`'none'` for size properties** (trivial): Add `| 'none'` to the `SizeIntrinsic` type in the
   schema formatter. Currently
   `SizeIntrinsic = 'min-content' | 'max-content' | 'fit-content' | 'auto' | NumericSize | ...`.
   This is used by `maxWidth`, `maxHeight`, `width`, `height`, etc. Straightforward union extension,
   then regenerate.

2. **`'auto'` for `inset`** (trivial): The `inset` property in `popover.tsx` needs to accept
   `'auto'`. This is likely a similar `SizeIntrinsic` gap — add `| 'auto'` if it's not already
   accepted for this property.

3. **`'transparent'` for `background`** (trivial): The `background` property in `popover.tsx` needs
   to accept `'transparent'`. May need adding to the color value type, though `StrictCSSProperties`
   likely already accepts it as a CSS-wide value.

4. **`var(--*)` and `calc(...)` patterns** (medium — mostly a design decision, needed for arrow
   styles in Change 9): Either add `` `var(--${string})` | `var(--${string}, ${string})` `` and
   `` `calc(${string})` `` as accepted values globally (which loosens type safety significantly), or
   add them only to specific properties. The schema generator would need updating, and the approach
   affects how much the types can catch misuse.

5. **`token('color.blanket')` in backdrop** (small): This is likely an `@atlaskit/tokens` type gap —
   the `token()` function's return type may not include `color.blanket` in the union of accepted
   token names for `backgroundColor`. Need to check whether `color.blanket` is in the token schema
   and whether the return type maps to a value that `DesignTokenStyles['backgroundColor']` accepts.

---

## Change 5: Add attribute selector support (`&[open]`, `&[popover]`)

**Complexity:** Medium. Requires changes to both the TypeScript type system (`ApplySchema` in
`@compiled/react`) and the SWC transformer/compiler to recognize and emit attribute selectors
correctly.

**Browser support:** The `[open]` attribute on `<dialog>` is part of the HTML spec and supported in
all browsers that support `<dialog>` — Chrome 37+ (2014), Firefox 98+ (Mar 2022), Safari 15.4+ (Mar
2022). **Universal in our browser matrix.** The CSS attribute selector `[open]` is CSS2 — supported
everywhere.

Dialog animations need `[open]` to style the dialog when it's open via `showModal()`. The browser
adds the `open` attribute automatically — unlike `:popover-open`, there is no pseudo-class
equivalent for dialogs.

### Before

Raw CSS string because `&[open]` can't be a key in `cssMap`:

```typescript
const DIALOG_FADE_CSS = `
[data-ds-dialog-fade] {
  opacity: 0;
  transition: opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-fade][open] {
  opacity: 1;
  transition-duration: 350ms;
}
`;
```

### After

`&[open]` works as a nested key in `cssMap`:

```typescript
const styles = cssMap({
	fade: {
		opacity: 0,
		transition:
			'opacity 175ms cubic-bezier(0.15, 1, 0.3, 1), overlay 175ms allow-discrete, display 175ms allow-discrete',
		'&[open]': {
			opacity: 1,
			transitionDuration: '350ms',
		},
	},
});
```

**What to change in Compiled:**

The `ApplySchema` type in `@compiled/react/src/create-strict-api/types.ts` currently allows these
key categories:

```typescript
TKey extends keyof StrictCSSProperties ? ...   // CSS properties
: TKey extends CSSPseudoClasses ? ...           // pseudo-classes
: TKey extends `@${string}` | CSSPseudoElements ? ...  // at-rules + pseudo-elements
: never;                                        // everything else rejected
```

Changes needed:

1. **Types** (small): Add `` `&[${string}]` `` as a new branch in the `ApplySchema` conditional
   type, alongside `CSSPseudoClasses` and `CSSPseudoElements`. This is a ~3 line change to the type
   definition, but needs to be validated that TypeScript can infer it correctly for autocomplete.
2. **SWC transformer** (medium): The Rust-based SWC plugin that transforms `cssMap` calls into CSS
   needs to recognize `&[...]` keys and emit them as attribute selectors appended to the generated
   class name (e.g. `.abc123[open] { ... }`). Need to check if the existing selector parsing already
   handles this or if new parsing logic is needed.
3. **ESLint** (trivial): The `no-unsafe-selectors` rule may need updating to allow `&[...]`
   patterns, or they may already pass since the rule checks against `allowedPseudos` and
   `ignoredAtRules` specifically.

---

## Change 6: `@starting-style` nested inside pseudo/attribute selectors

**Complexity:** Small-to-medium. The types already permit this (the `ApplySchema` recursion allows
`@${string}` at any nesting depth). The unknown is whether the SWC transformer produces correct CSS
output — this is primarily a verification + possible bugfix task rather than a feature addition.

**Browser support:** CSS nesting of `@starting-style` inside selector blocks is supported wherever
`@starting-style` itself is supported — Chrome 117+, Firefox 129+, Safari 17.5+. **Within our
browser matrix.**

The popover/dialog animation pattern requires `@starting-style` to be nested _inside_
`:popover-open` or `[open]` blocks. This tells the browser "when this element first enters the open
state, start the transition from these values."

### Before

Raw CSS string — `@starting-style` is a sibling block that re-selects the element:

```typescript
const FADE_CSS = `
[data-ds-popover-fade]:popover-open {
  opacity: 1;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-popover-fade]:popover-open {
    opacity: 0;
  }
}
`;
```

### After

`@starting-style` nested inside the pseudo-class block:

```typescript
const styles = cssMap({
	fade: {
		opacity: 0,
		transition: '...',
		'&:popover-open': {
			opacity: 1,
			transitionDuration: '350ms',
			'@starting-style': {
				opacity: 0,
			},
		},
	},
});
```

**What to verify/change:**

1. **Types** (already done): `ApplySchema` recursively applies itself for `@${string}` keys inside
   pseudo blocks. Writing `'@starting-style': { opacity: 0 }` inside `'&:popover-open'` should
   already type-check.
2. **SWC transformer** (needs verification): The critical question is whether the compiler emits the
   correct nested CSS output:
   ```css
   .abc123:popover-open {
   	opacity: 1;
   	transition-duration: 350ms;
   	@starting-style {
   		opacity: 0;
   	}
   }
   ```
   The `navigation-system` package uses `@starting-style` at the top level of a variant (not nested
   inside a pseudo-class). If the transformer flattens nested at-rules incorrectly (e.g. hoists
   `@starting-style` out and re-wraps the selector), the animation won't work. Testing this is the
   main effort.
3. **If it doesn't work**: fixing the SWC transformer's at-rule nesting logic could be significant
   depending on how deeply the flattening behavior is baked in.

---

## Change 7: Compound selectors (`&[open]::backdrop`)

**Complexity:** Hard. This extends Change 5 (attribute selectors) with compound selector support.
Requires both type system and compiler changes, and the compiler work is non-trivial because
Compiled currently processes pseudo-classes, pseudo-elements, and at-rules as separate branches —
compound selectors cut across those branches.

**Browser support:** `::backdrop` is supported in all browsers with `<dialog>` support — Chrome 37+,
Firefox 98+, Safari 15.4+. Compound selectors like `[open]::backdrop` are standard CSS and work
universally. **Within our browser matrix.**

Dialog backdrop animations need to target `::backdrop` differently when the dialog is open vs
closed. This requires a compound selector combining an attribute selector and a pseudo-element.

### Before

Raw CSS string with compound selector:

```typescript
const DIALOG_FADE_CSS = `
[data-ds-dialog-fade]::backdrop {
  background: rgba(0, 0, 0, 0);
  transition: background 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-fade][open]::backdrop {
  background: rgba(0, 0, 0, 0.5);
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-dialog-fade][open]::backdrop {
    background: rgba(0, 0, 0, 0);
  }
}
`;
```

### After

Compound selector as a nested key in `cssMap`:

```typescript
const styles = cssMap({
	fade: {
		// ... element styles ...
		'&::backdrop': {
			background: 'rgba(0, 0, 0, 0)',
			transition: '...',
		},
		'&[open]::backdrop': {
			background: 'rgba(0, 0, 0, 0.5)',
			transitionDuration: '350ms',
			'@starting-style': {
				background: 'rgba(0, 0, 0, 0)',
			},
		},
	},
});
```

**What to change in Compiled:**

1. **Types** (small): The `ApplySchema` type currently handles pseudo-classes, pseudo-elements, and
   at-rules as separate `extends` branches. A compound selector like `&[open]::backdrop` doesn't
   match any single branch. Options:
   - Add an explicit compound pattern: `` `&[${string}]::${string}` ``
   - Or more generically: `` `&${string}` `` (accepts any selector starting with `&`) — but this
     loses all type safety
   - Need to decide how permissive to be

2. **SWC transformer** (hard — this is the bulk of the work): The compiler needs to:
   - Parse compound selector strings instead of matching against known pseudo-class/element lists
   - Emit the compound selector as a single rule: `.abc123[open]::backdrop { ... }`
   - Handle `@starting-style` nested inside the compound selector block
   - This is the hardest part — the transformer likely has separate code paths for pseudo-classes
     and pseudo-elements that would need to be unified or extended

3. **ESLint** (trivial): Update `no-unsafe-selectors` to recognize compound patterns

**Possible workaround without compound selectors:** Use separate `cssMap` variants for the
backdrop's open/closed state and swap them in React. But this defeats the purpose of pure-CSS
animation — you'd need React to know the dialog's open state, and `@starting-style` wouldn't work
because the style swap happens via re-render, not via selector matching.

---

## ~~Change 8: Popover UA reset → `cssMap`~~ (Done)

`popover.tsx` now uses `cssMap` for its UA reset. (`popup-content.tsx` has no `cssMap` of its own —
it delegates entirely to `Popover`.) Remaining `@ts-expect-error` for `background: 'transparent'`
and `inset: 'auto'` in `popover.tsx` will be resolved when Change 4 lands.

---

## Change 9: Arrow pseudo-element styles → `cssMap`

**Complexity:** Small-to-medium (once Change 4 lands). The `::before`/`::after` pseudo-elements are
already supported in `cssMap`. The main effort is rewriting ~40 lines of pseudo-element CSS as
TypeScript objects and verifying the `clip-path: polygon(...)` values are accepted. The
`@position-try` rules (~65 lines, 12 rules total) would still need raw injection unless Change 3's
Compiled support lands.

**Browser support:** N/A — `::before`, `::after`, `clip-path`, `polygon()` are universally
supported. This is a Compiled migration task. (The `@position-try` rules that would remain as raw
CSS have the same support as Change 3.)

The arrow preset injects ~148 lines of raw CSS: ~40 lines for the `::before`/`::after`
pseudo-elements that create hexagonal arrow shapes using `clip-path`, and ~65 lines for the 12
`@position-try` rules that handle flip positioning.

### Before

Raw CSS string with complex `calc()` and `clip-path` values:

```typescript
const ARROW_CSS = `
[data-ds-popover-arrow] {
  clip-path: inset(var(--ds-arrow-offset, 1px)) margin-box;
  box-shadow: none;
}

[data-ds-popover-arrow]::before {
  content: "";
  position: absolute;
  z-index: -1;
  background: inherit;
  left: 50%;
  transform: translateX(-50%);
  width: calc(var(--ds-arrow-size, 8px) * 2);
  height: calc(100% + var(--ds-arrow-size, 8px) * 2);
  top: calc(var(--ds-arrow-size, 8px) * -1);
  clip-path: polygon(
    0 var(--ds-arrow-size, 8px),
    50% 0,
    100% var(--ds-arrow-size, 8px),
    100% calc(100% - var(--ds-arrow-size, 8px)),
    50% 100%,
    0 calc(100% - var(--ds-arrow-size, 8px))
  );
}
/* ... ::after with similar complexity ... */
`;
```

### After

Static parts in `cssMap` (assuming `calc()` and `var()` are accepted):

```typescript
const styles = cssMap({
	arrow: {
		clipPath: 'inset(var(--ds-arrow-offset, 1px)) margin-box',
		boxShadow: 'none',
		'&::before': {
			content: '""',
			position: 'absolute',
			zIndex: -1,
			background: 'inherit',
			left: '50%',
			transform: 'translateX(-50%)',
			width: 'calc(var(--ds-arrow-size, 8px) * 2)',
			height: 'calc(100% + var(--ds-arrow-size, 8px) * 2)',
			top: 'calc(var(--ds-arrow-size, 8px) * -1)',
			clipPath:
				'polygon(0 var(--ds-arrow-size, 8px), 50% 0, 100% var(--ds-arrow-size, 8px), 100% calc(100% - var(--ds-arrow-size, 8px)), 50% 100%, 0 calc(100% - var(--ds-arrow-size, 8px)))',
		},
		'&::after': {
			// ... similar
		},
	},
});
```

**Blockers and breakdown:**

1. **Blocked on Change 4** for `var()` and `calc()` value support
2. **`clip-path: polygon(...)`** (small): The `DesignTokenStyles` schema likely has `clipPath` typed
   as `never` or a restricted union. The `polygon(...)` value is an arbitrary string — Compiled's
   types would need to accept `string` for `clipPath` (or at minimum
   `` `polygon(${string})` | `inset(${string})` ``). This is a one-property type change in the
   schema.
3. **`background: 'inherit'`** (trivial): May need `'inherit'` added to the color value type, though
   `StrictCSSProperties` likely already accepts it as a CSS-wide keyword.
4. **`@position-try` rules remain raw**: The ~65 lines of `@position-try` rules (12 rules total) are
   global named at-rules that can't be expressed in `cssMap`. These would still need raw CSS
   injection via `ensurePresetStyles` unless Change 3's Compiled support lands. This means
   `ensure-preset-styles.ts` can't be fully deleted even after this change.

---

## What stays as-is (not a Compiled gap)

### Anchor positioning inline styles

`use-anchor-positioning.tsx` uses `el.style.setProperty()` for properties like `anchor-name`,
`position-anchor`, `position-area`, and `position-try-fallbacks`. These are:

- **Dynamic:** values depend on runtime props (`placement`, `anchorName`, `offset`)
- **Imperative:** applied/removed in `useLayoutEffect` cleanup cycles
- **Using properties too new for `CSSStyleDeclaration`:** hyphenated names like `position-area`
  don't have camelCase equivalents yet

This is a legitimate use of imperative style manipulation, not a Compiled gap.

### JS fallback positioning

The JS fallback path in `useAnchorPositioning` sets `top`/`left` via `el.style.setProperty()` on
every scroll/resize event. This is inherently imperative and measurement-dependent — no static
styling system can express it.

### Animation `getProperties` (per-placement CSS custom properties)

`slideAndFade` returns a `getProperties` function that computes `--ds-popover-tx`/`--ds-popover-ty`
based on the current `placement` prop. These are set via `el.style.setProperty()` in `popover.tsx`.
Since the values depend on a runtime prop, they stay imperative.

---

## What already uses `cssMap` successfully

The following component uses `cssMap` without any `@ts-expect-error` or raw CSS injection, serving
as evidence that the `cssMap` + design token pattern works for standard styling:

- **`popup-surface.tsx`:** `elevation.surface.overlay`, `radius.small`, `elevation.shadow.overlay`,
  `overflow: 'auto'`

The `dialog-content.tsx` and `popover.tsx` components also use `cssMap` successfully for their UA
resets, but still have `@ts-expect-error` comments for values not yet in the strict type schema (see
Change 4).

These demonstrate that Compiled + `cssMap` covers the design system's standard token-based patterns
well. The gaps documented above arise only from newer CSS features (`:popover-open`,
`@starting-style`, `@position-try`, attribute selectors) and from CSS values not yet in the strict
type schema (`'none'`, `'auto'`, `'transparent'`, `var()`, `calc()`, `token('color.blanket')`).

---

## `prefers-reduced-motion` in animation presets

All animation presets (both popover and dialog) include `@media (prefers-reduced-motion: reduce)`
blocks that set `transition-duration: 0s`. For example:

```css
@media (prefers-reduced-motion: reduce) {
	[data-ds-popover-fade],
	[data-ds-popover-fade]:popover-open {
		transition-duration: 0s;
	}
}
```

Dialog presets also zero out backdrop transitions:

```css
@media (prefers-reduced-motion: reduce) {
	[data-ds-dialog-fade],
	[data-ds-dialog-fade][open],
	[data-ds-dialog-fade]::backdrop,
	[data-ds-dialog-fade][open]::backdrop {
		transition-duration: 0s;
	}
}
```

These `@media` blocks are part of the raw CSS strings and would move into `cssMap` alongside the
animation rules they modify. `@media` is already supported by Compiled, so no additional gap is
needed — the reduced-motion blocks will migrate automatically when Changes 1, 5, 6, and 7 land.

---

## `dialogSlideUpAndFade` preset details

The `dialogSlideUpAndFade` preset is structurally more complex than `dialogFade`. It includes:

- A `--ds-dialog-ty` custom property (default `12px`) for the slide distance
- `transform: translateY(var(--ds-dialog-ty, 12px))` in the base and `@starting-style` states
- `transform: none` in the `[open]` state
- The same `::backdrop` and `[open]::backdrop` pattern as `dialogFade`
- A `replaceAll('12px', ...)` mechanism for custom distances

The `--ds-dialog-ty` property is baked into the CSS string (not set via `el.style.setProperty()`),
so it will move to `cssMap` with the rest of the animation. This differs from the popover
`slideAndFade` pattern, where `--ds-popover-tx`/`--ds-popover-ty` are set imperatively per-placement
and stay as inline styles.

---

## Summary: what to change, ordered by impact

| #   | Change                                             | Complexity                                 | Browser support                                           | Unblocks                                   |
| --- | -------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------- | ------------------------------------------ |
| 1   | `:popover-open` in types + ESLint                  | Trivial                                    | ✅ In matrix (Chrome 114+, FF 125+, Safari 17+)           | Popover animation in `cssMap`              |
| 2   | ~~`@starting-style` in ESLint `ignoredAtRules`~~   | Done                                       | ✅ In matrix (Chrome 117+, FF 129+, Safari 17.5+)         | ~~Removes eslint-disable for animations~~  |
| 3   | `@position-try` in ESLint (+ investigate Compiled) | Trivial (ESLint) / Unknown (Compiled)      | ⚠️ 94% of Jira users (Chrome 125+, FF 131+, Safari 18.2+) | Arrow `@position-try` rules                |
| 4   | `var()`, `calc()`, `'none'` in value types         | Medium                                     | ✅ Universal                                              | Dialog styles, arrow styles, popover reset |
| 5   | `&[open]` attribute selectors                      | Medium                                     | ✅ Universal                                              | Dialog animation in `cssMap`               |
| 6   | `@starting-style` inside pseudo/attribute blocks   | Small–Medium (verification + possible fix) | ✅ In matrix (same as #2)                                 | All entry animations in `cssMap`           |
| 7   | `&[open]::backdrop` compound selectors             | Hard                                       | ✅ Universal                                              | Dialog backdrop animation in `cssMap`      |
| 8   | ~~Popover UA reset → `cssMap`~~                    | Done                                       | ✅ Universal                                              | `@ts-expect-error` remains until #4        |
| 9   | Arrow pseudo-elements → `cssMap`                   | Small–Medium (needs #4)                    | ✅ Universal                                              | Removes arrow raw CSS injection            |

### What each change eliminates

**Changes 1 + 6:** All three popover animation presets (`fade`, `slideAndFade`, `scaleAndFade`) can
move from raw CSS strings to `cssMap` variants (Change 2 is already done). This eliminates:

- `FADE_CSS`, `SLIDE_AND_FADE_CSS`, `SCALE_AND_FADE_CSS` raw strings
- `data-ds-popover-{name}` data attributes
- `ensurePresetStyles()` calls for popover animations
- The global `<style>` tag injection for these presets

**Changes 1 + 5 + 6 + 7:** Both dialog animation presets (`dialogFade`, `dialogSlideUpAndFade`) can
also move to `cssMap` (Change 2 is already done). `dialogSlideUpAndFade` is more complex — it
includes `transform: translateY(var(--ds-dialog-ty, 12px))` and a `replaceAll` mechanism for custom
distances (see the `dialogSlideUpAndFade` preset details section above). This additionally
eliminates:

- `DIALOG_FADE_CSS`, `DIALOG_SLIDE_UP_AND_FADE_CSS` raw strings
- `data-ds-dialog-{name}` data attributes
- `ensurePresetStyles()` calls for dialog animations

**Change 4:** Removes all three `@ts-expect-error` comments in `dialog-content.tsx`
(`maxWidth: 'none'`, `maxHeight: 'none'`, `token('color.blanket')`) and both `@ts-expect-error`
comments in `popover.tsx` (`inset: 'auto'`, `background: 'transparent'`).

**~~Change 2:~~** Done. `@starting-style` is already in `ignoredAtRules`.

**~~Change 8:~~** Done. Remaining `@ts-expect-error` comments in `popover.tsx` will be resolved by
Change 4.

**Changes 4 + 9:** Arrow `::before`/`::after` styles can move to `cssMap`. The `@position-try` rules
(Change 3) may still need raw injection depending on Compiled's ability to emit global at-rules.

**If all changes land:** `ensure-preset-styles.ts` can be deleted entirely. The only remaining
non-Compiled styling would be the imperative anchor positioning (which is legitimately dynamic).

---

## Appendix: Future selectors not currently used

These selectors aren't used in the top-layer package today, but they're relevant to dialogs,
popovers, and transitions. Adding Compiled support for them now (where easy) would future-proof the
type system and avoid the same gaps reappearing later.

---

### A1: `:open` / `:closed` pseudo-classes

**Complexity:** Trivial. Identical shape to Change 1 — two string additions to a union type and an
array.

**Browser support:** CSS Selectors Level 4 (W3C standard). Chrome 132+ (Jan 2025), Firefox 132+ (Oct
2024), Safari 18.2+ (Dec 2024). These are newer than `:popover-open` (which shipped mid-2023) — they
arrived about 18 months later as the standardized replacement. **Within our browserslist policy**
(last 5 Chrome covers 139+, last 2 Firefox covers 146+, last 2 Safari covers 18+). Real-world
coverage is slightly lower than `:popover-open` since users on Safari 17–18.1 or Firefox 125–131
have `:popover-open` but not `:open`.

**Status:** Not used.

`:open` is the CSS-standard generalization of both `:popover-open` (for popovers) and `[open]` (for
dialogs). It matches any element that is in its "open" state — `<dialog>`, `<details>`, and popover
elements. `:closed` is the inverse.

If adopted, `:open` would **unify** the popover and dialog animation patterns into a single selector
instead of needing `:popover-open` for one and `[open]` for the other.

#### Today (workaround)

Two separate raw CSS patterns for the same conceptual thing:

```css
/* Popover: uses :popover-open */
[data-ds-popover-fade]:popover-open {
	opacity: 1;
}

/* Dialog: uses [open] attribute */
[data-ds-dialog-fade][open] {
	opacity: 1;
}
```

#### With Compiled support

A single pattern for both:

```typescript
const popoverStyles = cssMap({
	fade: {
		opacity: 0,
		transition: '...',
		'&:open': {
			opacity: 1,
			transitionDuration: '350ms',
			'@starting-style': { opacity: 0 },
		},
	},
});

const dialogStyles = cssMap({
	fade: {
		opacity: 0,
		transition: '...',
		'&:open': {
			opacity: 1,
			transitionDuration: '350ms',
			'@starting-style': { opacity: 0 },
		},
	},
});
```

**What to change:** Add `':open'` and `':closed'` to `CSSPseudoClasses` and `allowedPseudos`. Same
shape of change as `:popover-open` — do them together.

---

### A2: `:modal` pseudo-class

**Complexity:** Trivial. Same shape as Change 1 — one string addition to each of two locations.

**Browser support:** CSS Selectors Level 4 (W3C standard). Chrome 105+ (Aug 2022), Firefox 113+ (May
2023), Safari 15.6+ (Jul 2022). Older than `:popover-open` — this has been shipping for over 3
years. **Universal in our browser matrix.**

**Status:** Not used.

`:modal` matches a `<dialog>` that was opened via `showModal()` (not `.show()`). The key difference:
`showModal()` creates a backdrop and puts the dialog in the top layer; `.show()` doesn't. This
pseudo-class lets you style the two cases differently.

#### Today (workaround)

You'd use a data attribute to distinguish modal vs non-modal:

```typescript
function DialogContent({ modal }: { modal: boolean }) {
  return (
    <dialog
      data-modal={modal ? '' : undefined}
      style={modal ? { /* modal-specific styles */ } : undefined}
    >
      {children}
    </dialog>
  );
}
```

Or raw CSS:

```css
dialog[data-modal] {
	max-block-size: calc(100vh - 120px);
	margin: auto;
}
```

#### With Compiled support

Style the dialog differently based on how it was opened, no data attributes:

```typescript
const styles = cssMap({
	dialog: {
		// Base dialog styles (shared by .show() and .showModal())
		padding: 0,
		border: 'none',
		// Modal-specific styles
		'&:modal': {
			maxBlockSize: 'calc(100vh - 120px)',
			margin: 'auto',
		},
		'&:modal::backdrop': {
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
		},
	},
});
```

**What to change:** Add `':modal'` to `CSSPseudoClasses` and `allowedPseudos`. Same shape as
`:popover-open`.

---

### A3: `::view-transition-*()` parameterized pseudo-elements

**Complexity:** Hard. This is a new category of selector that Compiled has never supported. Requires
type system changes, SWC transformer changes, and a design decision about scoping (these
pseudo-elements target the document root, not the element with the class).

**Browser support:** View Transitions API Level 1 (W3C standard, same-document transitions). Chrome
111+ (Mar 2023), Firefox 144+ (late 2025), Safari 18+ (Sept 2024). Per project-goals.md: **98.7% of
Jira users**, 100% within our browserslist policy. Graceful degradation — if unsupported,
transitions just don't animate.

**Status:** Not used.

View Transitions use a set of parameterized pseudo-elements to style the transition snapshots:

- `::view-transition` — root overlay
- `::view-transition-group(name)` — container for a named element's snapshots
- `::view-transition-image-pair(name)` — contains old + new images
- `::view-transition-old(name)` — the "before" snapshot
- `::view-transition-new(name)` — the "after" snapshot

The `name` matches the element's `view-transition-name` CSS property.

#### Today (workaround)

Raw CSS string injection, similar to the animation presets:

```typescript
const VIEW_TRANSITION_CSS = `
::view-transition-old(hero) {
  animation: fade-out 200ms ease-out;
}

::view-transition-new(hero) {
  animation: fade-in 300ms ease-in;
}

::view-transition-group(hero) {
  animation-duration: 300ms;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

const style = document.createElement('style');
style.textContent = VIEW_TRANSITION_CSS;
document.head.appendChild(style);
```

#### With Compiled support

Parameterized pseudo-elements as `cssMap` keys:

```typescript
const styles = cssMap({
	heroTransition: {
		viewTransitionName: 'hero',
		'&::view-transition-old(hero)': {
			animation: 'fade-out 200ms ease-out',
		},
		'&::view-transition-new(hero)': {
			animation: 'fade-in 300ms ease-in',
		},
		'&::view-transition-group(hero)': {
			animationDuration: '300ms',
		},
	},
});
```

**What to change:** This is a **harder gap** than the others. Compiled's `CSSPseudoElements` type
only allows simple names (`::before`, `::after`, `::backdrop`, etc.). Supporting parameterized
pseudo-elements like `::view-transition-old(name)` requires:

- A new pattern in the type system: `::${string}(${string})` or an explicit allowlist of the
  `view-transition-*` names
- The SWC compiler needs to emit the parameterized selector correctly
- Scoping: `::view-transition-*` pseudo-elements are on the document root, not on the element the
  class is applied to — so `&::view-transition-old(hero)` may not make sense scoped to a class.
  These might need to be global rules.

This is a fundamentally different shape from the other gaps.

---

### A4: `@view-transition` at-rule

**Complexity:** Trivial for ESLint (one-line addition to `ignoredAtRules`). Unknown for Compiled —
same global at-rule question as Change 3.

**Browser support:** View Transitions API Level 2 (W3C standard, cross-document transitions). Chrome
126+ (Jun 2024), Safari 18+ (Sept 2024), **Firefox: not shipped** (behind flag only as of Feb 2026).
**Not fully within our browser matrix** — Firefox users would not get cross-document view
transitions.

**Status:** Not used.

Configures cross-document view transitions in CSS:

```css
@view-transition {
	navigation: auto;
}
```

#### Today (workaround)

Raw CSS string or a `<style>` tag in `<head>`:

```typescript
const style = document.createElement('style');
style.textContent = '@view-transition { navigation: auto; }';
document.head.appendChild(style);
```

#### With Compiled support

As an at-rule in `cssMap` (if Compiled supports global at-rules):

```typescript
const styles = cssMap({
	root: {
		'@view-transition': {
			navigation: 'auto',
		},
	},
});
```

**What to change:** Add `'@view-transition'` to `ignoredAtRules` in the ESLint plugin. For Compiled,
this is a global at-rule (like `@position-try`) — it doesn't scope to a class. Whether Compiled can
emit it depends on the same investigation needed for Change 3.

---

### Summary of future selectors

| Selector                | Complexity                               | Browser support                                                 | Recommendation                                                            |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `:open` / `:closed`     | Trivial (same as Change 1)               | ✅ In matrix (Chrome 132+, FF 132+, Safari 18.2+)               | **Add now** alongside `:popover-open`. Unifies dialog + popover patterns. |
| `:modal`                | Trivial (same shape)                     | ✅ Universal (Chrome 105+, FF 113+, Safari 15.6+)               | **Add now** while touching the pseudo-class list.                         |
| `::view-transition-*()` | Hard (new selector shape)                | ✅ 98.7% of users (Chrome 111+, FF 144+, Safari 18+)            | Defer until view transitions are adopted in the design system.            |
| `@view-transition`      | Trivial for ESLint; unknown for Compiled | ⚠️ No Firefox support (Chrome 126+, Safari 18+, FF behind flag) | Add to ESLint `ignoredAtRules` now. Compiled support deferred.            |

---

## Appendix: Using AI to implement these changes

Many of these changes are highly mechanical — adding strings to lists, extending union types, and
migrating code from one known pattern to another. AI coding agents are well-suited to this kind of
work.

### What AI can do well here

**Trivial changes (1, 3 ESLint, A1, A2):** An AI agent can make these changes end-to-end with high
confidence. The pattern is "add a string to a known list in a known file." The agent can find the
file, understand the pattern from surrounding entries, add the new entry, and run the existing tests
to verify. These are ideal AI tasks — low ambiguity, clear success criteria, well-defined locations.
(Change 2 is already done.)

**Migration tasks (9):** Converting raw CSS strings into `cssMap` is formulaic translation work. An
AI agent can read the raw CSS, produce the equivalent `cssMap` TypeScript, and verify it compiles.
The before/after examples in this document serve as direct prompts.

**Type schema changes (4 — `'none'` sub-problem):** Adding `| 'none'` to `SizeIntrinsic` in the
code-generated schema is simple enough for an agent to handle, including re-running the code
generation step.

### What still needs human judgment

**Design decisions (4 — `var()` and `calc()`):** The trade-off between type safety and
permissiveness is a policy call. An AI can lay out the options (as this document does), but a human
needs to decide how loose the types should be.

**SWC transformer changes (5, 6, 7):** These involve modifying a Rust-based compiler plugin. The
changes require understanding the transformer's internal architecture — how it processes selector
keys, when it flattens nested rules, how it scopes class names. An AI agent could assist with
investigation (reading the transformer source, identifying the relevant code paths), but the actual
changes need careful human review given the blast radius of compiler bugs.

**Verification tasks (6):** Testing whether `@starting-style` nested inside `:popover-open` produces
correct CSS output is something an AI agent could set up (write a test `cssMap`, run the build,
inspect the output), but interpreting whether the output is correct for the browser's transition
engine requires human understanding of the CSS spec behavior.
