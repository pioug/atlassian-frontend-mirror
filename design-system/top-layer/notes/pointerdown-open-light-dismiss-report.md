# Opening a popover during a pointer gesture — light-dismiss investigation

**Date:** 2026-08-12 **Trigger:**
[Confluence page-tree popup: Safari and top-layer investigation](https://hello.atlassian.net/wiki/spaces/~63ff0a61f00d095406f28492/pages/7543697787)
(CONFCLOUD report against the Confluence page-tree more-actions popup)

**Method:** five browser probes driving real (trusted) mouse gestures at native `[popover]` elements
via Playwright 1.57 — **chromium 143.0.7499.4**, **webkit 26.0**, **firefox 144.0.2** — plus a
repo-wide consumer audit and an AFM-level jsdom reproduction attempt. The probe scripts were scratch
and are not checked in; each section below names the probe and states the shape it drove, so they
can be rebuilt from the report alone. **Every result below was identical in all three engines** — no
engine-specific behaviour was found anywhere in this investigation.

---

## Summary

The reported bug is **real, spec-mandated, and reproduces in all three engines**. But the
investigation-page framing is incomplete in a way that matters: what looks like one bug is **two
orthogonal defects**, and the fix the page recommends only addresses one of them.

| #   | Defect                                                                                                                | Fixed by                  | Not fixed by              |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------- |
| 1   | **Opening gesture** — a popover shown during `pointerdown` is dismissed on the matching `pointerup`                   | deferral to `pointerup`   | `showPopover({ source })` |
| 2   | **Portaled-child nesting** — showing a child popover whose trigger sits inside a parent popover evicts the **parent** | `showPopover({ source })` | deferral                  |

Probes X6 and X7 isolate them: deferral alone leaves the parent evicted; `source` alone leaves the
child dismissed. Only both together produce correct behaviour (X5/X5b/X5c).

**Three headline findings:**

1. **The pointerup deferral works, and for a robust reason** — not a race. Native light-dismiss for
   a given `pointerup` is evaluated **before** userland `pointerup` listeners run, so by the time a
   deferred `showPopover()` fires, the gesture's dismissal has already been evaluated and consumed.
   This was the load-bearing unknown; it is now measured, and it retires the concern that
   `Select.openMenuAfterPointerUp` rests on listener-registration luck.
2. **Defect 2 is the real reason `mode="manual"` was chosen** — and `showPopover({ source })` fixes
   it directly, in all three engines, while keeping `popover="auto"`. This is the path to taking
   react-select and datetime-picker **off** manual, which is what the manual-mode concern asks for.
3. **`manual` costs four measured native behaviours** (§5). The concern about losing native stacking
   and light dismiss is correct and now quantified — including one hazard nobody had written down:
   **clicking inside a manual popover dismisses unrelated `auto` popovers**, and a manual child of
   an `auto` parent is left in an **orphaned open-but-invisible state**.

**Recommendation (§7):** deferral in the adapters that can host it, `source` plumbed through
`Popover`, `auto` kept everywhere. Do **not** adopt `manual` more widely, and do not make the
`popovertarget` attribute the primary mechanism.

---

## 1. Root cause, corrected

The investigation page's mechanism is slightly wrong in a way that matters for designing a fix. The
page says light-dismiss "records the pointer-down target before the popover exists and dismisses on
the matching pointerup if that target is not in the popover's ancestor chain."

What the spec actually does
([light dismiss](https://html.spec.whatwg.org/multipage/popover.html#light-dismiss-open-popovers)):

1. On `pointerdown`, **step 5 returns early if no auto popover is open.** Nothing is recorded —
   `document`'s popover pointerdown target stays `null`.
2. On `pointerup`, `ancestor` = topmost clicked popover for the target = `null` (the trigger is
   outside the popover and is not an invoker).
3. `sameTarget` is therefore `null === null` → **true** → `hide all popovers until null` → the
   popover that was just opened is hidden.

So the popover is dismissed because **nothing was recorded** and the trigger is outside it, not
because a recorded outside target lost a comparison. Consequence for design: the spec's drag
exception cannot save you, and userland "was the dismiss caused by my own opening gesture?"
reconciliation cannot distinguish this case by comparing targets, because the browser had no target
either.

`src/testing/polyfill.tsx:414-420` already models this early return faithfully.

### Ordering: light-dismiss runs before userland `pointerup` listeners

From probe 1, scenario 1 (`light-dismiss-probe.js`), chromium — identical in webkit/firefox:

```
1. SCRIPT-MARKER mode=auto
2. doc:pointerdown(capture) open=false
3. beforetoggle:closed->open:cancelable      <- our showPopover() in the mousedown handler
4. showPopover() from mousedown
5. beforetoggle:open->closed:NOT-cancelable  <- light-dismiss, BEFORE any pointerup listener
6. doc:pointerup(capture) open=false
7. doc:click(capture) open=false
```

Step 5 preceding step 6 is the whole ball game: a capture-phase `pointerup` listener cannot be
beaten by light-dismiss, because light-dismiss for that event has already happened. It also confirms
`beforetoggle` is **not cancellable** on the close transition, as `popover.tsx:158-168` documents —
so a `preventDefault()`-based fix is impossible.

---

## 2. Defect 1 — the opening gesture

`light-dismiss-probe.js`. "Survives" = popover still open after a complete `mousedown` → `pointerup`
→ `click` gesture.

| Strategy for opening                                              | Survives? | Notes                                                             |
| ----------------------------------------------------------------- | :-------: | ----------------------------------------------------------------- |
| Synchronously in `mousedown`                                      |    ❌     | the reported bug                                                  |
| Synchronously in `mousedown` + `preventDefault`/`stopPropagation` |    ❌     | suppressing the event does not suppress light-dismiss             |
| Deferred to document `pointerup` (**capture**)                    |    ✅     | the `openMenuAfterPointerUp` shape                                |
| Deferred to document `pointerup` (bubble)                         |    ✅     | phase is irrelevant — light-dismiss precedes both                 |
| Deferred to document `click`                                      |    ✅     | the mitigation already tested by the investigation author         |
| In the trigger's own `click` handler                              |    ✅     | simplest baseline                                                 |
| Deferred to `requestAnimationFrame`                               |    ❌     | **a frame can land between down and up**                          |
| Deferred to `setTimeout(0)`                                       |    ❌     | same                                                              |
| `popovertarget` attribute, default `action="toggle"`              |    ❌     | survives pointerup, then **native toggle** closes it at `click`   |
| `popovertarget` + `popovertargetaction="show"`                    |    ✅     | but see §4 — it fights controlled state                           |
| Re-show in a microtask after the dismiss (reconcile)              |    ✅     | genuinely hidden across pointerup→click→microtask (visible flash) |
| `mode="manual"`                                                   |    ✅     | opts out of the algorithm — see §5                                |
| `showPopover({ source: trigger })`                                |    ❌     | `source` does **not** protect the gesture                         |

**The rAF/`setTimeout` rows are the practical trap.** A "just defer it a tick" fix looks equivalent
and is not: the deferral must be keyed to the **gesture** (`pointerup`), not to time.

---

## 3. Defect 2 — portaled-child nesting

`nesting-probe.js` and `source-probe.js`. Shape: parent `#a` is `popover="auto"`; a button
**inside** `#a` opens child `#b`, which is a DOM sibling of `#a` (portaled to `<body>`) — the
react-select / datetime-picker shape, and also "a Select inside a Popup".

| Setup                                                    | Result                    | Reading                                               |
| -------------------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| N1. child `auto`, imperative `showPopover()`             | parent **closed**         | the spec cannot see the relationship → parent evicted |
| N2. child `auto` + `popovertarget` attr, imperative show | parent **closed**         | the attribute does **not** establish the chain        |
| N6. child `auto`, purely **declarative** invocation      | parent open, child open   | declarative invocation does establish it              |
| N5. child `auto` + `showPopover({ source })`             | parent open, child open   | **`source` repairs the chain**                        |
| N5c. …then click in parent, outside child                | parent open, child closed | correct nested dismissal                              |
| N5d. …then click outside everything                      | both closed               | whole chain dismisses                                 |
| N3. child `manual`                                       | parent open, child open   | what manual buys — and why it was chosen              |

This is decisive for the manual-mode question. `menu-portal-top-layer.tsx:115-118` justifies manual
because "the combobox trigger lives in a separate DOM subtree that the spec algorithm cannot see."
**That is exactly what `showPopover({ source })` fixes.** The stated reason for manual no longer
holds.

Two caveats measured, not assumed:

- **`source` is a JS option, so there is no button-only restriction** (contrast the `popovertarget`
  attribute, probe 2/E: on a `<div>` trigger the attribute is inert and the bug returns).
- **Older engines ignore the options bag silently** — no throw. `source` therefore degrades to
  today's behaviour rather than breaking. **Unverified:** the minimum engine versions. I measured
  chromium 143 / webkit 26 / firefox 144 only; the support floor must be checked against Atlaskit's
  matrix before shipping (§10).

---

## 4. The `popovertarget` attribute: viable but not preferable

`combination-probe.js`, X1–X3. The attribute **does** confer light-dismiss protection on the trigger
(the "topmost clicked popover" lookup is attribute-based), so it fixes defect 1 natively with no
document listener. But it drags native activation behaviour along:

- default `action="toggle"` → the native toggle closes the popover at `click`, after surviving
  `pointerup` (probe 1/9).
- `action="show"` → the native show **re-opens** the popover right after JS hides it, leaving
  `popover-open=true` while React state says closed (probe 3/T2 — a measured desync).
- Neutralising it with `preventDefault()` on the trigger's `click` works completely (X1 open
  survives, X2 outside-click still dismisses, X3 JS toggle-to-close works, state stays in sync).

So it is viable **only** with a `preventDefault` guard, and it remains button-only. Additionally:

> **Measured:** neither the `popovertarget` attribute nor `source` reflects `aria-expanded` on the
> trigger in any of the three engines (`combination-probe.js` a11y section: `aria-expanded` is
> `null`, `ariaSnapshot` is `- button "invoker"`). This **contradicts**
> `follow-ups/popovertarget-exploration.md:50-52`, which lists "Implicit `aria-expanded` and
> `aria-details` wiring" as a benefit. Explicit ARIA wiring must be kept.

---

## 5. What `mode="manual"` actually costs

The concern that manual sacrifices native stacking and light dismiss is **correct**. Measured
(`manual-vs-auto-probe.js`) and cross-checked against shipped consumers:

| Native behaviour                         | `auto` | `manual` | Evidence                                           |
| ---------------------------------------- | :----: | :------: | -------------------------------------------------- |
| Light dismiss on outside click           |   ✅   |    ❌    | probe F: popover stays open after clicking outside |
| Escape to close                          |   ✅   |    ❌    | probe G: still open after Escape                   |
| Auto-stack mutual exclusion              |   ✅   |    ❌    | probe H: manual + auto both open simultaneously    |
| Nested-chain dismissal of a child        |   ✅   |    ❌    | probes K vs L, below                               |
| Top-layer promotion, paint order         |   ✅   |    ✅    | last-shown-on-top holds for manual too             |
| `beforetoggle`/`toggle`, `:popover-open` |   ✅   |    ✅    | mode-independent                                   |

Two hazards that were **not** documented anywhere and that a reviewer would not predict:

**(a) Clicking inside a `manual` popover dismisses the `auto` popover underneath it.** Probe N3b:
with an `auto` parent open and a `manual` child opened from a trigger inside it (N3, both open), a
single click on a button **inside the manual child** closes the parent. Because a manual popover is
not in the auto stack, `hide all popovers until <manual>` finds no stopping point and hides
everything else. Any composition of "manual layer over auto layer" — e.g. a Select menu opened from
inside a Popup, which is common in AFM — is exposed. Probe N3c is the same story via the keyboard:
Escape closes the `auto` parent and leaves the manual child open and parentless.

**(b) A `manual` child of an `auto` parent is orphaned when the parent hides.** Probe K: after
`parent.hidePopover()`, the manual child still reports `:popover-open === true` while its bounding
box is `0×0` — open per the API, invisible on screen, and **no `beforetoggle`/`toggle` fires**, so
React state never learns. Probe L (auto child) closes properly with an event. This is a state-desync
bug generator, not just a visual one.

The consumer audit adds three more, from shipped code:

- Because manual establishes no close watcher, **Escape inside a modal `<dialog>` closes the dialog
  instead of the popover**.
- Both datetime-picker menus register as `popup` layers with a **no-op close**, so `closeLayers()`
  cannot dismiss them.
- Spotlight hand-rolls dismissal via `useSimpleLightDismiss`, which is explicitly stack-unaware.

Each manual consumer re-implements dismissal itself and lands in a different place: react-select via
its Escape case plus input blur, datetime-picker via blur (focus-based, not pointer-based).

---

## 6. Blast radius

Repo-wide audit: 195 candidate files (importing a top-layer-backed layer package **and** containing
`onMouseDown`/`onPointerDown`) across every product root that exists — jira 78, platform 64,
confluence 19, mercury 14, post-office 6, avp 6, others ≤3.

**4 affected sites in 3 files; 2 uncertain.** The radius is small because most pointer-down handlers
on layer triggers only `preventDefault`/`stopPropagation`, preload data, set a pressed flag, start a
drag, or _close_ a layer — and because react-select already ships its own deferral.

| Site                                                                                               | Verdict      | Note                                                                             |
| -------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `confluence/next/packages/content-quick-actions/src/ContentQuickActions.tsx:354-361,468`           | AFFECTED     | the reported bug; `preventDefault` on line 356 does not help                     |
| `jira/…/list-view/base-table/fields-dropdown/dropdown/index.tsx:182` (handler 101-115)             | AFFECTED     | `onMouseDown={toggleMenu}`; no `onClick`, so nothing masks it                    |
| `jira/…/fields-dropdown/dropdown/index.tsx:217`                                                    | AFFECTED     | second wiring; `onClick` is a _different_ callback, so it fails outright         |
| `avp/packages/controls/src/text_input/text_input_control.tsx:153` (handler 115-117)                | AFFECTED     | **new find**; on touch/pen where mouseenter and mousedown coincide               |
| `confluence/next/packages/template-gallery/src/TemplateActions/ActionsMenu.tsx:110-111`            | UNCERTAIN    | same handler on `onClick` **and** `onMouseDown`; outcome hinges on task ordering |
| `platform/packages/company-hub/dynamic-cards-search-page/src/common/ui/context-menu/index.tsx:109` | UNCERTAIN    | opens a Popup from a DropdownItem's mousedown while closing the dropdown         |
| `jira/…/horizontal-nav-add-tab/src/ui/AddTab.tsx:81-83,124-125`                                    | NOT affected | mousedown only records input modality; opens on click (useful negative control)  |

The two UNCERTAIN sites both depend on whether React flushes a state update before `click` — they
need manual verification in a browser, not more static reading.

---

## 7. Recommendation

Ranked, and deliberately different from the investigation page's ordering.

**1. Keep `popover="auto"` everywhere. Fix the two defects separately.** They have different causes
and different fixes; a single mechanism that appears to fix both (`manual`) does so by opting out of
the behaviour we migrated to native popovers to get.

**2. Defect 1 — deferral, in the adapters that can host it.** Use `pointerup`, not `click` (fires
even when click activation is cancelled or propagation is stopped, uniform across input types), and
**never** rAF/`setTimeout`. Per the adapter audit:

- **Trivially feasible, no standing listener needed** — `dropdown-menu`, `avatar-group`,
  `popup-select` own both the trigger ref _and_ the activating handler, so they can branch on the
  event type directly.
- **Feasible, needs a gesture source** — classic `Popup` (`triggerRef`, `popup-top-layer.tsx:116`;
  trigger and `Popover` rendered together at 302-303), compositional `Popup` (`triggerRefObject`,
  `compositional/popup.tsx:56`, read via context in `popup-content-top-layer.tsx:166`), and
  `inline-dialog` (`triggerRef`, `inline-dialog.tsx:83`). Each is the sole hand-off into
  `Popover.isOpen`, so each can gate it. **One module-scope** `pointerdown`/`pointerup` tracker
  satisfies the page's open question 2 — no per-instance document listener. Gate the `isOpen`
  forwarded to `Popover`, leaving consumer state untouched; replace any pending deferral on a new
  pointerdown; clean up on close and unmount.
- **Infeasible** — `popper`, react-select's menu portal, both datetime-picker menus, `spotlight`,
  `flag`: no controlled open transition and/or currently `manual`.
- `Popover` itself has no trigger prop and cannot self-heal — the primitive is the wrong home, which
  is the one structural point the investigation page gets right.

**3. Defect 2 — plumb `source` through `Popover`.** Let adapters pass the trigger/anchor element so
the internal `showPopover()` becomes `showPopover({ source })`. This is what unlocks taking
react-select and datetime-picker back to `auto`, and it is a progressive enhancement: engines
without support ignore it.

**4. Treat `mode="manual"` as a defect to pay down, not a pattern to extend.** Every current manual
consumer is a candidate for `auto` + `source`. Re-check each against §5(a) and §5(b) first.

**5. Keep `popovertarget` as an opt-in for simple declarative triggers only** — button-only,
requires a `preventDefault` guard, and buys no a11y wiring (§4).

**6. Do not move the `onClose` bridge to `beforetoggle`.** `popover.tsx:347` binds the **async**
`toggle` event, and that asynchrony is load-bearing: probes T1/T4 show trigger-click-to-close works
today _because_ the queued `toggle` lands after the consumer's `click` handler. Bridging from the
synchronous `beforetoggle` would make every controlled toggle re-open itself.

---

## 8. Testing: the bug cannot be reproduced in jsdom

I attempted an AFM-level reproduction with the real `Popup` (flag on, trigger opening from
`onMouseDown`, `fireEvent.mouseDown` + `mouseUp` + `click`). **It does not reproduce**, and the test
passes green while asserting nothing:

- jsdom in the popup package's env **does** provide `showPopover` (`typeof === 'function'`) and
  `:popover-open` matches after the mousedown — so the popover really opens.
- But **light-dismiss is not implemented** (it needs trusted pointer input): the popup stays open
  and `onClose` is called **0 times**. The legacy path behaves identically, so the two paths are
  indistinguishable in jsdom.
- Worse, a naive assertion is vacuous either way: a popover's children are in the DOM whether it is
  open or closed, so `queryByTestId('content')` is truthy in both states.

**`src/testing/polyfill.tsx` — which does implement the two-phase algorithm faithfully — is exported
at `package.json:55` but imported nowhere in the monorepo.** It is dormant. The comment at
`__tests__/unit/dialog-hydration.test.tsx:4-6` claiming it "is loaded globally for this package's
unit tests" is stale.

So: **the regression test must be a Playwright spec.** Two options for jsdom coverage, in preference
order: wire the polyfill into the packages that need it (it already models the early return and the
ordering correctly — this investigation confirms its model matches real engines), or accept
browser-only coverage for dismissal behaviour, consistent with `rules/testing.md`.

Ready to run (from `platform/`, not the package dir):

```bash
afm run test:integration packages/design-system/popup/src/__tests__/playwright/mousedown-open-light-dismiss.spec.tsx
# Playwright flags after `--`:  -- --grep="stays open" --workers=1 --retries=0
```

Wiring notes: `@af/integration-testing` is the only import; the gate is forced via the **4th**
argument to `visitExample`; `exampleId` is the filename cut at the first `.` with a `^\d{0,3}-`
prefix stripped; `.vr.ap.tsx` is VR-only naming, so a Playwright-only fixture is a plain `.tsx`; the
flag-on popup surface is `${testId}--content`. Popup declares no `additionalBrowsers`, so this is
`desktop-chromium` only. **Legacy survives the gesture** (`use-close-manager` keys off the `click`
target, which is the trigger), so a flag-parameterised spec passes legacy and fails top-layer —
exactly the shape `rules/testing.md:81-94` asks for. Assert geometry/state, never a CSS declaration.

---

## 9. Documentation to correct

The investigation page's recommendation leans on two react-select precedents. **Both are stale**,
and the page inherited the error from our own notes.

| Location                                        | Claim                                                                        | Reality                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-select/src/select.tsx:1220-1234`         | "On the top-layer path the menu is a `popover="auto"` element"               | `menu-portal-top-layer.tsx:131` renders `mode="manual"`. Manual popovers are never in `openAutoStack`, so light-dismiss cannot fire for react-select at all. **`openMenuAfterPointerUp` and `mode="manual"` landed in the same commit `642a4ddbce9f49`** — the rationale was never accurate. |
| `follow-ups/popovertarget-exploration.md:5-22`  | react-select keeps its menu open via `useDismissTarget` + swallow-and-reshow | `useDismissTarget` exists nowhere in `design-system`; `showPopover` appears nowhere in `react-select/src`; `handlePopoverClose` (`menu-portal-top-layer.tsx:88-92`) only forwards to `closeSelect`. Its `popovertarget` premise is sound; its description of shipped code is fiction.        |
| `follow-ups/popovertarget-exploration.md:50-52` | `popovertarget` gives implicit `aria-expanded`/`aria-details`                | Measured `null` in all three engines (§4).                                                                                                                                                                                                                                                   |
| `popover.tsx:170-179`                           | points consumers at `Select.openMenuAfterPointerUp`                          | Points at a **private** method whose premise never held. The mechanism is right (§2) but the citation should be the shared utility once it exists.                                                                                                                                           |
| `__tests__/unit/dialog-hydration.test.tsx:4-6`  | the polyfill "is loaded globally for this package's unit tests"              | Imported nowhere (§8).                                                                                                                                                                                                                                                                       |
| six further comments (per audit)                | describe the mechanism as a bubbling `click`                                 | It is a two-phase pointerdown/pointerup algorithm in the dispatch machinery, not a bubbling click.                                                                                                                                                                                           |
| `top-layer/src/popover/types.tsx:156-157`       | `manual` is "only appropriate for persistent UI (e.g. flags, banners)"       | Contradicted by shipped code: react-select and both datetime-picker menus are `manual` and are none of those. Also `types.tsx:146` points at the `Popup` compound, deleted per `decisions/delete-popup-compound.md`.                                                                         |

The hazard itself is documented **nowhere** in the notes tree. This report is intended to be that
entry; `architecture/positioning.md` and `rules/testing.md` should link to it.

---

## 10. What I did not verify

- **The engine support floor for `showPopover({ source })`.** Measured working in chromium 143 /
  webkit 26 / firefox 144; older versions ignore the option (graceful degradation, no throw), but
  the minimum versions must be checked against Atlaskit's support matrix. This is the one gating
  unknown for §7.3.
- **`source` against the real AFM components.** All `source` evidence is from raw-popover probes.
- **The two UNCERTAIN consumer sites** (§6) — both need a browser, not more reading.
- **`mode="hint"`** — untouched by this investigation. Covered separately since: hints do
  participate in light dismiss, and `@atlaskit/tooltip` now treats a press on the trigger as a
  dismissal rather than reconciling it away. See
  [decisions/tooltip-pointer-dismissal.md](./decisions/tooltip-pointer-dismissal.md).
- **Animation/focus behaviour of the reconcile option.** Probe 11 shows it ends up open, and that
  the popover is genuinely hidden across pointerup → click → microtask, but I did not measure the
  visual flash or what it does to `useInitialFocus`/`@starting-style`. Not needed if §7 is adopted.
