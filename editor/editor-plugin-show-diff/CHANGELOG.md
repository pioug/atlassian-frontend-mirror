# @atlaskit/editor-plugin-show-diff

## 19.0.4

### Patch Changes

- [`dec0b5dd31b2f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dec0b5dd31b2f) -
  Add Figma, Lovable, and Replit contributor tags behind
  confluence_ncs_step_diffing_version_history.
- [`806c750c64957`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/806c750c64957) -
  Clean up experiment `platform_editor_diff_plugin_extended`
- Updated dependencies

## 19.0.3

### Patch Changes

- Updated dependencies

## 19.0.2

### Patch Changes

- [`202069bab1e36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/202069bab1e36) -
  Clean up the shipped `platform_editor_enghealth_a11y_jan_fixes` experiment. Toolbar dropdown items
  now always render with `role="menuitem"` and without `aria-pressed`, the block menu always has
  `role="menu"`, and show-diff deleted content always uses the a11y-fixed styles.
- [`5a9dc1baf2bde`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a9dc1baf2bde) -
  EDITOR-9232 Clamp out-of-range suggestion slice override measurements behind
  platform_editor_ai_show_diff_patch_2
- [`8e881a291b8c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e881a291b8c9) -
  Keep existing parent list markers unhighlighted for nested additions behind
  platform_editor_ai_review_moment.
- Updated dependencies

## 19.0.1

### Patch Changes

- [`27d5e74498554`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27d5e74498554) -
  Clean up feature gate `platform_editor_reduce_diff_attr_sensitivity`
- [`6fc3ffdbe2bf3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fc3ffdbe2bf3) -
  Use Rovo's registered brand colour in its fixed participant palette slot.
- Updated dependencies

## 19.0.0

### Minor Changes

- [`9ea47a518fc7c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ea47a518fc7c) -
  Cleanup `feature_gate` `platform_editor_diff_inline_mark_changes`. Non-smart diffs permanently use
  the mark-aware token encoder, so formatting-only edits produce a change, and deleted-side widgets
  are permanently rendered with an empty mark set so they do not inherit the marks of the
  surrounding new document.

### Patch Changes

- Updated dependencies

## 18.0.0

### Patch Changes

- Updated dependencies

## 17.1.10

### Patch Changes

- Updated dependencies

## 17.1.9

### Patch Changes

- [`b378d1dd86483`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b378d1dd86483) -
  Brand ChatGPT contributor tags with the ChatGPT icon and a fixed colour.

  Centralised agent brand metadata in `@atlaskit/agent-color`: added `agent-brand-claude`,
  `agent-brand-chatgpt` and `agent-brand-rovo` colour schemes, and extended
  `getThirdPartyAgentColor` (`./get-third-party-agent-color`) to also resolve the
  `claude`/`chatgpt`/`rovo`/`rovo_chat` aliases and return a canonical display `name`. Removed the
  now-redundant `./chatgpt-brand-color` export (`CHATGPT_BRAND_COLOR`) — its value is now the
  `agent-brand-chatgpt` scheme's `bold`/`boldText` fields, reachable through
  `getThirdPartyAgentColor`.

  `editor-shared-styles` and `editor-plugin-show-diff` now resolve their brand colours and
  contributor-tag names through this shared lookup instead of maintaining their own per-package
  brand tables, with no behaviour change.

- [`6bbecbd2ad0eb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bbecbd2ad0eb) -
  EDITOR-9120 Fix numbered table columns in `platform_editor_ai_show_diff_patch_2` so replacement
  widgets share an existing row number, added and removed rows remain independently numbered, and
  anchor widgets do not create phantom entries.
- Updated dependencies

## 17.1.8

### Patch Changes

- Updated dependencies

## 17.1.7

### Patch Changes

- [`597f7ce38c071`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/597f7ce38c071) -
  Fix contributor tags rendering clipped inside code blocks, and off-position for other
  deleted-content widgets, in version history diffs.

  Anchor the contributor tag to the code block's own box when an edit inside the block hoists the
  tag out of it, instead of an approximate host-relative offset, so the tag no longer renders
  clipped by the code content wrapper.

  Fix deleted headings, lists, and blockquotes missing their background highlight and underline on
  the active change, behind `confluence_ncs_step_diffing_version_history`.

## 17.1.6

### Patch Changes

- [`188a9259b143b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/188a9259b143b) -
  EDITOR-9127 [ux] Align the diff indicator outside the visible outer edges of a whole inserted
  layout.
- Updated dependencies

## 17.1.5

### Patch Changes

- Updated dependencies

## 17.1.4

### Patch Changes

- [`5a4cb407816ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a4cb407816ac) -
  [ux] Strike out a deleted status lozenge in a suggestion diff, behind
  `platform_editor_ai_show_diff_patch_2`. Its `line-through` was not propagated into the
  `display: inline-flex` lozenge and painted beneath its background, so the status showed only the
  deleted highlight.
- Updated dependencies

## 17.1.3

### Patch Changes

- [`8598d92a969fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8598d92a969fc) -
  EDITOR-9000 Fix suggested-edit navigation to scroll to the decorated diff when
  `platform_editor_ai_show_diff_patch_2` is enabled.
- Updated dependencies

## 17.1.2

### Patch Changes

- [`fc26bfc51dd5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fc26bfc51dd5c) -
  Add sparse block-control surface anchors, intersection-driven candidates, and explicit visibility
  invalidation for registry-backed block controls. Expose registration change subscriptions from the
  UI control registry model, and refresh cached visibility from suggestion and collapse transaction
  metadata. Under `platform_editor_block_control_migration`, use native node-anchor identity across
  Editor and Block Controls, and route expand keyboard focus through the shared Block Controls
  command. Preserve Show Diff visibility checks in both migration cohorts so block controls stay
  hidden while a diff is displayed. Keep the block menu closed when a migrated layout-column handle
  opens the layout menu, and close the layout menu when the selection moves away from its selected
  columns.
- Updated dependencies

## 17.1.1

### Patch Changes

- [`296193f8a499b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/296193f8a499b) -
  Keep table diff indicators aligned with the visible table edge when the viewport narrows and the
  table scrolls horizontally, behind platform_editor_ai_show_diff_patch_2.
- Updated dependencies

## 17.1.0

### Minor Changes

- [`1351b0fb49e7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1351b0fb49e7d) -
  Support branded Claude and ChatGPT contributor tags, use the ChatGPT Presence artwork, and assign
  Claude and ChatGPT their fixed orange and gray diff colours.

### Patch Changes

- Updated dependencies

## 17.0.2

### Patch Changes

- [`df446e0eda630`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df446e0eda630) -
  The extended diff view now compares whole tables after a column deletion. Reliably tracked deleted
  columns use strikethrough text and a Removed lozenge, with contributor tags aligned directly above
  the table. Deleted table rows also carry a Removed lozenge in their top-right corner.
- [`885418b21ca4d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/885418b21ca4d) -
  Show a struck-through return glyph (⤶) where a removed blank line was — an empty paragraph or an
  empty heading — instead of rendering nothing. One glyph per removed line, including runs of
  adjacent ones. Covers both diff directions: the deleted side of a forward diff, and the inserted
  side of an inverted diff (AI suggested edits). Behind `platform_editor_ai_show_diff_patch_2`.
- Updated dependencies

## 17.0.1

### Patch Changes

- Updated dependencies

## 17.0.0

### Patch Changes

- Updated dependencies

## 16.2.0

### Minor Changes

- [`b2a2413928cac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2a2413928cac) -
  Match agent highlights, cursors and review diffs to shared Studio and third-party brand colours
  under the existing telepointer redesign. Use the existing purple attribution treatment for Rovo
  review diffs and preserve square Rovo telepointer avatars.

### Patch Changes

- [`8c53dda37401d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c53dda37401d) -
  Fix contributor tags on block nodes, behind `confluence_ncs_step_diffing_version_history`. Changes
  are now split per contributor instead of being credited to whoever wrote last, so each
  contributor's change hosts its own tag and is its own navigation stop.
- Updated dependencies

## 16.1.1

### Patch Changes

- [`285905eda333a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/285905eda333a) -
  Show agent avatars before user avatars in connected contributor tags.
- [`2adef2b5610ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2adef2b5610ff) -
  [ux] Supply the top margin above a diff widget that lands at the start of its parent, so deleted
  content no longer renders flush against the node below it. A node at the start of its parent has
  its top margin reset; a spacer shaped like that node now carries the margin instead, in the
  document and inside layout columns, expands, sync blocks and table cells. A complete deleted
  textblock also keeps its own block wrapper so it retains its margin, including when that block
  carries an alignment or indentation mark. Behind the platform_editor_ai_show_diff_patch_2 feature
  gate.
- Updated dependencies

## 16.1.0

### Minor Changes

- [`8c4837792f18f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c4837792f18f) -
  Add a per-call colorScheme override to the showDiff command, so callers can paint a diff in a
  specific colour scheme without changing the plugin's configured default.

### Patch Changes

- Updated dependencies

## 16.0.17

### Patch Changes

- [`bac902441a512`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bac902441a512) -
  Keep layout column diff indicators aligned with their content instead of appearing beside the
  comments footer, behind `platform_editor_ai_show_diff_patch_1`.
- [`20d41af8d6f4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20d41af8d6f4c) -
  EDITOR-9000 Fixes scroll to suggestion when it is in table with sticky header
- Updated dependencies

## 16.0.16

### Patch Changes

- [`b56b3a7dbfb5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b56b3a7dbfb5a) -
  [ux] Show contributor tags at the top-left of removed table rows and above table interaction
  overlays and sticky header rows. Behind `confluence_ncs_step_diffing_version_history`.
- Updated dependencies

## 16.0.15

### Patch Changes

- [`442abbe2a88e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/442abbe2a88e0) -
  Normalize documents before relaxed show-diff comparisons when Confluence version-history diffing
  is enabled.
- Updated dependencies

## 16.0.14

### Patch Changes

- [`6667b6ae8e77c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6667b6ae8e77c) -
  Ensure contributor tags are rendered for shown attributed diff content, including whitespace-only
  changes and deletion widgets, without tagging structurally empty paragraphs.

## 16.0.13

### Patch Changes

- [`7d1a41f1575e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d1a41f1575e5) -
  Reserve red for deletions in show-diff attribution: an actor hashing to a red palette slot now
  takes the next colour instead. Gated on confluence_ncs_step_diffing_version_history and
  platform_editor_show_diff_color_scheme_refactor.
- [`19e336d422584`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19e336d422584) -
  Fix whole-row table replacements rendering no diff for the new content.
  `createChangedRowDecorationWidgets` only handled row deletions, so a `replaceNode` on a `tableRow`
  (as AI suggested edits emits) left the reviewer with just the removed side — or an empty row in
  the clean view.

  Also give the changed-row widget an indicator anchor, so the indicator bar spans both the proposed
  and replaced rows instead of only the row being changed. This affects row deletions too, whose
  deleted-row bar previously had no anchor to resolve against.

  Both behind `platform_editor_ai_show_diff_patch_1`.

- Updated dependencies

## 16.0.12

### Patch Changes

- [`c3d0cc90fb8a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c3d0cc90fb8a8) -
  [ux] A contributor tag that has been clicked no longer stays visible after the pointer has left
  the change it captions. Behind `confluence_ncs_step_diffing_version_history`.
- [`e6656f3612782`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e6656f3612782) -
  Use the shared agent icon for external diff contributors.
- Updated dependencies

## 16.0.11

### Patch Changes

- Updated dependencies

## 16.0.10

### Patch Changes

- Updated dependencies

## 16.0.9

### Patch Changes

- [`c00ea38023074`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c00ea38023074) -
  [ux] Contributor tags on changed block nodes now sit on the block's own top-left corner, instead
  of drifting by that node type's margin. Behind `confluence_ncs_step_diffing_version_history`.
- Updated dependencies

## 16.0.8

### Patch Changes

- [`7c955f7988148`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c955f7988148) -
  Match show-diff indicator bars to contributor colors using theme-aware ADS border tokens.
- Updated dependencies

## 16.0.7

### Patch Changes

- Updated dependencies

## 16.0.6

### Patch Changes

- [`9e68346721d6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e68346721d6d) -
  Show deleted text in the contributor's colour, strikethrough included, and hold its background
  highlight back until the change is active or hovered. When it arrives, the highlight is a light
  tint under a darker contributor-hue underline — the same treatment hovered and active, rather than
  deepening the background when active.
- Updated dependencies

## 16.0.5

### Patch Changes

- Updated dependencies

## 16.0.4

### Patch Changes

- [`d12940d0a5964`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d12940d0a5964) -
  Fix layout and decision diff underlines and attribution colors, preserve column width styles, and
  align the blue indicator outside layout column borders under platform_editor_ai_show_diff_patch_1.
- [`f044fcdd726df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f044fcdd726df) -
  [EDITOR-8912] Under `platform_editor_ai_show_diff_patch_1`, a change that spans only a block
  node's open token no longer draws a deleted-content widget. A same-type node replacement (an AI
  suggestion rewriting a code block, say) reports the node's attribute change separately from its
  content change, and the attribute half has no deleted content — it rendered as an empty copy of
  the block, e.g. an empty code block above the real diff. Its inserted side, and the node's content
  change, are unaffected.
- Updated dependencies

## 16.0.3

### Patch Changes

- [`0265ca1688db1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0265ca1688db1) -
  [EDITOR-8971] `VanillaTooltip` takes an optional container to append its tooltip to, instead of
  appending it inside the trigger. Opt-in per caller, and used by the diff contributor tag; every
  other tooltip is unchanged.

  Diff contributor tag fixes, all behind `confluence_ncs_step_diffing_version_history`:
  - The tag's full label no longer renders off screen. Its tooltip is hoisted out of the tag, so
    Popper and the browser measure a top-layer popover from the same origin — inside the trigger
    they disagreed whenever an ancestor was transformed, such as a wide image.
  - Stepping to a change reveals only that change's tag, not every tag the active range touches.
  - A contributor no longer gets two tags inside one navigation stop. Two of their changes that
    merely touched each kept a tag, and the trailing one could be hovered but never stepped to; it
    now folds into the leading tag and stays a hover target. Tags for different contributors sharing
    a stop are still kept apart.
  - A tag on deleted content no longer disappears when the document changes. Any change remaps the
    decoration, which rebuilds its widget and fired the teardown — but the deleted-content widget's
    DOM is reused as-is and runs no mount callback, so the tag was faded out of a change that was
    still the active one. The tag is now kept whenever its host is still in a live editor.

- Updated dependencies

## 16.0.2

### Patch Changes

- [`44acf8971ef0e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/44acf8971ef0e) -
  Preserve contributor attribution for attribute-only diff decorations so they use the correct
  colour and contributor tags.
- [`683c1a024bcb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/683c1a024bcb3) -
  Improve the accessibility of contributor diff tags, behind the
  `confluence_ncs_step_diffing_version_history` gate. A tag now announces its contributor once
  rather than three times over, names itself through `aria-labelledby` so it is no longer a focus
  stop without an accessible name, says in its label when the contributor is an AI agent, and draws
  an inset focus ring that reads against every accent fill.

  Stepping to the next or previous change now announces the reader's position in the diff and who
  made the change, through the editor's shared live region. Behind the
  `platform_editor_diff_plugin_extended` experiment.

- Updated dependencies

## 16.0.1

### Patch Changes

- [`a8b0726ce1e34`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8b0726ce1e34) -
  Adds shared semantic agent colour resolution and aligns diff history with agent telepointers
  behind `confluence_ncs_step_diffing_version_history`.
- Updated dependencies

## 16.0.0

### Patch Changes

- Updated dependencies

## 15.1.12

### Patch Changes

- Updated dependencies

## 15.1.11

### Patch Changes

- [`6572960285a9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6572960285a9c) -
  Prevent smart-diff strikethrough decorations from being parsed into ADF strike marks under
  platform_editor_ai_suggested_edits_smart_diff.

## 15.1.10

### Patch Changes

- Updated dependencies

## 15.1.9

### Patch Changes

- [`e3e068dfdea34`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3e068dfdea34) -
  [ux] Behind `platform_editor_ai_show_diff_patch_1`, fix scrolling to a diff landing below the top
  of the change when `confluence_ncs_step_diffing_version_history` is enabled. Deleted content shown
  above the content that replaced it is a zero-width widget on a more negative `side` at the same
  position, and grouping collapsed the pair into one entry represented by the added content — so
  scrolling resolved that range and left the deleted block above the viewport. Decorations sharing a
  position are now ranked by the side they paint on, and a group that starts with deleted content is
  represented by that widget, so scrolling reaches the visual start of the edit.

## 15.1.8

### Patch Changes

- [`920a9bc294e07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/920a9bc294e07) -
  Show names for supported external agents, plus Claude branding and its consistent orange diff
  colour. Share the Claude colour override through getParticipantColor for diff attribution and
  collaboration telepointers behind confluence_ncs_step_diffing_version_history.
- Updated dependencies

## 15.1.7

### Patch Changes

- [`e80305319abbb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e80305319abbb) -
  CCI-19338: Gate Review moment on `platform_editor_ai_streaming_ux_experience_m1` and
  `platform_editor_ai_xstate_migration` only, dropping
  `platform_editor_ai_new_aifc_editor_experience` and its FE/BE params. Optional Review moment
  slices now read prefixed tokens from `platform_editor_ai_streaming_ux_m1_config`.
- [`3dc7417891a0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3dc7417891a0c) -
  Render a `blockquote` inside a diff widget decoration as `display: flow-root` so the diff
  indicator bar spans the quote's full height instead of a single line. Behind the existing
  `platform_editor_ai_show_diff_patch_1` gate; with the gate off the quote keeps its `inline-block`
  display as before.

  Editor CSS renders `blockquote` as `inline-block`, which both establishes a block formatting
  context and makes the quote an atomic inline-level box. The widget container is an inline `span`,
  so the bar's anchor rect is the union of that span's fragments — and an inline box takes its
  height from its font metrics, not from an inline-level child. A quote therefore contributed only
  one line-height, and the bar showed as a stub beside it; most visible when reviewing an AI
  suggestion that wraps content in a quote. `flow-root` is block-level and still establishes the
  formatting context, so the container gets a block fragment sized to the quote while the quote's
  own geometry is unchanged. Every other block node is already block-level and is unaffected.

- [`8815e3a163409`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8815e3a163409) -
  Restyle contributor diff tags to read as a label on the change they caption: flush against it,
  square bottom corners, no bottom border or shadow, and sized to their own content up to a maximum
  width. A tag now paints above the diff highlights instead of below them, so a highlight on the
  line it overlays can no longer slice through it, and it is clipped to its own box so it still
  cannot paint over the change it captions. A tag is now filled with its accent colour's bolder tone
  and labelled in inverse text, rather than the subtlest tint its highlight is drawn in. Tags now
  fade and rise in and out rather than snapping, with a `prefers-reduced-motion` opt-out. Behind the
  `confluence_ncs_step_diffing_version_history` gate.
- Updated dependencies

## 15.1.6

### Patch Changes

- Updated dependencies

## 15.1.5

### Patch Changes

- [`2772d8de10083`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2772d8de10083) -
  Anchor the diff contributor tag on the first non-whitespace character of a change, instead of on
  its first character, so a change whose range opens on whitespace is captioned on the text it
  changed. Also move a replacement's tag onto its deleted half whenever that half renders in front
  of the inserted text, so the tag consistently marks where the change begins. A change whose
  content is nothing but whitespace — a space typed between two words, a run of trailing spaces, an
  added blank line — now carries no tag at all, since it has no visible content to caption; the
  change itself is still highlighted. Behind the `confluence_ncs_step_diffing_version_history` gate.
- Updated dependencies

## 15.1.4

### Patch Changes

- [`1cd03bc12ef72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1cd03bc12ef72) -
  Gate the Milestone 1 streaming UX controls behind the
  `platform_editor_ai_streaming_ux_experience_m1` master experiment. The New AIFC editor experience,
  quick actions block streaming, streaming grey-out suppression, Review moment auto-open, diff-based
  segmenting, quick actions agent attribution, the reveal animation and hide-pure-deletions in the
  diff viewer now each require both the master experiment and their existing individual gate, so no
  M1 slice can ship outside the M1 cohort while each slice stays independently reversible. Non-AI
  callers of the diff viewer are not enrolled in the experiment and default to their existing
  behaviour.
- Updated dependencies

## 15.1.3

### Patch Changes

- [`98eda5f058f8e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98eda5f058f8e) -
  Use gray text and strikethrough for attributed deletions with attribution-coloured backgrounds and
  a background-matched bottom border to preserve highlight height, behind
  confluence_ncs_step_diffing_version_history and platform_editor_show_diff_color_scheme_refactor.

  Use the accent subtlest hovered token for resting attributed insertion underlines, with stronger
  active insertion underlines and deletion backgrounds. Keep attributed deletion opacity at 0.83 in
  both active and non-active states.

- Updated dependencies

## 15.1.2

### Patch Changes

- [`acf9db40862d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acf9db40862d2) -
  Contributor tags no longer disappear for every actor when a single one cannot be named.
  `resolveDiffContributors` now skips only the unresolvable actor — its changes keep their diff
  colour and go untagged — instead of discarding the whole contributor list, and a user-invoked
  agent is still credited (without the connection) when its invoking user has no profile. Behind the
  `confluence_ncs_step_diffing_version_history` feature gate and the
  `platform_editor_show_diff_color_scheme_refactor` experiment.

## 15.1.1

### Patch Changes

- [`857fbb1c07b89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/857fbb1c07b89) -
  [ux] Show a contributor tag at the top left of changed block nodes (panel, quote, expand, media,
  rule, block card, embed card, code block, extension, bodied extension, multi bodied extension),
  behind `confluence_ncs_step_diffing_version_history`. One tag per block: a highlight inside a
  changed block folds into the block's tag, and a change confined to a code block is tagged outside
  the block so it is not clipped. Tables are excluded.
- [`236af9e62ab32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236af9e62ab32) -
  [ux] Suppress contributor tags when contributorProfiles is omitted, preserving attribution colours
  behind confluence_ncs_step_diffing_version_history and
  platform_editor_show_diff_color_scheme_refactor.
- Updated dependencies

## 15.1.0

### Minor Changes

- [`d678fef8a856c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d678fef8a856c) -
  Hide pure deletions in the clean diff view behind platform_editor_diff_hide_pure_deletions
- [`d678fef8a856c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d678fef8a856c) -
  Animate the transition into the diff view behind platform_editor_diff_reveal_animation

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Minor Changes

- [`d03fb7d6bfd0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d03fb7d6bfd0f) -
  Map attribution colour schemes onto ten ADS accent hues, render them with the bolder participant
  treatment, and allocate the next available colour when participant hashes collide.
- [`1d5a7cbfd029e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d5a7cbfd029e) -
  The diff contributor tag is now drawn as plain DOM by its own widget decoration, following the
  vanilla `@mention` node-view approach, so it needs no React portal into the editor. `react-dom`
  stays a peer dependency for the rest of the plugin's React UI; `@atlaskit/tooltip`,
  `@atlaskit/visually-hidden`, `@atlaskit/icon-lab` and `@atlaskit/logo` are no longer dependencies,
  and only `@atlaskit/avatar`'s size constants are still used.

  The tag's tooltip is now always the full "Changed by" label, rather than only appearing when the
  name it draws is clipped.

### Patch Changes

- [`35f8ff3c9ce4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35f8ff3c9ce4f) -
  Clean up the released `platform_editor_improve_inline_diffs` experiment and remove the obsolete
  editor experiment migration entry point.
- Updated dependencies

## 14.5.2

### Patch Changes

- Updated dependencies

## 14.5.1

### Patch Changes

- [`0417aa8001bf1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0417aa8001bf1) -
  Fix attributed changes not using agreed step type

## 14.5.0

### Minor Changes

- [`a47ac4819a984`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a47ac4819a984) -
  Attribution colouring now applies to single-actor diffs. Previously colouring required two or more
  distinct actors to be worth distinguishing; it now surfaces the participant colour as soon as
  there is an identifiable actor, while still respecting the attribution-colour gates.

## 14.4.3

### Patch Changes

- Updated dependencies

## 14.4.2

### Patch Changes

- Updated dependencies

## 14.4.1

### Patch Changes

- Updated dependencies

## 14.4.0

### Minor Changes

- [`844f6fce7d9c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/844f6fce7d9c4) -
  [ux] Attributed diff changes now render a contributor tag naming who made the change, tinted to
  match the change's attribution colour, behind the `confluence_ncs_step_diffing_version_history`
  gate. The tag renders from its own widget decoration rather than a CSS-anchor-positioned overlay,
  and `react-dom` is declared as a peer dependency for the portal into that widget. Adds an optional
  `contributorProfiles` list to the attributed `showDiff` params, from which the plugin resolves the
  contributors it credits.

### Patch Changes

- Updated dependencies

## 14.3.2

### Patch Changes

- [`a6c26b16402ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a6c26b16402ca) -
  Migrate nine dogfooding editor experiments from `@atlaskit/tmp-editor-statsig` to the Platform
  experiment API and move their tests to Platform experiment mocks.
- Updated dependencies

## 14.3.1

### Patch Changes

- Updated dependencies

## 14.3.0

### Minor Changes

- [`8093f00408d76`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8093f00408d76) -
  Align attributed diff colours with all 18 editor participant colour slots under
  confluence_ncs_step_diffing_version_history and platform_editor_show_diff_color_scheme_refactor.

## 14.2.11

### Patch Changes

- [`15abc159d8096`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/15abc159d8096) -
  Add mark (formatting) support to the non-smart diff types behind
  `platform_editor_diff_inline_mark_changes`. A mark-only agent edit arrives as a `ReplaceStep`,
  which the default `prosemirror-changeset` token encoder tokenises identically on both sides, so
  bold/italic/code/link changes were silently invisible in the inline diff. A mark-aware token
  encoder now folds marks into the character token, and mark-only changes render as an added-side
  highlight without duplicating the unchanged text. No behaviour change with the gate off.
- Updated dependencies

## 14.2.10

### Patch Changes

- Updated dependencies

## 14.2.9

### Patch Changes

- Updated dependencies

## 14.2.8

### Patch Changes

- Updated dependencies

## 14.2.7

### Patch Changes

- [`68281638de8fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68281638de8fc) -
  Group overlapping diff decorations into a single customer-facing edit and highlight the full edit
  when navigating changes, gated by `confluence_ncs_step_diffing_version_history`.

## 14.2.6

### Patch Changes

- Updated dependencies

## 14.2.5

### Patch Changes

- Updated dependencies

## 14.2.4

### Patch Changes

- Updated dependencies

## 14.2.3

### Patch Changes

- [`e3b2afdd0a76a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3b2afdd0a76a) -
  [ux] Preserve the configured colour scheme for attributed diffs with zero or one distinct
  contributor behind `confluence_ncs_step_diffing_version_history` and
  `platform_editor_show_diff_color_scheme_refactor`.
- [`ee583927e98cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee583927e98cc) -
  [ux] Gate Post Stream Review smart diff behavior behind `platform_editor_ai_smart_diff` and its
  diff indicators behind `platform_editor_diff_plugin_show_indicators`. Require the smart diff gate
  when selecting the show-diff plugin's default diff type.
- Updated dependencies

## 14.2.2

### Patch Changes

- [`2c226f2acb3be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c226f2acb3be) -
  Preserve complete block wrappers for multi-inline-node suggestion diffs while continuing to render
  open slice boundaries as fragments behind platform_editor_ai_show_diff_patch_1.
- Updated dependencies

## 14.2.1

### Patch Changes

- Updated dependencies

## 14.2.0

### Minor Changes

- [`391eb60fad28b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/391eb60fad28b) -
  Export `ShowDiffParams` from the public show-diff type entry point.

## 14.1.1

### Patch Changes

- [`b1510eccd9729`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b1510eccd9729) -
  Reduce false-positive attribute diff decorations behind
  `platform_editor_reduce_diff_attr_sensitivity`.
- Updated dependencies

## 14.1.0

### Minor Changes

- [`69574af99ed9e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69574af99ed9e) -
  [ux] Add attributed-step inputs and internally selected, gated agent colours behind
  `confluence_ncs_step_diffing_version_history` and
  `platform_editor_show_diff_color_scheme_refactor`.

## 14.0.4

### Patch Changes

- [`62c3227f6a3ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62c3227f6a3ac) -
  [CCI-19031] Fix large-table diffs suppressing decorations on adjacent inserted content. When a
  paragraph (or other block) is inserted next to a large table, the smart classifier coalesces them
  into a single node-level change. The coarse large-table decoration path now scopes cell-only
  suppression to the table subtree, so adjacent inserted content keeps its highlight and indicator
  instead of being dropped.
- Updated dependencies

## 14.0.3

### Patch Changes

- Updated dependencies

## 14.0.2

### Patch Changes

- [`86e4ff02ed98c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86e4ff02ed98c) -
  [ux] Collapse the per-scheme show-diff selectors onto one class per visual role, behind
  `platform_editor_show_diff_color_scheme_refactor`. No rendered change in either cohort.

  With the experiment on, `wrapBlockNodeView` marks deleted media, embed and blockquote nodeviews
  with `show-diff-deleted-node-next` and emits the scheme's colours as `--diff-delete-*` custom
  properties, so editor-core carries one set of selectors instead of one per scheme. The
  atomic-inline highlight (date, emoji, mention, status) works the same way. Two new scheme fields —
  `deletedMediaRingColor` and `strikesDeletedEmbedCard` — replace the last literal colours on that
  path, both set to today's values.

  With it off, the pre-refactor classes and per-scheme selectors run unchanged. Both selector sets
  ship together for the life of the experiment, keyed on disjoint base classes.

- [`e5bea22208fbe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5bea22208fbe) -
  Fix deleted diffs dropping atomic inline nodes: when a deleted paragraph or table cell contains an
  atomic inline node (e.g. date, status), it now serializes via its node view instead of lossy
  schema `toDOM`, so dates no longer disappear and status lozenges keep their styling. Plain and
  marked text is unaffected. Gated behind the `platform_editor_show_diff_deleted_nodeview_content`
  experiment.

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

### Patch Changes

- [`c87074ddaa72d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c87074ddaa72d) -
  Resolve the show-diff left anchor's document-level node once behind
  `platform_editor_diff_plugin_extended`.
- [`d3bb0c15d7e40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3bb0c15d7e40) -
  Recognise generic node attribute changes in Smart diff behind platform_editor_ai_smart_diff.
- [`92f6f5d3380be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92f6f5d3380be) -
  Use the smart diff strategy by default for Confluence version history behind the
  `confluence_ncs_step_diffing_version_history` feature gate.
- Updated dependencies

## 13.1.10

### Patch Changes

- Updated dependencies

## 13.1.9

### Patch Changes

- [`656801b9e097c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/656801b9e097c) -
  VOLTC-331 - Migrate updated package usage in platform/editor: rewrite barrel imports of
  voltCompliant provider packages to deep/subpath imports (consumer-side debarrel). No public API
  changes.
- Updated dependencies

## 13.1.8

### Patch Changes

- Updated dependencies

## 13.1.7

### Patch Changes

- Updated dependencies

## 13.1.6

### Patch Changes

- [`72bb78136922f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72bb78136922f) -
  [CCI-18917] Render node attribute-only changes (e.g. a panel type change note → warning) in the AI
  Review Moment as a before/after diff.

  A container's own attribute change touches no inner child, so the smart-diff classifier's
  child-density check previously dropped it and nothing rendered. The smart-diff token encoder now
  folds the container's diffable attributes into its node-start token (normalising node variants
  such as `panel_c1` → `panel`), the classifier promotes the whole container to a node-level change,
  and the decoration builder renders the new node plus the original node as a "deleted" widget so
  the reviewer sees the before/after. Gated to the smart node-level AIFC Review Moment path.

- [`4747ee2b7b275`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4747ee2b7b275) -
  Only inspect logical top and bottom rows when assigning table edge attributes under
  platform_editor_table_diff_rounded_corners.
- Updated dependencies

## 13.1.5

### Patch Changes

- [`fd3620d4e137b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd3620d4e137b) -
  [CCI-18915] Surface and render formatting-only (mark) agent edits in the AI Review Moment.

  Mark-only agent steps (`AddMarkStep`/`RemoveMarkStep` — e.g. making text bold, italic, or a link)
  have an empty `StepMap`, so the agent review-segment and shimmer builders — which derived their
  changed ranges purely from `StepMap` geometry — never produced a range for them. As a result a
  formatting-only agent edit opened no Review Moment and showed no shimmer. Both builders now detect
  mark steps and derive their range from `step.from`/`step.to`.

  The smart-diff token encoder additionally folds each character's marks (type + attrs) into its
  token, so once the moment opens the change renders as a real diff (e.g. a bold-only edit, or a
  link whose `href` changes) instead of an empty one.

- Updated dependencies

## 13.1.4

### Patch Changes

- Updated dependencies

## 13.1.3

### Patch Changes

- Updated dependencies

## 13.1.2

### Patch Changes

- [`f8a30b9c66bf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f8a30b9c66bf8) -
  Replace each hardcoded colour in the show-diff deleted-node selectors with
  `var(--diff-delete-*, <the same token as before>)`, in both `smartCardStyles.ts` and its inlined
  duplicate in `EditorContentContainer-compiled.tsx`.

  No visual change: nothing sets these variables yet, so every declaration resolves to its current
  value. All `-traditional` selectors are retained and opacity is untouched.

  Groundwork for EDITOR-8551, ahead of the gated change that lets a colour scheme drive these
  selectors.

- Updated dependencies

## 13.1.1

### Patch Changes

- Updated dependencies

## 13.1.0

### Minor Changes

- [`ff63426bafe82`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff63426bafe82) -
  Migrate all show-diff decoration consumers off the traditional/standard colour scheme shims onto
  the scheme registry and factory, replacing roughly 30 `colorScheme === 'traditional'` branches,
  and add five structural fields to `DiffColorScheme` so both schemes keep rendering identically.

  Behind the `platform_editor_show_diff_color_scheme_refactor` experiment, default off, read inline
  at each call site with `isExperimentEnabled` from `@atlaskit/platform-feature-experiments`. Every
  gated call site keeps its pre-refactor implementation in a `*.legacy.ts` sibling, and the
  `standard.ts` / `traditional.ts` shims are retained, so the off cohort runs exactly the code it
  ran before.

  In editor-core, the atomic inline highlight for date, emoji, mention and status nodes gains a
  `var(--show-diff-atomic-inline-changed-border-color, <token>)` fallback on the consuming
  declarations. The existing two-scheme colour table is unchanged and still drives the off cohort;
  it is removed in a follow-up once the experiment is cleaned up.

  No visual change in either cohort.

### Patch Changes

- Updated dependencies

## 13.0.11

### Patch Changes

- Updated dependencies

## 13.0.10

### Patch Changes

- Updated dependencies

## 13.0.9

### Patch Changes

- [`0123de9acf8b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0123de9acf8b1) -
  [CCI-18588] Fix multi-second browser freeze when opening the AI Review moment on a large generated
  table. For big inserted tables the diff previously emitted one decoration per cell (O(cells)) plus
  redundant inner-block decorations, forcing a full synchronous table relayout. It now skips the
  per-cell inline and inner-block (table/row/paragraph) decorations while keeping the cell overlay
  highlight. Gated behind `platform_editor_ai_new_aifc_editor_experience`; behaviour is unchanged
  for small tables and when the experiment is off.

## 13.0.8

### Patch Changes

- [`d4fbe7dee465e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4fbe7dee465e) -
  Consolidate diff decoration scrolling into a single internal helper.
- Updated dependencies

## 13.0.7

### Patch Changes

- [`2c712e57d3793`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c712e57d3793) -
  Consolidate diffable-attribute rules into a single shared source of truth (`diffableAttrs`) used
  by both the changeset token encoder (detection) and `getAttrChangeRanges` (rendering), and extend
  the encoder to fold all mapped node types.
- Updated dependencies

## 13.0.6

### Patch Changes

- [`7393a83aff767`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7393a83aff767) -
  [ux] Fix inserted table diff overlays to follow rounded table corners when
  platform_editor_table_diff_rounded_corners is enabled.
- Updated dependencies

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [`fe858303d6a81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe858303d6a81) -
  [ux] Under `platform_editor_diff_plugin_extended`, prevent a replacement of the first document
  heading from overlapping its diff.

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- [`0a2a45bf998e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a2a45bf998e8) -
  [ux] Fix AI suggested-edits diff for table cells (behind the
  `platform_editor_diff_plugin_extended` gate). When a suggestion fills multiple empty cells at once
  (e.g. "Add table headers"), the added content now shows in every cell, the row-spanning indicator
  anchors stay inside their cells instead of collapsing the table, and a cell being filled is
  highlighted as an addition (purple) rather than a deletion (grey).
- Updated dependencies

## 13.0.1

### Patch Changes

- [`73a676426d5ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73a676426d5ed) -
  [ux] Preserve spacing between a block diff inserted at the top of a document and the node that
  follows it.
- Updated dependencies

## 13.0.0

### Patch Changes

- Updated dependencies

## 12.1.4

### Patch Changes

- [`522f40dd846c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/522f40dd846c1) -
  Fix table-cell diffs in the Post Stream Review experience. Recolouring a table cell is now
  surfaced in the review with a highlight and a navigable step-through segment, and stepping onto a
  cell no longer renders a blank cell.
  - The AI modal mount-point widget could be positioned directly inside a table row, where the
    browser wrapped it in an anonymous table cell — a blank column that hid the real cell's content.
    It is now kept out of table structure.
  - `prosemirror-changeset`'s default token encoder ignores node attributes, so a cell recolour
    produced no change at all. An attribute-aware encoder now folds an allow-list of table-cell
    attributes into the diff.
  - The smart classifier discarded attribute changes on table cells because they sit on the node
    boundary rather than inside the cell's content. It now emits a whole-cell change when a rigid
    wrapper's own attributes differ.

- [`3fd2c0404aff0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fd2c0404aff0) -
  Introduce a data-driven colour-scheme pattern for show-diff decorations: a `DiffColorScheme` type
  (`types.ts`), shared CSS-generating functions (`factory.ts`) and the two scheme definitions
  (`schemes.ts`).

  Most scheme fields are ADS accent colour names; seven encode structural differences that no colour
  can express (`insertUnderlineStyle`, `deletedQuoteNodeShape`, `deletedCellBorderProminence`,
  `deletedRowTreatment`, `deletedBlockOutlineActiveEmphasis`, `addedCellOverlayZIndex`,
  `roundedAddedCellOverlayInheritsBorder`), so a new scheme has to decide each of those too.

  Additive only — nothing consumes the factory yet. `standard.ts` and `traditional.ts` are unchanged
  and remain the source of every rendered style, so there is no behaviour or visual change. Wiring
  the decoration consumers up behind a feature gate follows separately.

- Updated dependencies

## 12.1.3

### Patch Changes

- [`774c01e2f1cdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/774c01e2f1cdd) -
  Remove the `platform_editor_diff_granular_extended` experiment and retain its disabled behavior.
- Updated dependencies

## 12.1.2

### Patch Changes

- [`3d45d0ef1fb3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d45d0ef1fb3f) -
  Prevent block diff content from overlapping preceding editor nodes

## 12.1.1

### Patch Changes

- [`3a38a59a355f5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a38a59a355f5) -
  Add a feature-gated platform experiments strangler entry point and migrate the inline-diffs
  experiment as its first consumer.

  ```ts
  import { isExperimentEnabled } from '@atlaskit/editor-common/deprecated-platform-feature-experiments';
  import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

  const isEnabled = isExperimentEnabled('platform_editor_example', () =>
  	expValEquals('platform_editor_example', 'isEnabled', true),
  );
  ```

- Updated dependencies

## 12.1.0

### Minor Changes

- [`0a96aa66ed44f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a96aa66ed44f) -
  [ux] CCI-18372 Post Stream Review now renders deleted content below the added content at every
  change level (gated behind `platform_editor_ai_smart_diff`), so reviewers read the new text first.

  Deleted-content placement is split by change granularity, so consumers that want deleted content
  after the new content everywhere must set both options (each defaults to rendering deleted content
  first, and both require `diffType: 'smart'`):

  ```ts
  api?.showDiff?.commands?.showDiff({
  	originalDoc,
  	diffType: 'smart',
  	deletedDiffPlacement: 'bottom', // node/paragraph-level changes
  	inlineDeletedDiffPlacement: 'after', // inline/sentence-level changes
  });
  ```

  `@atlaskit/editor-plugin-show-diff` also adds a `getDeletedWidgets` action (returning the
  `DeletedDiffWidget` elements and positions), used by Post Stream Review to position the review
  modal below relocated deleted content.

### Patch Changes

- Updated dependencies

## 12.0.3

### Patch Changes

- Updated dependencies

## 12.0.2

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.0.6

### Patch Changes

- [`d1b5e85073e48`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1b5e85073e48) -
  [ED-7926] Fix block controls hover jitter when viewing an AI Suggested Edits diff.

  While a diff is on screen the block controls UI is hidden, but the hover handlers kept running:
  `handleMouseOver` dispatched `showDragHandleAt` (flip-flopping the active node between
  neighbouring blocks) and the right-side hover-side tracker kept dispatching
  `setHoverSide`/`mouseEnter`, both causing visible jitter. Block controls now suppress both hover
  paths (and hide the drag handle) while a diff is displayed, detected via the show-diff plugin's
  `isDisplayingChanges` shared state (plus the `reviewing` user intent for AI suggestions with no
  diff decorations), gated behind `platform_editor_diff_plugin_extended`.

  To let block controls read that state without forming a circular project reference
  (`block-controls -> show-diff -> expand -> block-controls`), the `toggleExpandRange` command and
  `TOGGLE_EXPAND_RANGE_META_KEY` were moved from `@atlaskit/editor-plugin-expand` into
  `@atlaskit/editor-common` (re-exported from expand for backwards compatibility).
  `@atlaskit/editor-plugin-show-diff` no longer depends on `@atlaskit/editor-plugin-expand`, and
  `@atlaskit/editor-plugin-block-controls` now takes an optional dependency on
  `@atlaskit/editor-plugin-show-diff`.

- Updated dependencies

## 11.0.5

### Patch Changes

- [`67209770a447f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/67209770a447f) -
  [ED-8371] Fix `scrollToDiff` not always scrolling to the first diff decoration. When
  `scrollIntoView` was requested on an extended diff (e.g. AI Suggested Edits),
  `scrollToFirstDecoration` selected its target using `DecorationSet.find()`, which returns
  decorations in the set's internal order rather than document position and applies no scrollability
  filtering. As a result it could scroll to a later decoration (for example a `removeNode` deletion)
  instead of the topmost one. It now scrolls to the first entry of `getScrollableDecorations` — the
  same filtered, position-sorted list used by the active-index navigation path — so "first" reliably
  means the topmost scrollable diff in the document.
- Updated dependencies

## 11.0.4

### Patch Changes

- Updated dependencies

## 11.0.3

### Patch Changes

- Updated dependencies

## 11.0.2

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- Updated dependencies

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.7.3

### Patch Changes

- Updated dependencies

## 10.7.2

### Patch Changes

- Updated dependencies

## 10.7.1

### Patch Changes

- [`f8eddc13a614d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f8eddc13a614d) -
  Resolve inline anchor positions into inline content depending on if delete widget is rendered to
  prevent indicators extending at the top
- Updated dependencies

## 10.7.0

### Minor Changes

- [`51c33ef5349b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51c33ef5349b6) -
  Enable compatibility with React 19.2.0

### Patch Changes

- Updated dependencies

## 10.6.3

### Patch Changes

- [`cdcab84f9ff37`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cdcab84f9ff37) -
  EDITOR-7839: Decrease cell overlay opacity for standard added cell styles
- Updated dependencies

## 10.6.2

### Patch Changes

- Updated dependencies

## 10.6.1

### Patch Changes

- [`963920819d38c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/963920819d38c) -
  Fix rounded table diff overlays for whole-table widgets.
- Updated dependencies

## 10.6.0

### Minor Changes

- [`0840aa4f6b2d0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0840aa4f6b2d0) -
  Add a new `inlineDeletedDiffPlacement: 'before' | 'after'` option to `PMDiffParams` for the
  `smart` diff type. When set to `'after'`, inline-level (and sentence-level) deleted content is
  rendered after the added/updated content instead of before it. Defaults to `'before'` and is
  independent of the existing node/paragraph-level `deletedDiffPlacement` option. Post Stream Review
  now requests `'after'` so reviewers read the new text first.

## 10.5.3

### Patch Changes

- [`154b76531a593`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/154b76531a593) -
  Fix table diff cell overlays to use rounded corners for inserting row diffs when
  platform_editor_table_diff_rounded_corners is enabled

## 10.5.2

### Patch Changes

- [`75c7e6a9aa4ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75c7e6a9aa4ec) -
  [ux] Improve showing diff for attribute changes for inline nodes.
- Updated dependencies

## 10.5.1

### Patch Changes

- [`ded72f3ee293f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ded72f3ee293f) -
  Fix table diff cell overlays to use rounded corners for delete row diffs when
  platform_editor_table_diff_rounded_corners is enabled
- [`11b7096b9b80c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11b7096b9b80c) -
  CCI-17981: Fix diff indicator misalignment on page resize by observing measured DOM elements for
  size changes
- Updated dependencies

## 10.5.0

### Minor Changes

- [`2cfc0f295c39a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2cfc0f295c39a) -
  [ux] FG cleanup - Removes `confluence_frontend_content_wrapper` from platform (treated as
  permanently launched / implicitly true).

  ## Breaking change

  The `confluence_frontend_content_wrapper` gate previously guarded a scroll-gutter tweak in
  `basePluginOptions` that only read the `base` builder's `__livePage` field. With the gate
  launched, that field is no longer read, so the now-dead `base` option was removed rather than left
  as vestigial API.

  For `@atlaskit/editor-presets` (published):
  - The `base` option was removed from the public preset plugin options type
    (`AllPublicPluginOptions.base` is now `never`).
  - `basePluginOptions()` no longer takes an argument (was `basePluginOptions({ options })`).

  This is a **type-level** breaking change only. At runtime it is a no-op: the `base` option (and
  the `__livePage` value passed through it) was already unused once the gate was on, so removing it
  does not change editor behaviour. It is scored `major` for `@atlaskit/editor-presets` because that
  package is published and the type contract change will break the builds of external TypeScript
  consumers that still pass `base`. `@atlassian/confluence-presets` is `private` (not published) and
  receives the same code change, so it is scored `minor`.

  ## Migration

  Stop passing the `base` option to the preset, and call `basePluginOptions()` with no arguments:

  ```diff
   fullPagePreset({
     intl,
     pluginOptions: {
  -    base: { __livePage },
       // ...other plugin options unchanged
     },
   });
  ```

  ```diff
  - basePluginOptions({ options: { __livePage } });
  + basePluginOptions();
  ```

  Note: `__livePage` itself is not removed — it remains a valid, live field on the other plugin
  option builders (e.g. `selection`, `selectionMarker`, `collabEdit`, `card`). Only the unused
  `base.__livePage` passthrough is gone. All in-repo consumers have been migrated as part of this
  PR.

### Patch Changes

- Updated dependencies

## 10.4.9

### Patch Changes

- Updated dependencies

## 10.4.8

### Patch Changes

- Updated dependencies

## 10.4.7

### Patch Changes

- Updated dependencies

## 10.4.6

### Patch Changes

- [`89de40d80a7ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89de40d80a7ce) -
  [ux] Add toggle to show/hide deleted diffs on the AI suggestion card. An eye icon button is added
  inline with the Accept and Discard buttons, allowing users to hide all greyed-out deleted content
  while keeping purple highlighted additions visible. The toggle resets to the default "show
  deletions" state when navigating between suggestions.
- Updated dependencies

## 10.4.5

### Patch Changes

- Updated dependencies

## 10.4.4

### Patch Changes

- Updated dependencies

## 10.4.3

### Patch Changes

- Updated dependencies

## 10.4.2

### Patch Changes

- [`a41c9b243974d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a41c9b243974d) -
  Fix smart diff fabricating a phantom whole-block deletion when a new block is inserted at a
  top-level boundary (e.g. a paragraph added immediately before a bulletList). topLevelBlocksInRange
  now treats a zero-width insertion anchor sitting exactly on a top-level block boundary as touching
  no block, so a pure insertion is no longer mis-paired with the following block and converted into
  a whole-block replacement. This also lets pure whole-block deletions surface under smart diff.
- Updated dependencies

## 10.4.1

### Patch Changes

- [`81ce4d8f5cd8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ce4d8f5cd8a) -
  Show blue indicators for new added paragraphs and headings
- Updated dependencies

## 10.4.0

### Minor Changes

- [`0f27159a9087b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f27159a9087b) -
  Add `hideAddedDiffsUnderline` option to the `showDiff` command to disable the dark-purple
  underline on added/updated diff content while keeping the purple highlight. Only affects the
  extended/`smart` inserted styles, is gated behind the `platform_editor_ai_smart_diff` feature
  gate, and defaults to `false`.

  ```ts
  editorApi.showDiff.commands.showDiff({
  	steps,
  	originalDoc,
  	hideAddedDiffsUnderline: true,
  });
  ```

## 10.3.0

### Minor Changes

- [`21147179a56ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21147179a56ea) -
  [CCI-17809] Overhaul Post Stream Review segmenting.

  `@atlaskit/editor-plugin-show-diff`: add a generic `computeDiffChanges` utility (new
  `@atlaskit/editor-plugin-show-diff/calculate-diff` entry point) that returns the classified
  `Change[]` and reconstructed new document for a given `originalDoc` + `steps`, without rendering
  decorations. It reuses the same classifier the diff overlay renders from (default
  `diffType: 'smart'`), so consumers can derive their own reviewable segments that line up with what
  the overlay would draw. Exposes the `ComputeDiffChangesParams` type.

  `@atlassian/editor-plugin-ai`: support two segmenting strategies in the Post Stream Review
  step-through, selected by the new `platform_editor_ai_diff_based_segmenting` gate. Gate ON =
  diff-based (`smart`) segmenting (via the show-diff `computeDiffChanges` utility, shaped into
  reviewable segments in the AI plugin); gate OFF (default) = top-level-node segmenting, which no
  longer splits a list into individual list items. Fine segments are now stored in plugin state and
  remapped on every doc change, so per-segment undo/redo and view-changes stay correct after an
  undo. Aggregate ("all changes") mode is unchanged.

### Patch Changes

- Updated dependencies

## 10.2.0

### Minor Changes

- [`eb1f11daf16c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb1f11daf16c8) -
  Add a new `smart` `DiffType` that classifies changes by density at the sentence, paragraph and
  node level and renders the most readable granularity for each change. Introduces the exported
  `SmartDiffThresholds` type and a `smartThresholds` option on the `showDiff` params for configuring
  the sentence/paragraph/node promotion thresholds.

  Also adds a new exported `DeletedDiffPlacement` type (`'top' | 'bottom'`) and a
  `deletedDiffPlacement` param on `PMDiffParams` that controls whether node/paragraph-level deleted
  content is rendered above (`'top'`, the default) or below (`'bottom'`) the new content.

  Usage:

  ```ts
  import type {
  	DeletedDiffPlacement,
  	SmartDiffThresholds,
  } from '@atlaskit/editor-plugin-show-diff/show-diff-plugin-type';

  editorApi.showDiff.commands.showDiff({
  	originalDoc,
  	steps,
  	diffType: 'smart',
  	// Optional; controls where deleted content is rendered. Defaults to 'top'.
  	deletedDiffPlacement: 'bottom' satisfies DeletedDiffPlacement,
  	// All fields optional; defaults applied internally.
  	smartThresholds: {
  		sentence: { minChanged: 2, ratio: 0.4 },
  		paragraph: { minChanged: 2, ratio: 0.4 },
  		node: { ratio: 0.6, textBearingRatio: 0.6 },
  	} satisfies SmartDiffThresholds,
  });
  ```

## 10.1.23

### Patch Changes

- Updated dependencies

## 10.1.22

### Patch Changes

- Updated dependencies

## 10.1.21

### Patch Changes

- Updated dependencies

## 10.1.20

### Patch Changes

- [`afd15695098bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/afd15695098bb) -
  EDItOR-7711: Show block changed diff indicators.
- Updated dependencies

## 10.1.19

### Patch Changes

- Updated dependencies

## 10.1.18

### Patch Changes

- Updated dependencies

## 10.1.17

### Patch Changes

- Updated dependencies

## 10.1.16

### Patch Changes

- Updated dependencies

## 10.1.15

### Patch Changes

- Updated dependencies

## 10.1.14

### Patch Changes

- Updated dependencies

## 10.1.13

### Patch Changes

- Updated dependencies

## 10.1.12

### Patch Changes

- [`3d9bf2e6f248a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9bf2e6f248a) -
  Fix nested image in panel shifting left when showing suggestion diff
- Updated dependencies

## 10.1.11

### Patch Changes

- [`0096393101f67`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0096393101f67) -
  Render inverted granular step diffs as a hybrid (based on threshold): granular changed inline plus
  a 'reference' block crossed out underneath
- Updated dependencies

## 10.1.10

### Patch Changes

- [`346f91cfe1997`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/346f91cfe1997) -
  Clean up prefer static regex violations
- Updated dependencies

## 10.1.9

### Patch Changes

- [`86eb94526dc1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86eb94526dc1d) -
  [EDITOR-7841] Fix bug where diff widgets missing margin when the diff is the first node of the
  document
- Updated dependencies

## 10.1.8

### Patch Changes

- Updated dependencies

## 10.1.7

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- Updated dependencies

## 10.1.5

### Patch Changes

- Updated dependencies

## 10.1.4

### Patch Changes

- Updated dependencies

## 10.1.3

### Patch Changes

- Updated dependencies

## 10.1.2

### Patch Changes

- Updated dependencies

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [`96a8a99060dfc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96a8a99060dfc) -
  EDITOR-7523: Add diff indicators to the left doc margin

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- Updated dependencies

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

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

### Minor Changes

- [`4759c2ac86196`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4759c2ac86196) -
  EDITOR-7523: Add diff descriptors with new diff ids and types.

### Patch Changes

- Updated dependencies

## 9.1.2

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- [`3cd3edf123888`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3cd3edf123888) -
  Remove purple underline from block widget containers when diffs are inverted with extended
  experiment enabled
- Updated dependencies

## 9.1.0

### Minor Changes

- [`a3a227e567efe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3a227e567efe) -
  [ux] [EDITOR-7662] disabled block controls when viewing diffs

### Patch Changes

- [`281cf98f35fe5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/281cf98f35fe5) -
  Minor refactor to use a decoration key builder so that it can be extended upon in upcoming work.
- Updated dependencies

## 9.0.17

### Patch Changes

- Updated dependencies

## 9.0.16

### Patch Changes

- [`3effa9ec1b6b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3effa9ec1b6b3) -
  Add borderBottom and padding to removed inline diffs to match the height of added inline diffs
- Updated dependencies

## 9.0.15

### Patch Changes

- Updated dependencies

## 9.0.14

### Patch Changes

- Updated dependencies

## 9.0.13

### Patch Changes

- Updated dependencies

## 9.0.12

### Patch Changes

- Updated dependencies

## 9.0.11

### Patch Changes

- Updated dependencies

## 9.0.10

### Patch Changes

- Updated dependencies

## 9.0.9

### Patch Changes

- Updated dependencies

## 9.0.8

### Patch Changes

- Updated dependencies

## 9.0.7

### Patch Changes

- Updated dependencies

## 9.0.6

### Patch Changes

- [`ca2189db06329`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ca2189db06329) -
  Update diff style
- Updated dependencies

## 9.0.5

### Patch Changes

- [`4c2645b77929d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c2645b77929d) -
  [ux] EDITOR-7346 add ai and diff plugin support for panel_c1
- Updated dependencies

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- [`9301f162e76d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9301f162e76d2) -
  EDITOR-7470: Fix mid-word punctuation in diffs splitting word boundaries.
- Updated dependencies

## 9.0.2

### Patch Changes

- [`b3d1adf5a46c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3d1adf5a46c7) -
  Fix word-boundary diff cutoff when a granular textblock diff runs inside a paragraph that contains
  non-text inline nodes (hardBreak, mention, emoji, date, etc.). Previously the expansion logic
  indexed into `parent.textContent`, which strips those nodes, so doc positions in the body could
  land mid-word and pull untouched neighbouring words into the diff range.

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Patch Changes

- Updated dependencies

## 8.4.10

### Patch Changes

- Updated dependencies

## 8.4.9

### Patch Changes

- Updated dependencies

## 8.4.8

### Patch Changes

- Updated dependencies

## 8.4.7

### Patch Changes

- [`8132cf74d023d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8132cf74d023d) -
  EDITOR-7377: Fix granular diffs to show diffs at word boundaries (non-whitespace characters)
- Updated dependencies

## 8.4.6

### Patch Changes

- [`5e34be0ba10b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e34be0ba10b6) -
  Cleanup show diff experiments
- Updated dependencies

## 8.4.5

### Patch Changes

- Updated dependencies

## 8.4.4

### Patch Changes

- Updated dependencies

## 8.4.3

### Patch Changes

- Updated dependencies

## 8.4.2

### Patch Changes

- [`5789b1638025b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5789b1638025b) -
  EDITOR-6631: If only marks has changed, don't use granular diffing as that won't show any diffs.
- Updated dependencies

## 8.4.1

### Patch Changes

- [`8a9f26c6c71bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a9f26c6c71bc) -
  [ux] Improve diff logic for some nodes and edge cases where marks are causing the diff to fail
- Updated dependencies

## 8.4.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 8.3.10

### Patch Changes

- Updated dependencies

## 8.3.9

### Patch Changes

- Updated dependencies

## 8.3.8

### Patch Changes

- [`932b1625cbf60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/932b1625cbf60) -
  EDITOR-6621: Add a grey background on deleted text in standard diff theme.
- Updated dependencies

## 8.3.7

### Patch Changes

- [`c07f198dda226`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c07f198dda226) -
  NO-ISSUE: Always scroll diff into view even if it's in viewport already
- Updated dependencies

## 8.3.6

### Patch Changes

- Updated dependencies

## 8.3.5

### Patch Changes

- [`d672ff18b0e43`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d672ff18b0e43) -
  Use post-step doc to simplify changes.

## 8.3.4

### Patch Changes

- Updated dependencies

## 8.3.3

### Patch Changes

- Updated dependencies

## 8.3.2

### Patch Changes

- Updated dependencies

## 8.3.1

### Patch Changes

- Updated dependencies

## 8.3.0

### Minor Changes

- [`1b208e1f7d8f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b208e1f7d8f7) -
  [ux] Adds the entry point for ai image generation to the media insert picker plugin as a new tab.
  This feature is fully behind an experiment gate.

### Patch Changes

- Updated dependencies

## 8.2.0

### Minor Changes

- [`439f373a73aa2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/439f373a73aa2) -
  EDITOR-6620: Add an option to scroll the diff into view.

## 8.1.13

### Patch Changes

- Updated dependencies

## 8.1.12

### Patch Changes

- Updated dependencies

## 8.1.11

### Patch Changes

- Updated dependencies

## 8.1.10

### Patch Changes

- Updated dependencies

## 8.1.9

### Patch Changes

- Updated dependencies

## 8.1.8

### Patch Changes

- Updated dependencies

## 8.1.7

### Patch Changes

- Updated dependencies

## 8.1.6

### Patch Changes

- Updated dependencies

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- Updated dependencies

## 8.1.3

### Patch Changes

- [`76faad1c8c7b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76faad1c8c7b5) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` devDependency alias (which resolved to `react-intl@^5`) has
  been renamed to `react-intl`. This is a development-only change with no impact on consumers.

## 8.1.2

### Patch Changes

- Updated dependencies

## 8.1.1

### Patch Changes

- [`b26874dcf4a79`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b26874dcf4a79) -
  Show granular inline diffs when the replace step is for a paragraph.
- Updated dependencies

## 8.1.0

### Minor Changes

- [`c50b6810de5a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c50b6810de5a3) -
  Open expand nodes before scrolling to diff changes within them using `toggleExpandRange` from the
  expand plugin. This is gated behind the `platform_editor_show_diff_open_expands_on_scroll` feature
  flag.

### Patch Changes

- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.4.1

### Patch Changes

- [`d1d3089a12aff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1d3089a12aff) -
  EDITOR-6431: Improve diff styles to support text-like diffs better when inverted.
- Updated dependencies

## 6.4.0

### Minor Changes

- [`7739efec523bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7739efec523bc) -
  EDITOR-6371: Add toggle for showing / hiding deleted changes in the diff.

### Patch Changes

- Updated dependencies

## 6.3.2

### Patch Changes

- Updated dependencies

## 6.3.1

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`5d32941f15d07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d32941f15d07) -
  EDITOR-5949: Change diffing logic to support closest block diffs + preliminary support for row
  diffs.

### Patch Changes

- Updated dependencies

## 6.2.19

### Patch Changes

- Updated dependencies

## 6.2.18

### Patch Changes

- [`fa146e17e08d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa146e17e08d6) -
  Update README.md and 0-intro.tsx

## 6.2.17

### Patch Changes

- [`38f6b2fea945a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38f6b2fea945a) -
  Remove dragAndDropEnabled from test fixtures and audit false usages - prop is being deprecated

## 6.2.16

### Patch Changes

- [`7b7c52dff5d7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b7c52dff5d7d) -
  Fix eslint violations for type import syntax
- Updated dependencies

## 6.2.15

### Patch Changes

- Updated dependencies

## 6.2.14

### Patch Changes

- Updated dependencies

## 6.2.13

### Patch Changes

- Updated dependencies

## 6.2.12

### Patch Changes

- Updated dependencies

## 6.2.11

### Patch Changes

- Updated dependencies

## 6.2.10

### Patch Changes

- Updated dependencies

## 6.2.9

### Patch Changes

- Updated dependencies

## 6.2.8

### Patch Changes

- Updated dependencies

## 6.2.7

### Patch Changes

- Updated dependencies

## 6.2.6

### Patch Changes

- [`164eae4f672d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/164eae4f672d5) -
  Fix a number of issues with the diff flipper
- Updated dependencies

## 6.2.5

### Patch Changes

- Updated dependencies

## 6.2.4

### Patch Changes

- Updated dependencies

## 6.2.3

### Patch Changes

- [`c2b3bd8f1e4cb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2b3bd8f1e4cb) -
  Enforce custom step registers for show diff plugin for consistency.

## 6.2.2

### Patch Changes

- Updated dependencies

## 6.2.1

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`255e764f80182`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255e764f80182) -
  EDITOR-5830: Add support for showing inline vs. block diff types.

### Patch Changes

- Updated dependencies

## 6.1.10

### Patch Changes

- Updated dependencies

## 6.1.9

### Patch Changes

- [`0f4a08b633f6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f4a08b633f6e) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 6.1.8

### Patch Changes

- Updated dependencies

## 6.1.7

### Patch Changes

- Updated dependencies

## 6.1.6

### Patch Changes

- Updated dependencies

## 6.1.5

### Patch Changes

- Updated dependencies

## 6.1.4

### Patch Changes

- [`9df4b10b5f0f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9df4b10b5f0f8) -
  Improve edge cases when showing diff by using a looser equality structure for steps.
- Updated dependencies

## 6.1.3

### Patch Changes

- [`8c860e8e9e774`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c860e8e9e774) -
  Make active decorations more distinct

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`40c53e0b66a8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40c53e0b66a8a) -
  EDITOR-5829: Allow showing inverse of diffs

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- [`8acefc80a7a89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8acefc80a7a89) -
  Fixed initial activeIndex to be undefined instead of 0, preventing auto-selection on diff
  initialization. Also update tests accordingly

## 5.0.9

### Patch Changes

- [`db37927f35395`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db37927f35395) -
  Cleanup platform_editor_ai_aifc_patch_ga_blockers flag.

## 5.0.8

### Patch Changes

- [`e7825d1698274`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7825d1698274) -
  Improve areNodesEqualIgnoreAttrs by adding option ignoreMarkOrder which ensures the order of the
  marks does not result in a "false" which can break some cases of diffs.
- Updated dependencies

## 5.0.7

### Patch Changes

- [`1fd2b267eb592`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fd2b267eb592) -
  Cleanup `platform_editor_ai_aifc_patch_ga` flag
- Updated dependencies

## 5.0.6

### Patch Changes

- [`2e27b70a136ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e27b70a136ed) -
  EDITOR-5632: Further refactors to block / row handling - mainly renaming + param change to object
  param to make it more extensible for future work.
- Updated dependencies

## 5.0.5

### Patch Changes

- [`8865b5e8a708a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8865b5e8a708a) -
  EDITOR-5632: Refactor diff plugin to make functions more generic.
- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [`8bddf4c001143`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8bddf4c001143) -
  Improve scrolling to diffs on the page by focusing before scroll
- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [`b5af20d6e019c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5af20d6e019c) -
  EDITOR-5632: Change colourScheme param to colorScheme for standardisation.

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- [`4031146a0af6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4031146a0af6d) -
  Updating the PR to calculate the correct number of decorations for display.
- Updated dependencies

## 4.1.3

### Patch Changes

- [`ea378cb5c7a31`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea378cb5c7a31) -
  EDITOR-5632: no-op refactors to simplify code
- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`ec61e21a60034`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec61e21a60034) -
  Adds new commands to scroll to each diff change in the UI.

### Patch Changes

- Updated dependencies

## 4.0.15

### Patch Changes

- Updated dependencies

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- [`6911179854bdb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6911179854bdb) -
  Remove diff highlighting if there are overlapping mark steps (ie. add and then remove)
- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- [`bdd272290540a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bdd272290540a) -
  Migrate platform_editor_jan_a11y_fixes flag to platform_editor_enghealth_a11y_jan_fixes
  experiment.
- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [`917bb70243d23`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/917bb70243d23) -
  [ux] [ENGHEALTH-43911] increase visual contrast for deleted text when viewing changes

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.3.3

### Patch Changes

- Updated dependencies

## 3.3.2

### Patch Changes

- [`5c35083992b75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c35083992b75) -
  [EDITOR-3498] Redo + view changes makes browser freeze, fixed bug.

## 3.3.1

### Patch Changes

- [`be40850b186a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be40850b186a8) -
  Rolled up editor AIFC beta gates into the parent streaming gate. Also decoupled the placholder
  from the main AIFC FG by utilising the withEmptyParagraph plugin option, since this prop is only
  set when AIFC is enabled. This means we don't need refs to this gate in the plugin because it's
  already controlled by a prop.
- Updated dependencies

## 3.3.0

### Minor Changes

- [`a36ac8c9961b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a36ac8c9961b1) -
  [ux] [EDITOR-2608] updated show diff deleted block nodes design

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 3.2.7

### Patch Changes

- [`bc52c059565f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc52c059565f2) -
  Fix issue with simplify changes being too aggressive and dropping steps causing diffs to fail.

## 3.2.6

### Patch Changes

- [`05ee61c6ace09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05ee61c6ace09) -
  Improve performance of show diff by increasing merge of steps
- Updated dependencies

## 3.2.5

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- [`657693883946f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/657693883946f) -
  Fix diffs for extension nodes
- Updated dependencies

## 3.2.4

### Patch Changes

- [`0b00861d972cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b00861d972cd) -
  [EDITOR-2668] refactored deleted mediaSingle decorations to maintain alignment/wrap on diff view
- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`1c0d87f570c52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c0d87f570c52) -
  [ux] Update attributes to ignore attr steps that do not affect the document

## 3.2.1

### Patch Changes

- [`da2782d8dc1e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da2782d8dc1e7) -
  Support table row diff displaying in the editor

## 3.2.0

### Minor Changes

- [`68caaf98e8f89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68caaf98e8f89) -
  [ux] [EDITOR-1628] Added "Removed" Lozenge and gray border decorations to deleted block nodes in
  show diff view

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- [`7c8492867be97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c8492867be97) -
  [ux] Add support for media attribute changes in the diff

## 3.1.4

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 3.1.3

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 3.1.2

### Patch Changes

- [`63e63c69cd679`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63e63c69cd679) -
  Add styling for bullet point markers on diff

## 3.1.1

### Patch Changes

- [`174d939cfd1ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/174d939cfd1ba) -
  Use valid positioning for deleted diff content to avoid invalid nesting diffs

## 3.1.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- [`38fb1054b8b7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38fb1054b8b7a) -
  Recover from invalid deletion decorations
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [`16d89ac68ca47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16d89ac68ca47) -
  Improve how large number of small steps are grouped together in the diff.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [`b8555904ec1cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b8555904ec1cc) -
  Add new util for comparing nodes ignoring attributes.
- Updated dependencies

## 2.1.2

### Patch Changes

- [`7bd504ca6f5a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bd504ca6f5a1) -
  Export PMDiffParams type for editor diff plugin for use

## 2.1.1

### Patch Changes

- [`c6b6ef91296ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6b6ef91296ca) -
  [ux] Better support for block nodes for deleted diffs.
- Updated dependencies

## 2.1.0

### Minor Changes

- [`5eadb7f870272`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5eadb7f870272) -
  [ux] Adds a new plugin configuration to adjust the styling scheme for diffs. By default it will
  use standard, but traditional (for green + red) is also available.

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`4144b576f0bf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4144b576f0bf8) -
  Ignore attribute changes when ensuring the steps match the final document
- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`f7c9ea51bb613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7c9ea51bb613) -
  [EDITOR-1395] dnd interferes with diff
- Updated dependencies

## 0.2.0

### Minor Changes

- [`3df4a57528050`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3df4a57528050) -
  Update editor showDiffPlugin to take in params for preset use in Confluence version history.

## 0.1.7

### Patch Changes

- [`06722cb00f629`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06722cb00f629) -
  [EDITOR-1358] Remove extra parameters parased in and refactored initialisation for show-diff
  editorView

## 0.1.6

### Patch Changes

- [`3d9a6a0aae8c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9a6a0aae8c5) -
  Fix show diff not loading inline node diffs on load
- Updated dependencies

## 0.1.5

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 0.1.4

### Patch Changes

- [`1fc9ea612c6ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc9ea612c6ef) -
  [EDITOR-1358] Fix nit + minor local bug

## 0.1.3

### Patch Changes

- [`8700ce859da07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8700ce859da07) -
  [EDITOR-1249] Added inline node support for show diff

## 0.1.2

### Patch Changes

- [`7fe4c9e51271d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fe4c9e51271d) -
  Fix initial show diff after performance fix.
- [`b2d53a70dbaa5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d53a70dbaa5) -
  Improve show diff performance by storing decorations in state.
- Updated dependencies

## 0.1.1

### Patch Changes

- [`941fdc429d140`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/941fdc429d140) -
  Show formatting changes in the diff
- Updated dependencies

## 0.1.0

### Minor Changes

- [`81ec1e909620a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ec1e909620a) -
  [EDITOR-1206] Have `editor-plugin-show-diff` expose if the plugin is displaying the diff.
  Deprecate the state in `editor-plugin-track-changes` as it depends on `editor-plugin-show-diff`
  and it's better to have the state in the plugin that actually shows the diff

## 0.0.3

### Patch Changes

- [`3c2fe6ae106d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c2fe6ae106d8) -
  Focus the editor after track changes is turned off.
- Updated dependencies

## 0.0.2

### Patch Changes

- [`9464a4f29a876`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9464a4f29a876) -
  [EDITOR-1194] Bugfix show diff new line if deleted half way
- Updated dependencies

## 0.0.1

### Patch Changes

- Updated dependencies
