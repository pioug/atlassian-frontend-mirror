# Naming the top-layer modal primitive

## TL;DR

After weighing every realistic naming variant against the constraints and the costs they impose on
humans, tooling, and AI agents, the recommended export name is **`Dialog`** (from
`@atlaskit/top-layer`, paired with `Popover`).

## Context

- `@atlaskit/top-layer` exposes primitives that live in the browser top layer.
- The primitive under discussion will **only ever be modal**: it always calls `.showModal()`, is
  promoted to the top layer, paints a `::backdrop`, makes the background inert, traps focus, and is
  close-request aware.
- Non-modal `<dialog>` behaviour is intentionally out of scope and will never be supported by this
  primitive.
- A sibling primitive, `Popover`, already exists in the same package.
- `@atlaskit/modal-dialog` already exists as the styled UX component most product teams import. The
  new primitive is (or will be) the foundation it is built on.

## Evaluation axes

Every candidate is judged against the same axes, in roughly descending order of weight:

1. **Symbol clash** — does the name collide with existing symbols (most importantly
   `@atlaskit/modal-dialog`) in autocomplete, `grep`, and refactors?
2. **Prose and retrieval clash** — does the shared vocabulary confuse conversations, PR titles, doc
   chunks, and RAG queries?
3. **AI tooling ergonomics** — can an AI agent reliably pick the right import, retrieve the right
   doc, and reason about the thing without guessing?
4. **Platform anchor** — does the name map onto the underlying web platform primitive (`<dialog>`
   with `.showModal()`) that humans and models already know?
5. **Accuracy of guarantee** — does the name truthfully describe what the primitive does (always
   modal, top-layer)?
6. **Sibling symmetry** — does the name pair cleanly with `Popover`?
7. **Length and ergonomics** — short, memorable, easy to type and read?
8. **Future-proofing** — does the name resist regret if the package evolves?

## Candidates

### `Dialog`

- **Symbol clash:** Low. Distinct from `@atlaskit/modal-dialog`'s typical `Modal` / `ModalDialog`
  component name, distinct from common product symbols.
- **Prose / retrieval clash:** Low. "Dialog" and "Modal dialog" are separable in conversation and in
  retrieval chunks.
- **AI ergonomics:** Strong. Symbol search resolves to one thing. Import autocomplete does not have
  to guess between two packages. RAG queries return a clean chunk set. Codemods and lint rules can
  target the symbol directly.
- **Platform anchor:** Strongest possible. Maps directly onto `<dialog>`, which every model and most
  humans already know.
- **Accuracy:** Slightly understates the guarantee — `<dialog>` can technically be modal or
  non-modal, but this primitive is always modal. This is a doc/TSDoc concern, not a name concern.
- **Sibling symmetry:** Clean. `Dialog` + `Popover` reads as "the two top-layer primitives."
- **Length:** Short.
- **Future-proofing:** Strong. No `modal` prop temptation, no non-modal sibling expectation if the
  docs are clear.

### `Modal`

- **Symbol clash:** High. Conflicts with the conventional component name from
  `@atlaskit/modal-dialog` and with generic product usage of the word.
- **Prose / retrieval clash:** High. "The Modal" is ambiguous in every sentence.
- **AI ergonomics:** Weak. Autocomplete coin-flip between two packages. RAG returns mixed chunks
  from both packages' docs. Models will synthesise Frankenstein answers that mix the styled UX
  component's API with the primitive's API.
- **Platform anchor:** None. "Modal" is a UX behaviour word, not a platform primitive.
- **Accuracy:** Truthful ("it is always modal"), but the word also describes the very axis that
  distinguishes the two `<dialog>` modes, which makes it a slightly misleading anchor for a
  primitive that only supports one of those modes.
- **Sibling symmetry:** Inconsistent. `Modal` + `Popover` mixes a behaviour name with a behaviour
  name, which is actually reasonable, but the behaviour-vs-element distinction is a wash compared to
  the clash cost.
- **Length:** Short.
- **Future-proofing:** Forecloses a `modal={false}` escape hatch by name, which is fine because that
  is the actual constraint.
- **Net:** Small, one-time clarity win at the symbol; permanent compounding cost for every tool that
  has to disambiguate.

### `ModalDialog`

- **Symbol clash:** Maximum. Literally the component name commonly used from
  `@atlaskit/modal-dialog`. Imports, search, and refactors all collide.
- **Prose / retrieval clash:** Maximum. Indistinguishable from the existing UX component in writing.
- **AI ergonomics:** Worst of the candidates. Two different symbols, same name, different packages —
  almost guaranteed wrong imports.
- **Platform anchor:** Mixed (acknowledges `<dialog>`, but the `Modal` prefix dominates).
- **Accuracy:** Truthful.
- **Sibling symmetry:** Inconsistent with `Popover`.
- **Length:** Longer.
- **Future-proofing:** No advantage over `Modal`.
- **Net:** Strictly dominated by `Modal` (same clash, more characters) and by `Dialog` (no clash,
  similar information).

### `ModalPrimitive` / `ModalBase`

- **Symbol clash:** Low. Genuinely distinct symbols; will not collide in autocomplete or `grep`.
- **Prose / retrieval clash:** Still high. Conversations, PR titles, doc chunks, and RAG queries
  collapse "Modal", "Modal dialog", "Modal primitive", and "Modal base" together. The shared root
  word does most of the damage; the suffix only helps at the symbol level.
- **AI ergonomics:** Better than `Modal`, worse than `Dialog`. Symbol-level disambiguation works;
  semantic disambiguation in retrieval and conversation does not. There is no repo-wide `*Primitive`
  / `*Base` convention that gives a model a strong prior about which is "the unstyled top-layer
  thing."
- **Platform anchor:** None. "Modal" is a behaviour word; the primitive wraps
  `<dialog>.showModal()`. The name requires the model to learn a new mapping rather than reuse what
  it already knows.
- **Accuracy:** Truthful, with extra signal that it is "the primitive."
- **Sibling symmetry:** Broken. The sibling is `Popover`, not `PopoverPrimitive`. `ModalPrimitive` +
  `Popover` is asymmetric. If the package adopted a suffixed convention across the board, the
  consistent pair would be `DialogPrimitive` + `PopoverPrimitive`, not `ModalPrimitive` + `Popover`
  — and that is a separate, package-wide convention decision.
- **Length:** Longer; reads as scaffolding. Quietly signals "do not use me directly," which is fine
  if that is the intent, but the package name already carries that signal.
- **Future-proofing:** Neutral.
- **Net:** Solves the symbol clash but keeps the prose/retrieval clash, adopts the wrong platform
  anchor, breaks sibling symmetry, and adds length for a signal the package name already provides.

### `DialogPrimitive`

- **Symbol clash:** Low.
- **Prose / retrieval clash:** Low.
- **AI ergonomics:** Strong, comparable to `Dialog`.
- **Platform anchor:** Strong (maps onto `<dialog>`).
- **Accuracy:** Strong; the suffix signals "unstyled foundation."
- **Sibling symmetry:** Only works if `Popover` becomes `PopoverPrimitive` too. That is a
  package-wide convention change, not a local naming decision.
- **Length:** Longer than `Dialog`.
- **Future-proofing:** Strong.
- **Net:** A defensible second choice **if and only if** the package commits to a Radix-style
  `*Primitive` convention across every export. As a one-off it introduces asymmetry with `Popover`.

### `TopLayerDialog`

- **Symbol clash:** Low.
- **Prose / retrieval clash:** Low.
- **AI ergonomics:** Strong.
- **Platform anchor:** Strong.
- **Accuracy:** Truthful (it is the top-layer dialog).
- **Sibling symmetry:** Only works if `Popover` becomes `TopLayerPopover`. Same asymmetry problem as
  `DialogPrimitive`.
- **Length:** Longer; the `TopLayer` prefix duplicates the package name (`@atlaskit/top-layer`),
  which is the textbook reason not to put the package name into every export.
- **Future-proofing:** Strong.
- **Net:** Reasonable but redundant with the package name. Rejected for verbosity.

### Other neutral names (`Sheet`, `Surface`, `Overlay`, `Layer`, `Scrim`)

- **Symbol clash:** Low.
- **Prose / retrieval clash:** Low.
- **AI ergonomics:** Weak. None of these are platform primitives, so the model has no prior that
  connects them to `<dialog>.showModal()`. Every reach for the right import becomes a docs lookup.
- **Platform anchor:** None.
- **Accuracy:** Weak. None of these words mean "modal dialog" in standard usage; they mean adjacent
  things (a sheet slides in from an edge; a surface is a background; an overlay/scrim is a backdrop;
  a layer is a z-stacking concept).
- **Sibling symmetry:** Inconsistent.
- **Net:** Rejected. Inventing a novel name throws away the platform anchor without buying anything
  in return.

## Comparison summary

| Candidate          | Symbol clash | Prose clash | AI ergonomics | Platform anchor | Sibling symmetry | Length |
| ------------------ | ------------ | ----------- | ------------- | --------------- | ---------------- | ------ |
| **`Dialog`**       | Low          | Low         | Strong        | Strong          | Clean            | Short  |
| `Modal`            | High         | High        | Weak          | None            | Mixed            | Short  |
| `ModalDialog`      | Maximum      | Maximum     | Worst         | Mixed           | Inconsistent     | Long   |
| `ModalPrimitive`   | Low          | High        | Mixed         | None            | Asymmetric       | Long   |
| `ModalBase`        | Low          | High        | Mixed         | None            | Asymmetric       | Long   |
| `DialogPrimitive`  | Low          | Low         | Strong        | Strong          | Asymmetric\*     | Long   |
| `TopLayerDialog`   | Low          | Low         | Strong        | Strong          | Asymmetric\*     | Long   |
| `Sheet` / `Layer`… | Low          | Low         | Weak          | None            | Inconsistent     | Short  |

\*Asymmetric unless the package adopts a matching convention across every export.

## Recommendation

**Export the primitive as `Dialog` from `@atlaskit/top-layer`.**

It is the only candidate that scores well on every axis simultaneously: no symbol clash, no prose
clash, strong AI ergonomics, the strongest possible platform anchor, clean symmetry with the
existing `Popover` sibling, and a short ergonomic name. The one axis where it understates the truth
— "it is always modal" — is exactly the kind of contract that belongs in TSDoc, the public doc page,
and the API shape, not in the symbol name.

If the team independently decides to adopt a Radix-style `*Primitive` convention for every export in
this package, the recommendation becomes **`DialogPrimitive`** + **`PopoverPrimitive`** in lockstep.
That is a separate, package-wide decision and should not be made for one symbol in isolation.

## API shape that goes with the recommendation

- **Export name:** `Dialog`
- **Sibling export:** `Popover` (unchanged)
- **No `modal` prop.** Modality is a permanent guarantee, not a runtime option. A `modal` prop would
  invite consumers — human or AI — to try `modal={false}` and discover it does nothing.
- **Layer-observer `type` string:** `"dialog"` (parallels `"popup"` from `Popover`). If observers
  ever need to discriminate further, add a separate field rather than overloading the string.
- **Do not re-export `Dialog` from a kitchen-sink barrel** alongside `@atlaskit/modal-dialog`'s
  exports. Keeping it sequestered in `@atlaskit/top-layer` reinforces "this is the primitive, that
  is the UX component."

## TSDoc on the export

```ts
/**
 * Top-layer modal dialog primitive. Always modal: promoted to the top layer,
 * paints a backdrop, makes the background inert, traps focus, and is
 * close-request aware. Non-modal dialogs are not supported — use `role="dialog"`
 * on a plain element, or `Popover`, instead.
 */
export function Dialog(props: DialogProps) { ... }
```

## Public doc page

**Intro:**

> `Dialog` is the top-layer modal dialog primitive from `@atlaskit/top-layer`. It is always modal:
> opening it promotes it to the browser top layer, paints a `::backdrop`, makes the rest of the
> document inert, traps focus, and responds to close requests (Esc) by default. Non-modal dialog
> behaviour is intentionally not supported — for that, use a plain element with `role="dialog"` or
> reach for `Popover`.

**Relationship to other components:**

> `@atlaskit/modal-dialog` is the styled UX component most product teams should use. `Dialog` from
> `@atlaskit/top-layer` is the unstyled primitive `modal-dialog` is built on. Reach for the
> primitive only when you are building a new top-layer surface and need full control.
