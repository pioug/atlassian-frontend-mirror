# @atlaskit/adf-schema-generator

## 4.0.3

### Patch Changes

- [`3bae5cd6dc118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3bae5cd6dc118) -
  EDITOR-8815: On stage-0 ADF, `status.attrs.color` is no longer a closed enum of six names. It is a
  string that must match `neutral | purple | blue | red | yellow | green | #[0-9a-fA-F]{6}`.
  Existing named colors stay valid. Full-schema status color is unchanged and still validates those
  six names only. The public `StatusDefinition` type now types `color` as `string`.

## 4.0.2

### Patch Changes

- [`249ac5d9191e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/249ac5d9191e0) -
  Behind `platform_editor_adf_validator_empty_marks`, accept an explicitly empty `marks` array on a
  node that ADF gives a `marks` property no mark type may go into.

  ADF spells that property `marks: { type: 'array', maxItems: 0 }`, and the JSON schema accordingly
  accepts `"marks": []` on `paragraph`, `heading`, `extension`, `codeBlock` and `expand`. The
  spec-based validator rejected it: mark validation has nothing to reject in an empty array, so it
  reported the node valid with an empty `marksValidationOutput`, which reads to the parent's
  `validateChildMarks` as every mark on the child having been rejected, and the candidate spec was
  declined. Without an error callback that surfaced as a thrown `undefined`; with one the document
  was silently repaired and no error was reported. The five reference documents that carry
  `marks: []` (`paragraph-with-empty-marks`, `heading-with-empty-marks`,
  `extension-with-empty-marks`, `nestedExpand-with-codeBlock`, `panel-with-codeBlock`) were on an
  ignore list in `src/validator/__tests__/unit/validate.ts` because of it, and are now validated.

  A node with no `marks` property at all keeps rejecting an empty array as `REDUNDANT_MARKS`,
  because `marks` is then a property ADF does not define on it: `rule`, `panel`, `mediaGroup`,
  `hardBreak`, `doc`, `blockquote` and the list nodes all stay invalid, as do `mention` and `emoji`,
  which declare a mark rather than an empty list. The declaration is read off the node's base spec,
  since a variant only widens the mark types — `doc` offers a root `extension` as
  `extension_with_marks`, which adds `dataConsumer` and `fragment`, and that cannot make the empty
  list illegal.

  `codeBlock` and `expand` declare `noMarks` without listing any marks, and `adfToValidatorSpec`
  compared mark lists alone, so the flag was dropped and their validator specs read as taking no
  `marks` property — the same thing `rule` means, which is why an empty array on them was reported
  as redundant. The generator now honours `noMarks` on its own, so both emit
  `marks: { type: 'array', items: [], maxItems: 0, optional: true }`, matching their JSON schema.
  That part is generated data and is not gated: a real mark on a `codeBlock` or an `expand` is still
  rejected, now as an unsupported mark type rather than as a redundant `marks` property, so the
  error code reported for an already-invalid document changes.

  Gate off preserves today's acceptance behaviour. Covered by
  `src/validator/__tests__/unit/empty-marks.ts`.

## 4.0.1

### Patch Changes

- [`da678c24b2eb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da678c24b2eb7) -
  `adfToValidatorSpec` now emits `meta: { stage0: true }` on the validator spec of any node that
  exists only in stage 0 (`ADFNode.isStage0Only()`), and the generated validator spec is regenerated
  so 10 specs carry the flag: `bodiedExtension_root_only`, `extension_root_only`, `extensionFrame`,
  `layoutSection_with_single_column`, `multiBodiedExtension`, `multiBodiedExtension_root_only`,
  `panel_c1`, `panel_c1_root_only`, `panel_root_only` and `rule_root_only`.

  The predicate is `isStage0Only()` rather than `hasStage0()` because consumers read the flag as
  "this whole spec is stage-0 only". `hasStage0()` is also true for a stable node carrying a partial
  stage-0 override, so it flagged `date`, `emoji`, `inlineCard`, `mention` and `status`, whose only
  stage-0 delta is an optional `annotation` mark. A per-spec boolean cannot say "the node is fine,
  one of its marks is not", so flagging those said something false about stable nodes.

  `meta` is additive metadata that sits beside `props`, so the validated shape of every spec is
  unchanged and consumers that ignore the field see no difference. Emission is not gated. The only
  consumer that reads the flag is `@atlaskit/adf-utils`, behind
  `platform_editor_adf_validator_stage0`.

## 4.0.0

### Major Changes

- [`21f16025e3e5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21f16025e3e5c) -
  Remove `ADFNode#addContent`. Cross-node content references (e.g. `panel` → `table`) are now
  declared directly in each node's `content` spec rather than being appended imperatively after
  `define()`, so the post-`define()` content-mutation API is no longer needed. When a direct
  reference would otherwise form a module import cycle, declare the shared node in an
  import-cycle-free leaf module and reference that identity instead — the codegen traversal already
  resolves the resulting reference cycles lazily.

## 3.1.1

### Patch Changes

- [`5e6bf7dcd5adb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e6bf7dcd5adb) -
  Fix DFS cycle detection to only prevent cycles in the same branch

## 3.1.0

### Minor Changes

- [`100d833307949`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/100d833307949) -
  Allow panel_c1 inside bodied sync blocks

## 3.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [`192cdfa42f9d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/192cdfa42f9d3) -
  Autofix: add explicit package exports (barrel removal)

## 2.3.0

### Minor Changes

- [`584f9732ebcb6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/584f9732ebcb6) -
  Add `ADFNode#addContent(child)` to allow node content to be extended after `define()`. Appending
  into the existing `$one+($or(...))` or `$zero+($or(...))` clause from a downstream "wiring" module
  lets node files be declared in isolation, which breaks the module-import cycles that previously
  caused the generator to crash with `Cannot read properties of undefined (reading 'members')` when
  nodes cross-referenced each other (e.g. `panel` ↔ `table`).

## 2.2.1

### Patch Changes

- [`cd228df49c18b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd228df49c18b) -
  Add stage-0 `valign` support for table cells and layout columns, with shared valign utilities and
  standardised `data-valign` HTML attribute.

  Allow stage0 schema generation using `node.stage0` attribute.

## 2.2.0

### Minor Changes

- [`8b781b3b3f9ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b781b3b3f9ca) -
  Add setSmallText and setSmallTextWithAnalytics commands, modify setNormalText to remove fontSize
  mark, add FORMAT_SMALL_TEXT analytics enum.

  Add support to the renderer to render 'small text'.

  Add 'fontSize' to stage0 default schema.

## 2.1.2

### Patch Changes

- [`cac3d6228356a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cac3d6228356a) -
  adf-schema doc updates
- Updated dependencies
