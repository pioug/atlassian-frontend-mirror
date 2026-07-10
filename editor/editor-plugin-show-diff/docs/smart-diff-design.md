# `smart` diffType — design

> Status: implemented behind the `platform_editor_ai_smart_diff` feature gate (which itself
> requires the extended diff pipeline; see §8). This document describes the **final**
> block-first implementation, not the original spike.

## 1. Problem

`editor-plugin-show-diff` renders a visual diff from an original document plus the ProseMirror
`steps` that produced the new document. It already supports three `diffType`s, each with a
failure mode:

- **`inline`** — word/character precise. Too granular: a lightly-reworded paragraph becomes a
  confetti of tiny highlights that is hard to read.
- **`block`** — whole top-level block. Too coarse: a one-word fix highlights the entire
  paragraph.
- **`step`** — per ProseMirror step. Inherits both problems depending on step shape; a single
  `ReplaceStep` whose slice spans multiple nodes is especially bad.

We want an **intelligent** diff that adapts granularity to *how much* changed at the sentence,
paragraph and node level.

## 2. Goal

Introduce a new `diffType: 'smart'` that, for each changed region, chooses the smallest
readable granularity:

- A couple of changed words in a sentence → **inline** word diff.
- Many changed words in a sentence → **whole-sentence** diff.
- A couple of changed sentences in a paragraph → **sentence** diffs inside the paragraph.
- Many changed sentences in a paragraph → **whole-paragraph** diff.
- Many changed children in a container (layout, table, list, panel, quote, …) → **node-level**
  diff (old node shown deleted, new node shown inserted).
- A node whose *type/wrapping* changed (paragraph→heading, list→table, wrap in panel/quote/…) →
  **node-level** diff.

Crucially, granularity must never **break document structure** (see §5).

## 3. Where it plugs in

The classifier is a pure `Change[] → Change[]` transform. It runs inside `getChanges` in
`calculateDiff/calculateDiffDecorations.ts`:

```ts
if (isExtendedEnabled(diffType)) {
  if (diffType === 'smart' && fg('platform_editor_ai_smart_diff')) {
    const changes = simplifyChanges(changeset.changes, tr.doc);
    return classifySmartChanges({ changes, originalDoc, newDoc: tr.doc,
                                  locale: intl.locale, thresholds: smartThresholds });
  }
  if (diffType === 'step')  return diffBySteps(originalDoc, steps);
  if (diffType === 'block') return groupChangesByBlock(changeset.changes, originalDoc, steppedDoc);
}
// otherwise inline:
return optimizeChanges(simplifyChanges(changeset.changes, tr.doc));
```

Key properties:

- **Input** is the same prosemirror-changeset `Change[]` (`simplifyChanges`) that `inline`
  consumes. We do **not** re-diff — we re-*group* and re-*size* the existing changes.
- **Output** is a `Change[]` in exactly the same shape, so the entire downstream decoration
  layer (inline highlights, block backgrounds, node/row deleted widgets, indicators) is reused
  unchanged.
- If `platform_editor_ai_smart_diff` is off, `smart` **falls through to `inline`** so behaviour
  degrades gracefully.

Each promoted change carries a `smartLevel` tag (`'sentence' | 'paragraph' | 'node'`) on its
span data, read downstream by `smartChangeLevel(change)` to drive node-level rendering choices
(skip inline highlight, place deleted content below the new content).

## 4. Algorithm — block-first (the key design decision)

The original spike was *change-first* (grouped by each raw change and walked outward). It
produced subtle position bugs — most visibly the "empty deleted list items" when a `bulletList`
became a `table` — because its ad-hoc block resolution did not match how the `block` diffType
groups. `block` handled these cases perfectly.

The final design is therefore **block-first, reusing the exact same grouping primitive as the
`block` diffType** (`getTopLevelBlockAt`). This makes smart's top-level grouping identical to
block's *by construction*.

Pipeline (`classifySmartChanges`):

1. **Group by top-level block** (`groupByTopLevelBlock`) using `getTopLevelBlockAt(docB, …)` and
   `getTopLevelBlockAt(docA, …)`, keyed by the new-doc block start. Unlike `groupChangesByBlock`,
   we keep each group's constituent raw changes so intra-block density can be measured.
2. **Classify each block group** (`classifyBlockGroup`):
   - **Missing side** (block only in A or only in B) → whole-block change.
   - **Type / wrapping change** (A block type ≠ B block type) → whole-block change. This is the
     paragraph→heading, list→table, wrap-in-panel/quote case.
   - **Textblock** (paragraph/heading on both sides) → `classifyTextblock` (§4.1).
   - **Container** (layout, table, list, panel, expand, quote, …) → `classifyContainer` (§4.2).
3. **Merge overlaps** (`mergeOverlappingByNewDocRange`) and clamp to doc bounds.

### 4.1 Textblock — sentence vs paragraph vs inline

`classifyTextblock` segments both sides with `Intl.Segmenter` (graceful regex fallback — see §6),
treating inline non-text nodes as one opaque word that is **never** a sentence boundary.

- Compute `sentencesChanged / max(sentencesOld, sentencesNew)`.
- If `sentencesChanged >= paragraph.minChanged` **and** ratio `>= paragraph.ratio` →
  **whole-paragraph** change (`smartLevel: 'paragraph'`).
- Otherwise, per changed sentence, compute `wordsChanged / max(wordsOld, wordsNew)`:
  - `wordsChanged >= sentence.minChanged` **and** ratio `>= sentence.ratio` →
    **whole-sentence** change (`smartLevel: 'sentence'`).
  - else keep the raw **inline** change(s).

### 4.2 Container — recurse with escalation

`classifyContainer` measures density over **direct children**:
`changedChildren / max(childrenOld, childrenNew)`.

- If `>= node.ratio` (default 0.6) → **whole-node** change.
- Else, an alternative text-bearing trigger: if the fraction of text-bearing children
  (paragraph/heading) that were themselves promoted to paragraph-level is `>= node.textBearingRatio`
  → **whole-node** change.
- Otherwise, recurse into each changed child (`classifyChild`), keeping the diff strictly inside.

Tables are special-cased (`classifyTable`): cell density is escalated to the **row**, and row
density to the **table** (see §5).

## 5. Structural integrity — the escalation rule

Some children are **structurally rigid**: deleting and re-inserting one on its own would break
the parent's structure. These are tracked in `RIGID_CHILD_TYPES`:

```
layoutColumn, tableCell, tableHeader
```

Rules (`classifyChild` / `classifyContainer` / `classifyTable`):

- **`layoutColumn`** — never a whole-block result on its own. A dense column does **not** become
  "column deleted + column added" (that would break the `layoutSection`). Instead we either
  promote the **whole `layoutSection`** (when overall section density ≥ `node.ratio`) or keep the
  diff **inside** the column (recurse into its children).
- **`tableCell` / `tableHeader`** — same: a single dense cell never becomes a deleted+added cell.
  Cell density escalates to the **`tableRow`** (a row *can* be shown deleted + re-inserted without
  breaking the table), and row density escalates to the **whole `table`**. So even if one cell is
  100% changed, if its row is < `node.ratio` changed overall, the diff stays inline inside the
  cell.
- **`listItem`** — *not* rigid. A list item *can* be replaced wholesale (delete + re-insert at the
  same position keeps the list valid), so it follows the normal container rule: promote the whole
  item when dense, else recurse. And when ≥ `node.ratio` of items changed, the **whole list** is
  promoted.

This is why the doc emphasises escalation over naive "promote the nearest container".

## 6. Configurable thresholds

`SmartDiffThresholds` (in `smart/thresholds.ts`) is passed from the `showDiff` command via
`smartThresholds` → plugin state → `calculateDiffDecorations` → `classifySmartChanges`.
Overrides are shallow-merged per level (`resolveThresholds`).

```ts
DEFAULT_SMART_THRESHOLDS = {
  sentence:  { ratio: 0.4, minChanged: 2 },   // unit = words (inline node = 1 word)
  paragraph: { ratio: 0.4, minChanged: 2 },   // unit = sentences
  node:      { ratio: 0.6, textBearingRatio: 0.6 }, // unit = direct children
};
```

- **sentence** — numerator = words changed; denominator = `max(wordsOld, wordsNew)`;
  `minChanged` = 2.
- **paragraph** — numerator = sentences changed; denominator = `max(sentencesOld, sentencesNew)`;
  `minChanged` = 2.
- **node** — numerator = direct children changed; denominator = `max(childrenOld, childrenNew)`;
  ratio = 0.6. The `textBearingRatio` alternative fires node-level when ≥ 60% of the text-bearing
  children were themselves promoted to paragraph-level.

### Segmentation (`smart/segmentText.ts`)

- Primary: `Intl.Segmenter` for both sentence and word granularity (locale from `intl.locale`).
- **Graceful regex fallback** when `Intl.Segmenter` is unavailable: sentences split on terminator
  punctuation, words on whitespace/word boundaries.
- Operates on a `(string | null)[]` char-view where `null` marks an **opaque inline token**
  (date, mention, emoji, status, …). An inline token counts as exactly one word and is **never**
  a sentence boundary.

## 7. Type/wrapping changes & attribute annotation

- A pure **attribute** change (same node type, same text) is annotated by the existing
  `AttrStep`/`SetAttrsStep` path — not by smart.
- A **node-type or wrapping** change (paragraph→heading, list→table, wrap in panel/quote/
  codeBlock) cannot be an attribute annotation, because the node types differ. Smart detects this
  at the block-group level (A type ≠ B type) and emits a **whole-block** (node-level) change: old
  node shown deleted, new node shown inserted.

## 8. Feature gating

`smart` requires **both** the extended diff pipeline behaviour **and** its own gate. The single
source of truth is `pm-plugins/isExtendedEnabled.ts`:

```ts
export const isExtendedEnabled = (diffType?: DiffType): boolean =>
  expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) ||
  (diffType === 'smart' && fg('platform_editor_ai_smart_diff'));
```

Because the whole extended decoration pipeline was previously gated only by
`platform_editor_diff_plugin_extended`, `diffType` is **threaded through the entire decoration
layer** (inline/block/node/row decorations, `wrapBlockNodeView` and its helpers,
`decorationKeys`, `getScrollableDecorations`) so that every internal extended-gate check becomes
`isExtendedEnabled(diffType)`. This makes `smart` render the full extended shape even when
`platform_editor_diff_plugin_extended` is off — and only when `platform_editor_ai_smart_diff` is
on. Other diff types are unaffected (they pass `diffType` that is not `'smart'`, so the check
reduces to the extended gate alone).

## 9. Rendering specifics

- **Node- and paragraph-level** smart changes render the **new (purple) content on top** and the
  **deleted (gray, strikethrough) content below** it (`placeBelow`), so the new content always
  reads first.
- For **node-level** smart changes the redundant inline highlight is skipped (`isSmartNodeLevel`),
  since the block/widget decorations already highlight the container.

## 10. Module layout

```
src/pm-plugins/
  isExtendedEnabled.ts                     ← shared gate helper (diffType-aware)
  calculateDiff/smart/
    classifySmartChanges.ts                ← block-first orchestrator (§4, §5)
    thresholds.ts                          ← SmartDiffThresholds + defaults (§6)
    segmentText.ts                         ← Intl.Segmenter + regex fallback (§6)
    helpers.ts                             ← makePromotedChange, merge/overlap, smartLevel tag
```

## 11. Testing

- `segmentText` unit tests live in
  `editor-plugin-show-diff-tests/src/__tests__/jest/segmentText.test.ts` and cover the
  Intl.Segmenter path and the regex fallback (inline token = one word, never a sentence
  boundary).
- Classifier behaviour is exercised end-to-end via the `examples/3-smart.tsx` gallery (scenarios
  1a–C6) covering inline/sentence/paragraph promotion, list→table, table cells, layout columns,
  panels, quotes, code blocks, and multi-step changes.

Run: `afm test unit packages/editor/editor-plugin-show-diff-tests/src/__tests__/jest/segmentText.test.ts --run-in-band`.
