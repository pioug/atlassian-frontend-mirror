# Follow-up: Compiled transform bugs found by the guard probes

## Context

The real-build probes for the top-layer guard forms
([../decisions/top-layer-unsafe-selectors.md](../decisions/top-layer-unsafe-selectors.md)) found
three bugs in Atlaspack's Rust Compiled transforms. The guards do not cause them. Each breaks
styling, or the build, today. None is fixed here. Hand them to the `ap` team (AFB) and, for the
first, to Atlaspack.

## 1. `ap` and `@atlaspack/rust` write an `of` clause with no space

Both Rust transforms serialise an `:nth-child()` / `:nth-last-child()` argument with no space around
`of`. The selector is invalid, so the browser discards the rule, with no warning and no build error.
Babel extract keeps the space and is correct.

Repro:

```tsx
css({ '&:nth-last-child(n+2 of li)::after': { content: '"x"' } });
// ap and @atlaspack/rust emit: :nth-last-child(n+2ofli)::after   (invalid, rule discarded)
// babel emits:                  :nth-last-child(n+2 of li)::after
```

- Cause in `ap`: `serialize_pseudo_class_children` in
  `afm-tools/crates/ap_compiled_css/src/postcss/utils/selector_stringifier.rs:220-266` joins the
  parts with `""`. The fix is one line.
- `@atlaspack/rust` gives identical output, so a shared serialiser is inferred. Its source is not in
  this repo. Owner: Atlaspack.
- Exposure: every `of <selector-list>` clause built by a Rust transform. That is all of Gemini VR,
  and the Jira and Confluence processes in the `compiledCssInJsTransformer` rollout. A VR run on
  `@atlaskit/breadcrumbs` with an `of` guard lost all seven separator rules.
- Effect on top layer: the `of S` guard forms are withdrawn until both serialisers are fixed.

## 2. `ap` writes a `cssMap` `selectors: {…}` block's keys under a literal `selectors`

`cssMap` accepts arbitrary selectors only inside a `selectors` block. The `ap` Rust transform never
lifts that block, so every key in it is emitted under a literal `selectors` prefix, `&` keys or not.
Babel extract and `@atlaspack/rust` are correct.

Repro, through Gemini VR (`ap`):

```tsx
const map = cssMap({ plain: { selectors: { '& div': { '--x': '1' } } } });
// ap emits:    ._4o8Jo07dHp selectors div { --x: 1 }   (matches nothing)
// babel emits: ._xxxx div { --x: 1 }
```

- Cause: `afm-tools/crates/ap_compiled_css/src/oxc_transform/style_lowering/mod.rs:388-485` has no
  selectors merge.
- A correct port to copy:
  `platform/crates/swc-compiled-plugin/src/css_map/process_selectors.rs:119-291`.
- Exposure: 11 production files and 25 blocks in Jira, WAC and Post Office. None is broken in a
  production build, because production does not build with `ap`. Anything built with `ap`, such as a
  VR snapshot, renders them unstyled.

## 3. `ap` fails on an inline `xcss` object after a non-object `xcss` value

Gemini VR (`ap`) fails the build with:

```
shared Compiled lowering has no inline object recipe for 339..351
```

The smallest repro found:

```tsx
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({ root: { color: 'green' } });
const plain = undefined;

export default function Probe() {
	return (
		<div>
			<Box xcss={styles.root}>map</Box>
			<Box xcss={plain}>plain</Box>
			<Box xcss={{ color: 'red' }}>inline</Box>
		</div>
	);
}
```

The likely cause is an ordinal mismatch: the transform appears to number inline `xcss` objects by
their position in the module, and an earlier `xcss` value that is not an object or a `cssMap` member
shifts that count, so the lookup for the inline object misses. This is inferred from the repro, not
read from the source. It is a build error, not a silent drop, so it cannot ship broken styling.
