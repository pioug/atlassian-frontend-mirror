# @atlaskit/editor-plugin-autocomplete

## 15.0.0

### Patch Changes

- Updated dependencies

## 14.0.0

### Patch Changes

- Updated dependencies

## 13.0.0

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.0.0

### Patch Changes

- Updated dependencies

## 9.2.1

### Patch Changes

- [`656801b9e097c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/656801b9e097c) -
  VOLTC-331 - Migrate updated package usage in platform/editor: rewrite barrel imports of
  voltCompliant provider packages to deep/subpath imports (consumer-side debarrel). No public API
  changes.
- Updated dependencies

## 9.2.0

### Minor Changes

- [`027dc05ee4e0d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/027dc05ee4e0d) -
  Suggest inline-code identifiers the session has seen, for hosts that opt in with the new
  `harvestInlineCode` plugin option — which Rovo Chat now does.

  A term like `ml-studio` cannot be suggested today whatever the session does with it:
  `incrementSessionFreq` only touches trie nodes that already exist, so a word the shipped
  vocabulary does not hold is silently discarded. The new harvester collects backticked spans from
  ingested reply and page text and code-marked spans from the live document, drops anything with
  internal whitespace, over 50 characters, not starting with a letter, or already served by L2/L3,
  and holds the result to 200 surfaces with the least-mentioned evicted first.

  A harvested surface has no frequency, no vector and no canonical token ids, so what stands in for
  a score is where it is allowed to speak. It is offered only where the scored path has finished and
  recorded that no vocabulary reaches the prefix at all — not when the 100ms budget expires, since
  that means the ranker was still working. It asks for four typed characters rather than three,
  respects the post-accept cooldown and the no-repeat check, and on accept rewrites the typed prefix
  in the surface's own casing and marks it as code, because casing is load-bearing in code and being
  marked as code is what authorized the suggestion. The stored mark is dropped straight after, since
  the backtick input rule never ran and nothing else would close the span. It reports itself as a
  new `harvest` value on `CompletionSource`, so its views and acceptances cannot move the headline
  rate unattributed.

  The harvester is a separate chunk, requested on first focus and only for a host that opted in, so
  a host that has not stays exactly as it was and never downloads it. What it holds is readable at
  any time with `__atlCtcDebug__.harvest()`, or `__atlCtcDebug__.harvest('ml-s')` to ask what a
  prefix would be offered.

  Both the harvested set and the L1 session boosts are now dropped when the session they describe
  ends. A host whose editor does not last as long as what it is writing about can say so with the
  new `contextScopeKey` on the context it returns: when the key changes, both stores are emptied and
  the context reported with the new key is ingested as if it were the first, so anything still
  current is primed again. The key is tracked beside the data it guards rather than per editor,
  because a host may answer a navigation by replacing the editor instead of keeping it — read from a
  new editor alone, every scope looks like the first one, while the previous scope's terms carry on
  in the state they share. Teardown clears both stores as well, once the last editor has gone:
  Confluence mounts several, and closing one reply must not wipe what the others primed.
  `resetSessionBoosts` is exported for the same purpose, and `__atlCtcDebug__.session()` now lists
  100 boosted words rather than 50.

  Because those stores are shared, an editor that reported no scope is put back in the same tick an
  eviction empties them, from the context it is already holding rather than a second read. A comment
  box under a chat panel that switched conversation never asked to lose its page, and without this
  it could not get it back either: the record of what an editor has ingested is per editor, so its
  own page would read as already seen from then on. An editor that did report a scope is left alone,
  since the scope being dropped may be its own — a page transition mounts the editor arriving before
  tearing down the one leaving.

  A context read requested while another is still open is now deferred until that one settles, where
  before it was dropped. A scope change reaches the plugin as a context read, and a host that pushes
  its context has no other channel to raise one on, so a read refused mid-navigation was an eviction
  that never happened.

  On the Rovo Chat side, chat messages now reach autocomplete through `extractCodeAwareTextFromAdf`,
  the same extractor the page already uses. Assistant replies keep their backticks by arriving as
  markdown, but a user's own inline code arrives as ADF and was being flattened by
  `extractPlainTextFromAdf`, which drops the `code` mark — the only thing distinguishing an
  identifier from a word. The L1 boost is unaffected, since its tokenizer strips backticks as
  boundary punctuation. Each context read is stamped with the conversation and the page the body in
  it came from, and the stamp is reported even when there is nothing else to report: arriving at an
  empty new chat is exactly when the previous one's terms most need dropping.

  The page in that stamp is taken from the body rather than from where the host says the reader is,
  and a host that publishes the page it is on has its empty answer read as "no page" rather than as
  no answer. Confluence in-app navigation is why: it clears the page it was holding immediately, but
  the content id the chat reads can lag it by a long way and sometimes never arrives, and a body
  accepted only when the two agree is a page that is never read at all. Attributing a body to the
  page it came from cannot offer one page's text under another's, which is what agreement was being
  required for.

  A body published by an editor is no longer attributed to a page it was already attributed
  elsewhere for. The published document carries no page id, so the page has to come from where the
  reader is, and that is the same answer whether the editor has just published or the store is still
  holding the document from the page before. Two live docs in a row is where it showed: arriving at
  the second turns editor publishing back on and asks again, while the first one's body is the only
  one there is.

  Dropping the boosts when the last editor goes is limited to hosts that scope their context, which
  are the ones asking for their learning to end with the conversation. A host that sends no scope
  has boosts belonging to the page it is on, and a comment box closes far more often than that page
  changes.

  A host that cannot answer a page read now reports it, once per chat input, as an operational
  event. The read still succeeds without a page, which is the right thing for a keystroke to do and
  also the reason the failure is otherwise invisible: the editor's own monitoring only sees reads
  that reject, and the symptom of this one — no page context on viewed pages — looks the same as a
  page with nothing worth learning in it.

  Dropping the session boosts now reads an index of the nodes that were boosted rather than walking
  the whole word trie for them, since it runs on every page change rather than only at teardown:
  about 10ms of main thread on a large tenant vocabulary, twice per navigation, for a few hundred
  words.

  Both the option and the extraction carry the same
  `platform_editor_ai_autocomplete_rovo_chat_editor` decision the rest of the chat's autocomplete
  wiring does. With the experiment off no context is collected and the harvester chunk is never
  requested.

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [`a164c6d8e7de6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a164c6d8e7de6) -
  Offer the Confluence page the chat is open on to autocomplete as context, so words already written
  on it carry an L1 session boost in the chat input. This reads the editor context the page editor
  already publishes, so no host wiring is needed, and covers a page being edited; reaching a page
  that is being viewed needs a host bridge that comes separately. The page text is held together
  with the page it was read from, so navigating invalidates it in the same render that changes the
  page rather than just after — the context store keeps the last published document until another
  publisher replaces it, and that document does not say which page it came from.

  Both the page and the chat transcript sit behind
  `platform_editor_ai_autocomplete_rovo_chat_editor`, and the editor context subscription that reads
  the page lives in a component the chat input only mounts once enrolled. An unenrolled session
  therefore neither parses a page document for context it cannot use nor re-renders the input on a
  publish, which the editor does on blur and on selection change.

  Context text now waits for the vocabulary load to settle before it is applied. Session boosts were
  previously spent against an empty trie whenever the page resolved first, which silently dropped
  every word in it. What the session holds is readable from the console with
  `__atlCtcDebug__.session()`.

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [`94ddcfaca6b5d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94ddcfaca6b5d) -
  Improve client-only contextual typeahead confidence and responsiveness, and extend it to bigram
  and phrase completions.

  All of this ships inside the autocomplete plugin, which is only ever added to a preset behind an
  experiment that defaults to off: `platform_editor_ai_autocomplete_rovo_chat_editor` for Rovo chat,
  with a Confluence `productKey` check ahead of the read, and
  `platform_editor_ai_autocomplete_conf_comments` for Confluence comments. The on-device model path
  these changes concentrate on is additionally behind
  `platform_editor_ai_autocomplete_conf_local_setup`, which selects the slow-lane client. With those
  experiments off the plugin is never constructed, so nothing here runs.

  **Confidence.** Candidates competing at the same word boundary are normalised into a posterior
  over that shortlist, so a suggestion's confidence is the share of probability mass the model puts
  on it rather than its distance from whichever candidate happens to lead. The comparison is made on
  each surface's sequence log-likelihood rather than its per-token mean, which is not comparable
  across surfaces of different token counts. A shortlist is normalised over its minimal members
  only, so a surface and its own extension are no longer double-counted. A surface must additionally
  clear an absolute plausibility floor, anchored at the uniform distribution over the model's
  49,152-token vocabulary (about -10.8 nats) rather than read off a histogram, hold a clear lead
  over the runner-up, and come from a shortlist that offered a real alternative. Completions shorter
  than three characters are no longer offered, and multi-word terms are held to the same
  previous-word grammar transition as single words.

  **Responsiveness.** Candidate work starts at two typed characters while ghost text stays gated at
  three and must arrive within a 100 ms decision window. Queued scoring work is drained in an order
  that keeps the engine's decoded sequence alive, so continuing a prefix costs a single decode step
  instead of a full prompt prefill, and work no live decision would accept is discarded rather than
  run. Contexts keep their prefilled model state until 128 are resident rather than 32, which stops
  contexts being evicted while still in use. Once displayed, a ghost is an immutable snapshot shared
  by rendering, Tab insertion, analytics and cooldown, so a later model result cannot make the
  visible completion disagree with the inserted one.

  **Per-keystroke cost.** One keystroke runs `predict()` several times — once when the decision
  opens and again for each async evidence signal that lands inside the budget — and only the
  evidence differs between those runs. Trie recall and the canonical context derived per candidate
  are computed once and reused across them, invalidated when an artifact load changes what the tries
  can return. Within one derivation the position-dependent half of a candidate's context is shared
  by every candidate starting at the same offset, rather than being rebuilt a couple of hundred
  times. A distribution's log-partition is memoised per logits buffer, since it does not depend on
  the token being scored and the two full-vocabulary passes behind it previously ran once per
  candidate for an answer that could not change. None of this changes which suggestion is chosen.

  **Multi-word completions.** Bigrams and phrases are surfaced from a first-word or in-progress
  window, frequency is normalised per term type, and selection runs a per-type precision floor
  followed by expected-value arbitration, so the longest confident unit wins and a shaky long unit
  self-demotes to a safer shorter one. Phrases surface only once the on-device continuation LM has
  vouched for them. A whole-surface repetition guard and a post-accept cooldown together prevent
  echoes such as `end to end` becoming `end to end to end`.

  **Artifacts.** `bigrams.json`, `phrases.json` and `phrase-continuation-tokens.json` are resolved
  from the artifacts manifest alongside the vocabulary and grammar payloads, so they are served from
  the CDN rather than bundled. Each is fetched independently, so an unpublished payload disables
  only its own term type. Every artifact is shape-checked as it downloads, failing at the boundary
  naming the artifact rather than degrading later into an empty trie.

  **Diagnostics.** Debug output is unified under a single `[CTC]` namespace behind
  `__atlCtcDebug__.enable()`, with one collapsed group per keystroke and an opt-in verbose level for
  the scored candidate table. All informational console output is routed behind the flag.

  **Breaking change.** `@atlaskit/editor-plugin-autocomplete` no longer exposes its pm-plugin
  modules as subpaths. The `./src/pm-plugins/autocomplete-plugin`,
  `./src/pm-plugins/slow-lane-client` and `./src/pm-plugins/text-predictor` entry points are
  removed, along with the `CANONICAL_FIX__DO_NOT_USE_ME_A`, `_B` and `_C` subpaths that exposed the
  same three modules in raw form. The matching `./autocomplete/*` re-export wrappers in
  `@atlaskit/editor-plugins` are removed too. No product consumed any of them; they were reachable
  only from this plugin's own test package and the generated aggregator.

  Removing both sets together is deliberate. The curated subpaths were named after real file paths,
  so each one shadowed the module it wrapped and left two files claiming the same bundler canonical
  id — which is what the `CANONICAL_FIX` subpaths existed to disambiguate. Keeping either set alone
  reintroduces the collision. With both gone, nothing shadows a source path, and because the
  wrappers mirrored the raw modules under an exact export-parity test, `@atlaskit/editor-plugins` is
  no longer coupled to this plugin's internal module layout. `./autocompletePlugin` and
  `./autocompletePluginType` are unaffected.

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [`7a16264359631`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a16264359631) -
  Load autocomplete model artifacts from the CDN instead of bundling them. The vocabulary,
  POS/grammar, word-index and word-vectors payloads are now resolved from GET
  /gateway/api/v1/autocomplete/artifacts, so this endpoint must be reachable for autocomplete to
  produce suggestions. BREAKING: the `getVectorsBinaryUrl` plugin option has been removed — the word
  vectors binary URL now always comes from the artifacts manifest, so hosts must stop serving it
  themselves.

  Rovo chat autocomplete now runs on-device via WebGPU instead of the network slow-lane backend.

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [`51c33ef5349b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51c33ef5349b6) -
  Enable compatibility with React 19.2.0

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [`268f447fd26f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/268f447fd26f4) -
  Fix autocomplete click interactions in the editor

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- [`5cd6c10a9394f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5cd6c10a9394f) -
  Fix autocomplete context extraction when inline formatting inserts leaf nodes before the cursor,
  preventing misaligned ghost-text suggestions that can surface as stray spaces.

## 4.1.2

### Patch Changes

- [`88a1176b97a25`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/88a1176b97a25) -
  Internal TypeScript typecheck fixes for ts7 (tsgo) adoption. No functional or API changes.
- Updated dependencies

## 4.1.1

### Patch Changes

- [`18ab4e3c6ed23`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18ab4e3c6ed23) -
  Include asset files in the published package so they render correctly for consumers.
- [`96ceccb98c3b9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96ceccb98c3b9) -
  Add a `surface` attribute to editor autocomplete analytics and UFO experience metadata, and wire
  it through the plugin lifecycle.

  Host integrations now pass explicit surface values:
  - Confluence comments uses `confluence-comments`
  - Rovo chat uses `rovo-chat`

  This improves cross-surface tracking clarity while keeping surface values consumer-defined.

- Updated dependencies

## 4.1.0

### Minor Changes

- [`2f56c78f969b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f56c78f969b8) -
  Update i18n NPM package versions for teamwork-graph (Group 16)

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- [`041d093c4919a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/041d093c4919a) -
  MDP-15978 fix pm-plugins/data/\* not copied to dist, breaking consumers not on local consumption
- Updated dependencies

## 4.0.6

### Patch Changes

- [`c2986ab2c7a01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2986ab2c7a01) -
  Cleans up prefer static regex violations and enables e18e rule
- Updated dependencies

## 4.0.5

### Patch Changes

- [`73743eb8b36e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73743eb8b36e6) -
  CLeanup prefer static regex violations
- Updated dependencies

## 4.0.4

### Patch Changes

- [`ac12ed0b41ef4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac12ed0b41ef4) -
  Refactor contextual autocomplete wiring so the conversation-store-aware ChatInput owns the
  autocomplete context bridge (getContext + subscribeToContextUpdates) via a new
  useAutocompleteEditorContext hook, and the shared RovoChatPromptInput simply forwards a single
  `autocomplete` prop to the editor preset. Removes the duplicated keying / listener-set plumbing
  from the reusable input.

  Adds an optional `subscribeToContextUpdates` option to the autocomplete plugin so host surfaces
  that stream context after mount (e.g. Rovo chat messages) can push refreshes, complementing the
  existing word-boundary retry that only covers a one-time, still-loading comment thread.

## 4.0.3

### Patch Changes

- [`9869d944172b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9869d944172b6) -
  Instrument the local (LocalLLM) slow-lane client with the existing `slow-lane-fetch` UFO
  experience, tagged with an `isLocalLLM` flag (matching `load-vectors`/`load-vocabulary`) so
  on-device inference latency and success-rate feed the same FE Reliability SLO as the network
  slow-lane fetch. The `isLocalLLM` flag is now also emitted on the abort path of both the local and
  network clients.

## 4.0.2

### Patch Changes

- [`56263a9d5bb6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56263a9d5bb6d) -
  Gate editor autocomplete to English locales so suggestions and model loading are disabled for
  non-English users.

## 4.0.1

### Patch Changes

- [`560ddb7a914f6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/560ddb7a914f6) -
  [ux] Fixes a bug where autocomplete suggestions were shown when the cursor was positioned in the
  middle of an existing word. Suggestions are now suppressed unless the cursor is at the trailing
  edge of a token.
- Updated dependencies

## 4.0.0

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

- [`f92001e22291e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f92001e22291e) -
  Reverts the mid-word cursor suppression for ghost-text suggestions. Autocomplete suggestions will
  again appear regardless of cursor position within a word.
- Updated dependencies

## 3.6.2

### Patch Changes

- [`8ed22a585196f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ed22a585196f) -
  [ux] Fixes a bug where autocomplete suggestions were shown when the cursor was positioned in the
  middle of an existing word. Suggestions are now suppressed unless the cursor is at the trailing
  edge of a token.
- Updated dependencies

## 3.6.1

### Patch Changes

- [`2d57d65205edd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d57d65205edd) -
  [ASIMO] Add `isLocalLLM` attribute to `load-vectors` and `load-vocabulary` UFO experiences.

  Both experiences now include an `isLocalLLM: boolean` attribute on every event (start, succeed,
  fail) so analysts can segment loading performance and reliability by whether the user is on the
  local on-device model setup vs the standard network-based slow-lane backend.

## 3.6.0

### Minor Changes

- [`9f6b6c9fffc50`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9f6b6c9fffc50) -
  Add analytics for the on-device (local LLM) autocomplete slow lane: fire a `localModelLoaded`
  track event when the engine initialises successfully (with load duration and GPU info) and a
  `localModelLoadFailed` track event when it fails, categorising the reason and capturing WebGPU
  capability diagnostics to surface user-machine limitations.

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [`52c7f5f973025`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52c7f5f973025) -
  Switch the CTC autocomplete debug toggle off `localStorage` and onto a storage-free mechanism.
  Debug logging is now enabled via the `__atlCtcDebug__.enable()` / `.disable()` console API for the
  current session, or by appending `?atlCtcDebug=1` to the URL to have it active from initial load
  (and survive reloads). This avoids browser-storage consent controls (BSC) that can block
  uncategorized `localStorage` writes in some products. The `isAutocompleteDebugEnabled()` API is
  unchanged for callers.

## 3.4.1

### Patch Changes

- [`4129a00a1ae04`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4129a00a1ae04) -
  Add `completionSource` attribute to contextual typeahead analytics events to distinguish between
  cold (frequency-only), server slow-lane, and on-device local LLM scoring paths
- Updated dependencies

## 3.4.0

### Minor Changes

- [`b6fb60030b3b9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b6fb60030b3b9) -
  Improve local autocomplete scheduling latency

## 3.3.0

### Minor Changes

- [`4c8cf60a51e1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c8cf60a51e1d) -
  Fix local slow lane client declaration builds

## 3.2.0

### Minor Changes

- [`3fb8d945f6f22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fb8d945f6f22) -
  Update local only client setup for contextual typeahead completion to use Snowflake embedding
  model

## 3.1.0

### Minor Changes

- [`f003833231999`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f003833231999) -
  Code-split the autocomplete vocabulary, L3 word list and word-index JSON via dynamic import so
  they load on autocomplete initialisation instead of being bundled into the editor's main chunk.

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- [`a87ba03d22d27`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a87ba03d22d27) -
  Fix typecheck
- Updated dependencies

## 2.5.1

### Patch Changes

- [`80694949c0036`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80694949c0036) -
  Fixing typecheck errors
- Updated dependencies

## 2.5.0

### Minor Changes

- [`09fd1de566937`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09fd1de566937) -
  Add UFO experience tracking to `@atlaskit/editor-plugin-autocomplete` for the asynchronous
  operations that have meaningful latency and success/failure outcomes — slow-lane fetch, vocabulary
  load, and vectors load. Experiences surface downstream as
  `platform.fe.operation.editor-plugin-autocomplete.<name>`.

  Per-keystroke suggestion lifecycle counters (view, insert, dismiss) are tracked exclusively via
  analytics-next instead of UFO, to avoid emitting zero-duration events on every word boundary. A
  new `suggestionDismissed` contextual-typeahead analytics event is added
  (`@atlaskit/editor-common`) alongside the existing `suggestionViewed` / `suggestionInserted`
  events, with a `reason: 'escape' | 'blur'` attribute.

### Patch Changes

- [`60d4bf83adcbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60d4bf83adcbc) -
  Wrap risky imperative paths (PM tree mutations, debounced prediction timer, async
  vocabulary/vectors/context loads) with try/catch + logException so failures surface in Sentry and
  the editor never silently dies on a malformed prediction or stale state. Follows the convention
  used by editor-plugin-block-controls, editor-plugin-paste-options-toolbar, editor-plugin-emoji,
  etc.
- [`43e460948b5c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43e460948b5c6) -
  Fix LocalSlowLaneClient: remove dead `void engineUnloadPromise` no-op, add WebGPU pre-flight check
  before model load, prevent infinite init retries with a permanent-failure flag, call `onUpdate` on
  inference error to maintain consistent notification contract, and add `.catch` handler to suppress
  unhandled promise rejections in `doUpdateContext`.
- Updated dependencies

## 2.4.0

### Minor Changes

- [`ce30a31e6369d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce30a31e6369d) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [`975a31aae73f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/975a31aae73f4) -
  Add KSS attributes to contextual typeahead acceptance analytics

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`6eb5747f5ba37`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6eb5747f5ba37) -
  Add SAR analytics for autocomplete plugin

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`6b36a63af0057`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b36a63af0057) -
  Updated scoring math for contextual typeahead autocomplete

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`603cd44e7b8c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/603cd44e7b8c3) -
  Fetch vectors through media client

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`87965237565b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87965237565b6) -
  [ux] Add autocomplete plugin to inline comment editor behind
  `platform_editor_ai_autocomplete_conf_comments` experiment

## 0.2.0

### Minor Changes

- [`d214555fc7540`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d214555fc7540) -
  Add editor plugin for AI-powered inline autocomplete
