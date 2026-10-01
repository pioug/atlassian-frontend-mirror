# Forcing `platform-dst-top-layer-tooltip` on in tests — status report

> What the branch does, what CI says, the six clusters that kept it red, and how each was resolved.
> Written as a handover: a new agent should be able to pick up from here without re-running the
> triage.

## Status

**In flight.** PR
[476958](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/476958), branch
`areardon/top-layer-tooltip-force-on-in-tests`. The branch has been rebased since the CI runs below,
so commits are named by subject here; the hashes in the run headings are the ones CI saw. In order:
"Force platform-dst-top-layer-tooltip on in tests", two "Fix … test-harness breakages" commits, this
report, "Move role=tooltip off the Popover host" (cluster 1), "Resolve the remaining tooltip gate-on
test clusters" (clusters 2–5), "Fix CI fallout from the tooltip gate-on clusters commit", and the
copied-popup lifetime follow-up (2026-09-23, see cluster 3).

The branch flips `platform-dst-top-layer-tooltip` from force-**off** to force-**on** across the
monorepo's test baselines, so CI exercises the native `popover="hint"` path before rollout. Most
source changes are test harness. Three components also change: click feedback moves from a tooltip
content swap to a click-triggered popup that stays until dismissed, in docs-ui `Copy` (ungated,
private package) and in jira `servicedesk/insight-common-cmdb-shared-copy-button` and
`assets-app/field-copy-text` (behind `platform-dst-top-layer-tooltip` via `componentWithFG`). See
cluster 3. Jira's shared Storybook `preview.ts` is deliberately left alone: a
`setBooleanFeatureFlagResolver` bridge to jira's `fg` looks like a one-liner, but in Storybook `fg`
is aliased to jira's gate mock, which falls back to `defaultValueForAllFeatures()` — so every story
or integration test running `enableFeatureFlags: true` would flip _all_ `@atlaskit/*` flags on. It
would not survive anyway: `withFeatureFlagsGlobal` overwrites the resolver global on the first story
that uses the flag knobs and never restores it. `STORYBOOK_ENABLE_PLATFORM_FF=true` is the supported
all-on switch, and `overrideFeatureFlags` already reaches platform code.

| Product        | Change                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **platform**   | New `build/configs/jest-config/jest-top-layer-tooltip-flag-setup.js` wraps the boolean flag resolver so the gate reads `true` in all Platform unit tests. Registered in `index.js`.  |
| **jira**       | Gate moved from `configureYetDisabledFlags` to `configureFullyRolledOutFlags`. Added `@atlaskit/top-layer/testing/polyfill` (setupFiles) and `.../testing/to-be-visible` (afterEnv). |
| **confluence** | `e2e_statsig_gates.json` → `true`. `safeMergeObjects` preserves truthy values, so the upkeep pipeline will not revert it.                                                            |
| per-test       | Gate removed from force-off mocks in `eoc/alert-list`, `jira/color-picker` (×4), `jira/timeline-table`, `company-hub/hub-home` (×2), `ai-mate/conversation-assistant`.               |

Deliberately **not** touched: tests that cover the gate-off branch on purpose
(`editor-plugin-table-tests/FloatingContextualButtonStyles`,
`editor-common-tests/UnsupportedContent`, `jira/polaris/HeaderTrigger`, tooltip's own
`[true, false]` VR matrices); Gemini VR defaults (turning the gate on there rewrites thousands of
baseline PNGs); and products with no gate baseline at all (mercury, townsquare, store, kitsune,
insights — they resolve _every_ platform gate to false, and they consume `@atlaskit/top-layer` from
npm so they cannot get the jsdom polyfill until a release ships).

## What CI says

Only **unit tests** fail. Lint, oxlint, stylelint, typecheck, ratcheting, boundary files, changeset
validation, Git LFS, Gemini VR, informational VR, integration and every build step are green.

| Pipeline    | Product  | Result                                 |
| ----------- | -------- | -------------------------------------- |
| `#22315164` | platform | 12 of 17 shards red, 84 failing suites |
| `#22315155` | jira     | 10 of 12 slices red, 10 failing suites |

Parent-step logs 404; child-pipeline logs read fine. One manual "Integration tests (Firefox +
WebKit)" gate has never started, so there is nothing to triage there.

**Platform went 60 → 84 failing suites between commits. That is test selection, not regression** —
the later run executed 15,876 suite results against the earlier run's 9,062.

### Run for `969c0c2cb2601` (Clusters 2–5 commit), 2026-09-21

| Pipeline    | Product             | Result                                                                                                                                                                 |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#22364012` | platform            | Only **Ratcheting** red. Unit, Gemini VR, informational VR, integration, typecheck, lint green                                                                         |
| `#22364016` | jira                | **Unit tests** red (9 suites: 8 tooltip, 1 unclassified; + 1 SIGBUS) and **Run Small Jobs** red (oxlint)                                                               |
| `#22364385` | taro-pr-change-demo | Manual demo pipeline, not a required status. Its browser check never found the docs "Copy code" button, which only renders when `navigator.clipboard.writeText` exists |

Everything below was fixed in the loop's first iteration; nothing needed a decision.

- **Platform ratcheting.** Two diff-mode increases, both from the new files: the three new tests
  imported `@atlassian/testing-library` from its root barrel (now `/act`, `/render`, `/screen`,
  `/user-event`), and the docs-ui VR fixture imported `@atlaskit/primitives/compiled` (fully
  deprecated; now `/compiled/box`) and carried `@atlaskit/button/new` inside a string literal the
  scanner also matches.
- **Jira oxlint.** `no-nested-ternary` in the popup branch of `FieldCopyTextStateless.tsx`;
  rewritten as `if`/`else if`. Reproduced locally with oxlint 1.80 extracted from the yarn cache
  (`jira/node_modules` ships 1.75 and rejects the config).
- **Jira unit tests, ours.** Press-then-expect (Cluster 3, now unhover → hover with the standard
  comment): `NonEditableReasonTooltipWrapper`, `notification-toggle` (also polls for the Escape
  hide), `WorkItemSelector`, `WorkItemFilter`, `SchemaListTable` Sorting ×2 (click sort, then hover
  the same header). **aria-hidden ancestor** (same class as Cluster 4a; the inline host inherits it
  where the portal escaped): `CanMoveToSelection`, filters `Avatar`, now `{ hidden: true }`.
  **Settlement** (Cluster 2 class): atlassian-intelligence `Feedback` used
  `waitForElementToBeRemoved` after `unhover`, which throws when the top-layer path has already
  removed the node; now polls with `waitFor`.
- **Unclassified, left alone.** `sidebar-nav4-sidebars-content-projects-more-projects`
  `ProjectsSearch.test.tsx` (×12 incl. ff variants): "Unable to find role group" / missing
  empty-state text. Neither the test nor its content components reference Tooltip, and no tooltip
  host appears in the failure DOM, so it is not ours on the evidence available; it did not appear in
  the previous run's list either (different test selection). Confirm on the next run. Slice 1 also
  lost `agent-picker/AgentPickerOptions` to a SIGBUS worker crash (inherited signature).

### Run for `08dfde9b54085` (iteration 1 fix-up), 2026-09-21

| Pipeline    | Product             | Result                                                                                                                                                           |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#22368068` | platform            | **Green.** Ratcheting, unit, Gemini VR, informational VR, integration, typecheck, lint all pass                                                                  |
| `#22368072` | jira                | **Unit tests** red (slice 3 only); VR, Playwright, build, code style, ratcheting, Run Small Jobs (oxlint), typecheck green                                       |
| others      | 13 other products   | Green (confluence, townsquare, store, kitsune, adminhub, help-center, studio, volt, jsm-lite, dev-agents, avp, post-office, rovo-extension)                      |
| `#22368308` | taro-pr-change-demo | Manual demo pipeline, not a required status; all 8 checks errored at preflight ("Demo Package unavailable", iframe locator timeout), so nothing reached the page |

Nothing in this run is ours. Every iteration-1 fix held: the eight jira suites and both new jira
suites (`FieldCopyText`, `StyledButton`) passed; the cmdb `CopyButton` suite was not in this run's
affected set (167 files) but passed in the previous one.

- **Jira slice 3, first attempt: SIGBUS.** `ActionCategory.test.tsx` lost its worker
  (`signal=SIGBUS`, exit 151). Inherited infra signature; the flake manager retried the slice and
  all 14 suites passed.
- **Jira slice 3, retry: "unit-test log-noise ratchet" ×3.** jira's `noisyTestReporter` injects a
  synthetic failed test into any suite that printed log lines (`CollapsibleImportCard` 22,
  `IssueLayout` 20, `software/board … view/test.tsx` 20). **This is a side effect of the SIGBUS
  retry, not our diff.** Evidence: (1) the previous run flagged three _different_ suites
  (`FieldsEditor`, `CommentBaseComment`, `useMarketPlaceDialog`), which passed clean in this run,
  while this run's three passed clean in the previous run; (2) in both runs the noisy ranking
  appears only in the slice that had the SIGBUS crash and retry, and the other 22 slices report zero
  noise; (3) `software/board … view/test.tsx` has no tooltip, hover or focus interaction at all. The
  reporter attributes output with no async context to "whichever suite is active", so ~20 lines of
  worker-level output from the crashed/retried run land on arbitrary suites. Master never enforces
  this ratchet (`BITBUCKET_BRANCH === 'master'` returns early), so only branch builds see it. Fix
  belongs to jira test infra (SIGBUS crash rate and retry/attribution), not to tests.
- **`ProjectsSearch` (sidebar-nav4 more-projects), from the previous run: inherited, gate-
  independent.** Not selected in this run. Its failure DOM shows only the search field: no result
  groups and no empty-state message, so the search results never arrive. The component and test
  reference only nav4 gates (`platform_dst_nav4_flyout_menu_slots_close_button`,
  `project_term_refresh_ga`) and `expVal('project-terminology-refresh')`, no Tooltip, popover,
  dialog or drag-and-drop; the jsdom popover polyfill tracks state via `data-popover-open` and
  injects no styles, so it cannot hide a `group` role. Classify inherited if it reappears.

The gate flip itself adds no log noise: with the gate forced on, 11 of 12 jira slices report zero
per-suite log lines. Platform has no equivalent reporter, so it cannot be compared.

## Fixed and verified (do not redo)

Five harness breakages, all confirmed `PASS` in CI:

1. **The setup file initialised the feature-gate singleton.** Requiring the real
   `@atlaskit/platform-feature-flags` in `beforeAll` pulls in `@atlaskit/feature-gate-js-client` →
   `NoFetchDataAdapter extends DataAdapterCore`, which throws at module scope in any suite that
   mocks `@statsig/js-client`. Fixed by loading `fg` lazily inside the fallback branch in a
   try/catch, plus a `testPath` guard skipping `platform/feature-flags`,
   `platform/feature-flags-test-utils` and `measurement/feature-gate-js-client`. This is the exact
   hazard `jest-editor-flags-setup.js` warns about; it escapes it by only installing a resolver for
   editor paths.
2. **The setup file captured the PFF global too early**, so its restore line would have thrown for
   any suite starting with no global. The global is now read inside the resolver.
3. **`jira/.../live-chat-common/tests/MessageBubble.test.tsx`** — local `jest.mock('raf-schd')`
   returned a bare function. Real `rafSchedule` returns one carrying `cancel`, which top-layer calls
   on popover unmount.
4. **`platform/services/rovo-widget-service/.../fg.test.ts`** — teardown restored a property onto
   `global.window` after the "window is not available" test had deleted it. It only took that branch
   once our resolver installed the PFF global, making the saved value truthy.
5. **`jira/.../backlog-card-list/.../use-draggable-divider/test.tsx`** — the jsdom popover polyfill
   makes pdnd's `supportsPopover()` (`pragmatic-drag-and-drop/core/src/util/supports-popover.ts`)
   return `true`, so `setCustomNativeDragPreview`'s container renders `popover="manual"` +
   `data-popover-open` + the popover reset styles, as it does in a real browser. Snapshot updated.

Two previously-suspected problems **now pass** and need no work:
`top-layer/__tests__/unit/unmount-when-hidden.test.tsx` ("remounts a fresh host element on reopen")
and pdnd's three `global-event-binding.spec.ts` suites.

## Ours vs inherited — method, so you do not repeat it

The branch merge-base is **~1121 commits behind the last green master**
(`./bin/ag branch --hash-only --verbose`). A large share of the red is not ours.

**The A/B method that settled it:** unregister `jest-top-layer-tooltip-flag-setup.js` from
`build/configs/jest-config/index.js`, run the suite, re-register, run again, then confirm `git diff`
on `index.js` is empty. A suite that fails **identically both ways** is inherited.

Across two rounds, **36 suites were A/B'd and 36 came back inherited.** Confirmed inherited
signatures — classify, do not fix:

`findDOMNode is not a function` · `ReactDOM.render is not a function` · "React Element from an older
version of React" · `react-dom-next` hydration mismatches (page-layout, dynamic-table, select) ·
`useId` shape drift (`_r_0_`) · `toHaveBeenLastCalledWith` second-argument arity drift
(store-install-dialog) · React 19 no longer routing uncaught render errors through `console.error`
(store-feature-gate, pdnd error-handling) · `toHaveAttribute('inert')` null (React 19 boolean
serialization) · `fireEvent.change` with no value not firing `onChange` · axe
`aria-valid-attr-value` on `aria-activedescendant` · a `techstack` block leaking into a generated
package.json template · `api.malleableUi` undefined · jest worker OOM · SIGBUS · changesets-v2
version assertions · jira "unit-test log-noise ratchet" synthetic failures in the slice that had a
SIGBUS retry (arbitrary suites, ~20 lines each; zero noise elsewhere) · jira `ProjectsSearch` search
results never render (no Tooltip involvement).

`ai-mate/conversation-assistant/.../confluence-object-finalize-popup` is red in CI but passes
locally with the gate on (59/60) — CI-only or flaky, not ours.

**Jira initially had no inherited category.** All 10 of its first-run failures were tooltip-related,
which was itself good evidence the gate flip is the discriminator. Later runs added two inherited
ones (SIGBUS-retry log-noise ratchet, `ProjectsSearch`), see the per-run sections above.

## The six clusters that kept it red

All resolved on this branch. Cluster 1 is the "Move role=tooltip off the Popover host" commit.
Cluster 2 turned out to be jsdom-only and was fixed in tests. Cluster 3 is decided (keep the latch):
tests are updated and the three components that used the tooltip for click feedback moved to a
status popup. Cluster 4(a) was a test artefact and is fixed. Cluster 4(b) is decided: accepted as a
transient violation, see
[`tooltip-inside-composite-roles.md`](./decisions/tooltip-inside-composite-roles.md). Cluster 5 was
closed by the cluster 1 fix and verified at HEAD.

### 1. The DOM split, and a duplicate `role="tooltip"` — ~35 failures — **fixed on this branch**

**Update: the role is back on the host.** A later change puts `role="tooltip"` on the `Popover` host
again, as `Popover`'s role contract expects, and fixes both original problems another way:

- **DOM split.** The host mirrors `data-placement` (a callback ref sets it on attach and on each
  placement change), so `getByRole('tooltip')` results still carry the placement and the text.
- **Duplicate role.** An internal `DefaultRoleContext` makes `TooltipPrimitive` default to
  `role="presentation"` under the host, so a `component` wrapper that drops `role` no longer adds a
  second `role="tooltip"`. An explicit `role` prop still wins. The primitive resets the context
  around its children, so a `TooltipPrimitive` inside `content` keeps `role="tooltip"`. Nothing
  provides the context on the legacy path, so its DOM is unchanged.

With the role on the host, cluster 5's `aria-tooltip-name` can return: a visible host with
`role="tooltip"` and no visible text. Two changes cover it. `Container` now always gets a ref, so a
wrapper that does `if (ref == null) return null` renders its text instead of leaving the host empty.
`HiddenTooltip` in search-dialog (`display: none` content under a visible host) gets a consumer fix.
The text below records the earlier "no role on host" fix.

**Fix applied** ("Move role=tooltip off the Popover host" commit). `TopLayerTooltipPopup` no longer
passes `role="tooltip"` to the `Popover` and no longer passes `role="presentation"` to the
container. `TooltipPrimitive`'s existing `'tooltip'` default puts the role back on the node that
carries `data-placement`, `class="Tooltip"` and the text, which is the legacy DOM. `Popover`'s
`role` is optional, tooltip is not in its `POPUP_ROLES` set, and `shouldFocusIntoPopover` returns
`false` for `undefined`, so nothing in top-layer changes. Verified locally: `StatGridView` (the
duplicate-role case) and `elements/reactions` (a `data-placement` case) pass, and
`tooltip-top-layer.test.tsx` now asserts the role sits on the content node and that a `component`
wrapper that drops `role` yields exactly one `role="tooltip"`. None of the red that remained after
this fix was role-related; cluster 2 below has the current, per-test classification of what is still
failing in `tooltip.test.tsx`.

**Why not default `TooltipPrimitive`'s `role` to `'presentation'`, as first suggested below?** The
legacy render at `tooltip.tsx:723` passes no `role`, so it relies on the `'tooltip'` default. Eight
`component` wrappers destructure named props without spreading (`StatCardTooltip`, `TenureBar`, two
`ProfileTenure/ToolTipContent`s, `GraphChromeControls`, polaris `PermissionsIcon` and
`FieldConfigurationPreview`, plus volt codegen). With a `'presentation'` default they would ship a
tooltip with no role in production today, gate off. Removing the role from the host has no such
cost.

The original diagnosis follows for the record.

The top-layer path moved `role="tooltip"` up to the Popover host (`tooltip.tsx:870`) and left
`data-placement`, `class="Tooltip"` and the text two levels below it:

```
<div popover="hint" role="tooltip">            <- Popover host
  <div data-testid="…--wrapper">               <- TooltipPrimitive outer div
    <div role="presentation" class="Tooltip" data-placement="bottom">text</div>
  </div>
</div>
```

Legacy put the role, `data-placement` and the text on one node. So every
`toHaveAttribute('data-placement', …)` on a `getByRole('tooltip')` result now returns `null`, and
every text query scoped with `selector: '[role="tooltip"]'` misses. Note that
[`test-ids.md`](./architecture/test-ids.md) tells consumers to **prefer role + name in tests** —
this is the contract that guidance rests on.

Putting the role on the popover element is defensible. Splitting it from the attributes and text
that identify the tooltip is a **public DOM contract break with no migration path.** Either move
`data-placement` up to the host alongside the role, or leave the role on the content node.

**Separately, a genuine bug.** `TooltipPrimitive`'s `role` prop defaults to `'tooltip'`
(`tooltip-primitive.tsx:48`). The composition avoids a duplicate role only because `tooltip.tsx:893`
explicitly passes `role="presentation"`. The public `component` prop is documented as "Extend
`TooltipPrimitive` to create your own tooltip" — and any custom component predating the `role` prop
drops it, so the default applies and the page gets **two** `role="tooltip"` nodes.
`getByRole('tooltip')` then throws "Found multiple elements". The first suggested fix was a
`'presentation'` default; that was rejected for the reason given above, and the role came off the
host instead.

Seen in: editor-core `ToolbarButton` + `ToolbarHelp`, link-datasource `issue-like-table`,
`jira/animated-toggle-buttons`, `elements/reactions/ReactionTooltip`, ai-mate `SharedChatsContent`,
twg-microsite `StatGridView` (the duplicate-role case), tooltip's own `tooltip.test.tsx` (×10) and
`nested-tooltip.test.tsx`, plus nine jira suites (notification-toggle, WorkItemFilter,
ViewPermissionDropdown, atlassian-intelligence Feedback, request-types IssueType, workflow-readonly
CanMoveToSelection, NonEditableReasonTooltipWrapper, two `ConditionalTooltip` suites).

Also see the unresolved TODO at `tooltip.tsx:658-663`, which asks why `role="presentation"` is added
at all — and the `-- top-layer spike` lint suppressions at 883 and 885. This part of the file says
of itself that it is not finished.

### 2. Exit never settles without animations — **jsdom only, fixed on this branch with a test helper**

**The mechanism first written here was wrong.** Exit does settle with zero animations.
`runOnAnimationsSettled` (`top-layer/src/internal/use-animated-visibility.tsx:40-48`) does
`Promise.allSettled(animations.map((a) => a.finished)).then(settle)`, and `Promise.allSettled([])`
resolves, so settlement is one native promise microtask. `animations.md` documents exactly this
("settles in a microtask"). There is no production defect and browsers are unaffected.

**What actually fails.** The jsdom polyfill fires the closed `toggle` as a task
(`testing/polyfill.tsx`, `setTimeout(0)`). The failing suites then flush it with a synchronous
`act(() => jest.runOnlyPendingTimers())` and assert immediately. Jest fake timers drain
`queueMicrotask` (which the non-animated path uses at `:343-346`) but not native promise jobs, so
`settleExit` runs after the assertions, outside `act`. That is why top-layer's own non-animated
tests pass with the same sync pattern and the animated tooltip path does not.

**Fix considered and rejected.** Swapping the empty-list case to `queueMicrotask(settle)` would make
the tests pass with no browser change, but it edits production code to fix a jsdom-only problem.
Rejected on that basis.

**Fix applied.** A test helper, not a production change. `flushPopoverExit()` from
`@atlaskit/top-layer/testing/flush-popover-exit` runs the pending fake timers and yields once inside
an async `act`. `@atlaskit/tooltip/testing` re-exports it as `waitForTooltipToHide()` so tooltip
consumers do not need to know about top-layer. Tests that asserted straight after the sync flush now
`await waitForTooltipToHide()` instead: tooltip's `analytics.test.tsx`, `nested-tooltip.test.tsx`,
six tests in `tooltip.test.tsx` (unhover, focus loss, Escape, default and configurable hide delay,
hide analytics), and `overflow-tooltip-wrapper`. Both new entrypoints have unit coverage, including
a test that pins the sync-`act` gap so the helper can be retired if the environment ever changes.
`charlie-table/src/ui/overflow-tooltip-wrapper.test.tsx` was already green and was not touched.

**`tooltip.test.tsx` is now fully green (41 tests).** The four tests that stayed red after the
helper migration were never cluster 2 in the sense the helper fixes, and were resolved as follows
(user decision, 2026-09-21). Gate state is set imperatively with `passGate` / `failGate` from
`@atlassian/feature-flags-test-utils/mock-gates`, which override the branch's global force-on
resolver per test:

- `should be visible after trigger is clicked` was split in two. The legacy assertion runs under
  `failGate` and also checks that no `tooltip--popover` host exists, which proves the gate-off
  cohort really took the Popper path. A new top-layer test under `passGate` encodes the decided
  contract from [`tooltip-pointer-dismissal.md`](./decisions/tooltip-pointer-dismissal.md): hidden
  after a pointer press, still hidden while the pointer rests, shown again after the pointer leaves
  and re-enters.
- `should abort hiding if there is a mouseover while animating out` is legacy-only (`failGate`).
  With no animations to observe, the top-layer path settles its exit before the pointer can return,
  so jsdom has no exiting window to re-hover into. The real-browser equivalent lives in the
  top-layer Playwright suites.
- `should have strategy as fixed by default` and `should have strategy as absolute for popper` are
  legacy-only (`failGate`). They assert Popper's inline styles (`position: absolute`, `left: 0px`,
  `top: 0px`) on `tooltip--wrapper`; the top-layer path positions with CSS Anchor Positioning and
  never sets them.

**Jira.** Jira consumes `@atlaskit/top-layer` via `workspace:*`, so the new entrypoint is available
to jira tests on this branch already; the two migrated jira copy-button suites under cluster 3
import `@atlaskit/top-layer/testing/flush-popover-exit` directly. No other jira suite in the CI list
carried the cluster 2 signature. Confirm on the next CI run.

### 3. Pointer dismiss and the copy-button pattern — **decided: keep the latch; tests updated, three components moved to a status popup**

**Correction to an earlier read of this:** the behaviour matches the recorded decision. See
[`tooltip-pointer-dismissal.md`](./decisions/tooltip-pointer-dismissal.md) — "once a press has
happened, the tooltip does not show again until the trigger is re-entered" is the intended contract,
and `isTopLayerPointerDismissedRef` (`tooltip.tsx:245`, checked at 277) implements it as designed.

What the decision did **not** cover is the consumer that changes the tooltip's content in response
to the click. "Click copy → tooltip swaps to 'Copied!'" shows nothing while the pointer rests on the
button. Legacy stayed visible and re-rendered.

**Decision (2026-09-21): keep the latch.** A content-change carve-out was prototyped and rejected:
`content` is a `ReactNode`, inline JSX changes identity every render, so the carve-out would re-show
on unrelated re-renders and reopen the stale-tooltip hole. The decision note now has a "Content
changes after a press" section with the reasoning and the recommended consumer pattern (a
click-triggered status popup anchored to the trigger, with a persistent visually-hidden
`role="status"` region carrying the announcement).

**Tests updated on this branch** to encode the contract — `unhover()` then `hover()` after the
click, with a comment pointing at the decision note: `search-common/copy-path-button` (×3),
smart-card `copy-link-action` (×2) and `ai-summary-action` (×1), ai-audio `AudioShareLinkButton`
(×2), generative-ai-modal `copyButton` (×1), `build/website/docs/.../heading.test.tsx` (×2). All
green locally.

> **Superseded 2026-09-28.** The popup described below is gone. The docs-ui `Copy`, jira
> `FieldCopyText` and cmdb `CopyButton` now swap the tooltip content, as on master, and set
> `hasNewContentOnTriggerClick`. The popup tests and the `copy-action.vr.tsx` suite were deleted.
> See [`tooltip-stay-open-on-trigger-click.md`](./decisions/tooltip-stay-open-on-trigger-click.md).

**Component change:** `design-system-docs-ui/.../actions/copy.tsx`. Its `Copy` component started
with `content={null}`, set "Copied!" only after the click, and reset the message to `null` in
`onMouseEnter`. Under the contract the re-entry that would clear the latch also cleared the message,
so the feedback was unreachable by pointer. Resolved by dropping the tooltip for feedback: after the
click it opens a roleless top-layer `Popover` anchored below the button and announces through a
persistent visually-hidden `role="status"` region. An earlier revision used `role="status"` on the
popup itself with `mode="manual"` and a two-second timer; it was aligned to the jira pattern below
on 2026-09-23. Its unit tests cover the popup by test id and the live region by role, and an
informational VR suite (`src/example/__tests__/informational-vr-tests/copy-action.vr.tsx`) clicks
the button and snapshots the success and failure popups.

**Jira components migrated behind the gate (CI-verified only; jira cannot run in this worktree).**
The two jira suites in the CI list were `servicedesk/insight-common-cmdb-shared-copy-button`
(`CopyButton`) and `assets-app/field-copy-text` (`FieldCopyText`); an earlier draft of this report
called the second one "insight `CopyButton`", which does not exist. Both branch on
`fg('platform-dst-top-layer-tooltip')` inside the component: the gate-on path keeps the hover
tooltip on its label, opens a roleless `Popover` anchored below the trigger (`TooltipContainer`
surface), and carries the announcement in a persistent visually-hidden `role="status"` region.
`FieldCopyText` splits at `FieldCopyTextStateless`. Tests keep the old tooltip-swap assertions under
`failGate` and add a `passGate` cohort.

An earlier revision of both used
`componentWithFG('platform-dst-top-layer-tooltip', WithStatusPopover, WithTooltip)`, with the
gate-on body in its own file as a near-copy of the gate-off one. That was replaced on 2026-09-24
because the copy buried the actual change: for these two the diff is a handful of hooks and one
swapped surface, and the copies had to duplicate a props type, a `cssMap` object and two
`defineMessage` descriptors that lint rules forbid exporting. The gate-on state (`isPopupOpen`,
`lastStatus`) is only ever set on the gate-on side, so most reads need no gate check.
`jira/ff/inline-usage` forbids aliasing `fg(...)` to a variable, so each branch calls it at the
callsite. `design-system-docs-ui`'s `copy.tsx` kept `componentWithFG`: its two paths are separate
state machines with almost no shared body.

**UNMIGRATED, and a rollout hazard (corrected 2026-09-24).** An earlier revision of this report
claimed `jira/src/packages/platform/field-copy-text` was "an older duplicate of `FieldCopyText` that
nothing imports". That is false. Its package name is
`@atlassian/jira-common-components-field-copy-text`, not `@jira/platform__field-copy-text`, which is
why a path-shaped grep misses it: it is declared in 19 `package.json` files and imported from 17
non-test source files, including `issue/permalink-button`, `global-pages/dashboard-common`'s
copy-link button, `business/list`'s issue-key cell, `platform/copy-text-field`, and nine servicedesk
packages. `src/ExportedComponent.tsx:125-174` is exactly the pattern the gate breaks - the same two
message ids as `assets-app/field-copy-text`, and the same
`content={<span aria-live="assertive">{actualTooltipLabel}</span>}` swap - and the package contains
no `platform-dst-top-layer-tooltip` check at all. Gate on, every one of those buttons loses both its
"Copied!" feedback and its announcement, because the tooltip closes on the press and the live region
lives inside the tooltip content. This needs a migration before the gate rolls out.

**Popup lifetime (decided 2026-09-23, after the CI runs above; superseded 2026-09-28, see above).**
The first cut closed the popup on a timer (2s) or when the parent cleared `copied`. It now stays
until dismissed: `mode="auto"`, so Escape or a press outside closes it and nothing else does; every
press remounts the popover (`key`) so a press while open re-opens instead of racing the native light
dismiss; the trigger tooltip gets `canAppear={() => !isOpen}`. Reasoning, rejected options and the
staleness it accepts are in [`copied-popup-lifetime.md`](./decisions/copied-popup-lifetime.md). All
three consumers follow it. Per consumer, the gate-on tests cover: stays open after unhover and 60s
(all three) and after blur (cmdb `CopyButton`); Escape closes and press outside closes (all three);
re-press yields a fresh open element (all three); the tooltip is held back while the popup is open
(both jira consumers); the live region clears after 5s (`CopyButton`, docs-ui; `FieldCopyText`
follows its parent's 3s reset instead); docs-ui also pins that the message stays while the popup
animates out. "Anchor scrolls out of a clip" is accepted, not tested. Jira's tests for this revision
have not yet been through CI.

### 4. Inline rendering inherits the trigger's subtree — (a) test artefact, fixed; (b) accepted as a transient violation

Rendering inline rather than through a portal is correct for the Popover API. But the tooltip now
inherits everything about the trigger's position in the tree:

- **(a) Hidden ancestors hide it — test artefact, fixed on this branch.** In ai-mate
  `studio-agent-browse/Header.test.tsx` the compact button sits inside `<Show below="sm">`, which is
  `display: none` outside its media query, and jsdom never evaluates `@media`. The suite itself
  asserts that button is `not.toBeVisible()`, then hovered it and expected a visible tooltip. In a
  real browser a `display: none` ancestor removes the trigger and its inline popover from rendering,
  so the product is correct at every viewport; only the legacy body portal ever made the test pass.
  Fixed with `findByRole('tooltip', { hidden: true })` and a comment. Not a label assertion:
  `tooltip.content` is a separate prop that can override `label`.
- **(b) Illegal ARIA parents — accepted as a transient violation, decided 2026-09-21.**
  `[role=tooltip]` is not a permitted child of `role="menu"` (editor floating-toolbar
  `DropdownMenu`) or `role="tablist"` (rovo-link-picker `TabStrip`), so axe raises
  `aria-required-children` while the tooltip is open. Research showed ARIA 1.2 has no author MUST
  here, Chromium and Gecko skip the node for counts, the native hint model that would hide the
  bubble is unstandardised, and the alternative (`aria-hidden` on the bubble) costs a monorepo-wide
  `getByRole('tooltip', { hidden: true })` codemod. No portal, no tooltip change. Full evidence,
  options and revisit triggers in
  [`tooltip-inside-composite-roles.md`](./decisions/tooltip-inside-composite-roles.md). On this
  branch the rule is exempted per file in `platform/a11y-exemptions-accounting.json` for the two
  suites above. The note also proposes a harness-level exemption to the accessibility team so
  consumers do not each need an entry.

### 5. axe `aria-tooltip-name` — **closed by the `Container` ref and a search-dialog fix**

> The role is back on the host (see the update under cluster 1), so the pre-fix DOM below applies
> again. The `Container` ref and a search-dialog consumer fix address it instead.

Fired on `<div popover="hint" role="tooltip" data-popover-open="">` in product-search-dialog (×6,
the six `__tests__/analytics-integration-tests/jira/*` suites) and charlie-table, via the global
`jest-auto-a11y-setup.js` afterEach. That quoted markup is the **pre-fix DOM**.

**Root cause.** `search-dialog/src/search-input/search-input.tsx` passes `component={HiddenTooltip}`
while the input is expanded, and `HiddenTooltip` is `styled(TooltipPrimitive)({ display: 'none' })`:
the consumer hides its tooltip on purpose. Pre-fix, `role="tooltip"` sat on the visible Popover host
while all of its text lived under that `display: none` descendant, so axe's `has-visible-text` saw a
visible tooltip with no name. With the role on the primitive itself, the node is `display: none`,
axe excludes it, and the rule never runs, as under legacy. This is why it was "not minimally
reproducible": the trigger was a consumer-supplied hidden `component`, not tooltip or top-layer.

**Verified with the role on the host:** `charlie-table` whole package `Tests: 235 passed`, and the
`product-search-dialog/__tests__/analytics-integration-tests/jira` suites
`Tests: 22 passed, 6 skipped`, with zero `aria-tooltip-name`. Without the search-dialog fix those
six suites fail 20 tests on the rule. (The earlier "role on the primitive" approach also passed; its
numbers were `1687 passed` for `product-search-dialog` and `235 passed` for `charlie-table`.)

### 6. Closed

`top-layer/__tests__/unit/unmount-when-hidden.test.tsx` was failing when this triage started and now
passes. Nothing to do.

## Suggested order of work

1. **Cluster 1 — done** ("Move role=tooltip off the Popover host" commit). One change, not the two
   first proposed: take `role="tooltip"` off the `Popover` host and drop the `role="presentation"`
   override on the container, so `TooltipPrimitive`'s default puts the role on the content node.
   Should clear ~35 failures across platform and jira without touching a single consumer test.
   Confirm in CI on the next push. **Superseded:** the role is back on the host, with a mirrored
   `data-placement` and a context default of `role="presentation"`. See the update under cluster 1.
2. **Cluster 2 — done.** jsdom-only; fixed with the `waitForTooltipToHide()` / `flushPopoverExit()`
   test helpers, no production change. Jira already has the entrypoint via `workspace:*`.
3. **Cluster 3 — done.** Keep the latch.
   [`tooltip-pointer-dismissal.md`](./decisions/tooltip-pointer-dismissal.md) amended; seven
   platform consumer suites updated with `unhover()`/`hover()`; docs-ui `Copy`, jira cmdb
   `CopyButton` and jira `FieldCopyText` moved to the status-popup pattern (jira behind the gate,
   CI-verified only), then to the stays-until-dismissed lifetime in
   [`copied-popup-lifetime.md`](./decisions/copied-popup-lifetime.md).
4. **Cluster 4 — done.** (a) hidden ancestor — test artefact, fixed. (b) decided: no portal, no
   tooltip change; accepted as a transient violation and exempted per file. See
   [`tooltip-inside-composite-roles.md`](./decisions/tooltip-inside-composite-roles.md), including
   the proposal to the accessibility team for a harness-level exemption.
5. **Cluster 5 — closed.** Verified at HEAD; root cause recorded above.

Rebasing onto a green master first would remove ~36 suites of unrelated red and make the remaining
signal much easier to read.

## Gotchas for whoever picks this up

- **Prettier:** use `node node_modules/prettier/bin/prettier.cjs` from the repo root.
  `node_modules/.bin/prettier` is 2.8.8 and reformats unrelated code.
- **Sandbox:** `git` and `node` fail inside it (`index.lock: Operation not permitted`, OpenSSL
  config errors). Run them outside.
- `afm lint --staged` must run from `platform/`, not the repo root.
- A sandboxed `node` run can exit 0 having run **zero** tests. Always confirm a real
  `Tests: N passed` line.
- **Jira cannot be tested locally in a fresh worktree** — its `node_modules` is stale
  (`Cannot find module '@jira-dev/jest-compiled-mock/...'`), and the pre-commit hook skips its
  checks for the same reason. CI is the first real check for any jira edit.
- `afm ts generate` rewrites unrelated tsconfigs on a stale base. Revert anything it touches that
  your change did not require.
- Any change under `platform/packages/ai-mate` needs a changeset or the pre-commit hook blocks the
  commit — even a test-only change.
- `jest-top-layer-tooltip-flag-setup.js:74` appears ~66 times in the platform log, always inside a
  `console.warn` stack for "Client must be initialized before using this method". That is the same
  code path `resolveBooleanFlag` takes when the setup file is absent. Pre-existing noise; no test
  fails on it.
