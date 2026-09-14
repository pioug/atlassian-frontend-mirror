# Pre-work: should `[data-focus-guard]` be an `of S` term?

**Closed question:** do `react-focus-lock` focus-guard sentinel elements actually occupy a
positional slot among **consumer-authored** content — a slot a positional selector like
`& > *:last-child` would count — such that `[data-focus-guard]` must join the guard's `of S` term
list?

**Why this document exists.** Pre-work #9
([`of-list-and-ratchet-interaction.md`](./of-list-and-ratchet-interaction.md), claim 6 and open
question 7) settled the list at seven terms but explicitly **escalated `[data-focus-guard]` to a
human rather than silently including it**, on the grounds that it is a _rendered_ element and a
third-party attribute. This resolves that escalation.

**The bar.** The guard currently reads
`:not(:where([popover], dialog, style, script, template, link, noscript))`. §0.2 requires it emitted
**literally at every site**, never interpolated, so once ~2,600 sites carry it, adding a term is a
second sweep over ~1,000 files. Terms are permanent in practice. The bar is therefore **evidence,
not plausibility** — and, per §0.2, a term earns its place by making the codemod restore _pre-flag_
positional counting, not by changing behaviour the flag does not touch.

**Method.** Library reading in `node_modules` (v2.11.0, the version every DS package resolves, and
v2.13.6 via `react-focus-lock-next`); source reading for AFM call sites; and an **empirical jsdom
render** of `FocusLock` in five prop configurations across both installed versions, asserting on the
real child list and on what `#id > *:last-child` / `:nth-child(n)` actually select. jsdom is
sufficient here and was chosen deliberately: this is DOM _structure_, not `of S` matching (which
jsdom cannot evaluate — see pre-work #9).

**No source files were edited.** Scratch harnesses were written outside the repo
(`scratchpad/guard-dom.cjs`, `scratchpad/guard-dom2.cjs`, not checked in).

---

## Findings

| #   | Question                                                | Finding                                                                                                                                                                                                                                                                                                   | Evidence (`file:line`)                                                                                                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | Where are guards rendered?                              | **As siblings of `FocusLock`'s own container — not of its children.** The fragment is `[guard-first, (guard-nearest), SideCar, Container, guard-last]`, and `children` live _inside_ `Container` (default `as='div'`). This is the single most load-bearing fact and pre-work #9 stated it imprecisely.   | `node_modules/react-focus-lock/dist/es2015/Lock.js:125` (fragment), `:127-131` (`guard-first`), `:132-136` (`guard-nearest`, only when `hasPositiveIndices`), `:151-159` (`Container` wraps `children`), `:159-163` (`guard-last`)                                                                                                          |
| 1b  | How many guards, and can they be turned off?            | 2 by default; 3 with `hasPositiveIndices`; 1 with `noFocusGuards="tail"`; **0 with `noFocusGuards`**. `disabled` does **not** remove them — it only flips `tabIndex` to `-1`, so a disabled lock still emits 2 positional slots.                                                                          | `Lock.js:114-115` (`hasLeadingGuards`/`hasTailingGuards`), `:130`/`:161` (`tabIndex: disabled ? -1 : 0`)                                                                                                                                                                                                                                    |
| 1c  | Are guards also inserted at `document.body` level?      | **No.** Empirically 0 body-level guards in both versions. `focus-lock` contains **zero** `createElement`/`appendChild`/`insertBefore` calls. `Trap.js`'s `autoGuard` is not DOM insertion — it only mutates `tabIndex` on already-rendered guards. `Trap.js:146`'s `<div>` is `FocusTrap`, not a guard.   | `focus-lock/dist/es2015/*.js` (no insertion primitives), `react-focus-lock/dist/es2015/Trap.js:32-53` (`autoGuard` → `lastGuard.node.tabIndex = 0`), `Trap.js:144-150` (`FocusTrap`, unused by `Lock`)                                                                                                                                      |
| 1d  | Is there an API that _does_ put guards around children? | Yes — `InFocusGuard`, which renders `[guard, children, guard]` in one fragment with no container. It is publicly exported. **AFM uses it zero times.**                                                                                                                                                    | `FocusGuard.js:12-26`, exported at `UI.js:8`; `grep -rn "InFocusGuard" platform jira confluence` → 0 hits                                                                                                                                                                                                                                   |
| 2a  | Which DS packages wrap content in a focus lock?         | **5:** `modal-dialog`, `drawer`, `select` (PopupSelect), `onboarding` (SpotlightDialog), `panel-system`. All resolve v2.11.0 via `"react-focus-lock": "root:*"`.                                                                                                                                          | `modal-dialog/src/internal/components/modal-wrapper.tsx:584,611`; `drawer/src/drawer-panel/focus-lock.tsx:35` (via `drawer-panel.tsx:119`); `select/src/popup-select/popup-select.tsx:620`; `onboarding/src/components/spotlight-dialog.tsx:182`; `panel-system/src/components/panel-focus-lock/panel-focus-lock.tsx:227`                   |
| 2b  | `popup`, `dropdown-menu`, `top-layer`?                  | **None of the three uses `react-focus-lock` at all.** `popup`'s `shouldDisableFocusLock` is a prop name only; `dropdown-menu` and `top-layer` mention the library exclusively in migration comments.                                                                                                      | `grep "from 'react-focus-lock'"` → 0 hits in `popup/`, `dropdown-menu/`, `top-layer/`; comment-only refs at `dropdown-menu/src/dropdown-menu-top-layer.tsx:108`, `popup/src/popup-top-layer.tsx:109`                                                                                                                                        |
| 2c  | Gated or unconditional?                                 | **Every `platform-dst-top-layer` path removes `react-focus-lock`** — no `*-top-layer*` file imports it. The 5 DS locks are all on the **legacy** branch only. `onboarding` and `panel-system` have no top-layer path at all; the replacement `@atlaskit/spotlight` has **zero** `react-focus-lock` usage. | `modal-wrapper.tsx:643` / `drawer/src/drawer.tsx:150` / `popup-select.tsx:659` (`if (fg('platform-dst-top-layer'))`); `modal-wrapper.tsx:270` ("Replaces Portal, **FocusLock**, ScrollLock, Blanket…"); `drawer-top-layer.tsx:127`; `popup-select-top-layer.tsx:58`; `grep -rn react-focus-lock packages/design-system/spotlight/` → 0 hits |
| 3a  | **Decisive:** guard as sibling of consumer content?     | **Yes, but only in one shape:** when a consumer's own element directly parents a component whose _root render output_ is a `FocusLock`. Then the guards interleave with the consumer's own children and shift `:nth-child` indices. Verified empirically (scenarios A and B below).                       | Empirical, below. Real AFM instances: `panel-system` `PanelContainer`/`PanelFocusLock` (root output is the lock, **publicly exported**) and `onboarding` `Spotlight` (rendered **in place**).                                                                                                                                               |
| 3b  | Public root-output-is-a-lock components                 | `PanelFocusLock` is exported at `@atlaskit/panel-system/panel-focus-lock`, and `PanelContainer`'s entire output is it. Guards land in the **caller's** container. Mitigated by `isFocusLockEnabled` defaulting to `false`, in which case a plain `<div>` is returned and no guards exist.                 | `panel-system/package.json:66`, `entry-points/panel-focus-lock.tsx:1`, `panel-container/panel-container.tsx:68-72`, `panel-focus-lock.tsx:224-239` (lock branch) vs `:245-249` (plain-div branch)                                                                                                                                           |
| 3c  | Spotlight is in-place, so its guards are too            | `SpotlightManager`'s `<Portal>` wraps **only the `Blanket`**; `{children}` (and therefore `Spotlight` → `SpotlightDialog` → `FocusLock`) render in place. Matches ground-truth #3's `in-place` classification. Guards become siblings in the consumer's container.                                        | `onboarding/src/components/spotlight-manager.tsx:208-218` (Portal wraps Blanket), `:222` (`{children}` in place), `spotlight-dialog.tsx:179-212` (Popper → ValueChanged → FocusLock, no portal)                                                                                                                                             |
| 3d  | The migrating layering surfaces are **not** this shape  | `modal-dialog`, `drawer` and `select` all parent their lock from a **DS-owned** node inside `@atlaskit/portal`, so the guards are siblings of DS chrome and invisible to consumer selectors. Consumer children sit 2–3 levels deeper.                                                                     | `modal-wrapper.tsx:577-600` (`Portal` → `div css={fillScreenStyles}` → `FocusLock` → Blanket → ModalDialog → children); `drawer/src/drawer.tsx:107-137` (`Portal` → `Blanket` + `DrawerPanel`); `drawer-panel.tsx:119-139` (lock → `div role="dialog"` → children); `popup-select.tsx:611-643` (`MenuDialog` → `FocusLock`)                 |
| 3e  | `DrawerPanel` is not a public escape hatch              | Only the **type** `DrawerPanelProps` is exported; the component is internal, so consumers cannot place a drawer lock in their own container.                                                                                                                                                              | `drawer/src/index.tsx` (exports `Drawer`, `DrawerContent`, `DrawerSidebar`, `DrawerCloseButton`; `DrawerPanelProps` type only)                                                                                                                                                                                                              |
| 4   | Are guards in flow / countable?                         | **Yes — real, connected, `:nth-child`-countable elements.** `position: fixed` with `width: 1px; height: 0px` takes them out of layout flow but **not** out of the child list, which is all `:nth-child()` cares about. Not portalled; not removed after effects flush.                                    | `FocusGuard.js:3-11` (`hiddenGuard`); empirical: `isConnected=true`, `matches(':nth-child(n)')=true`, `#scenarioA > *:nth-child(1)` → guard, guard count unchanged after `act` flush                                                                                                                                                        |
| —   | Correction to pre-work #9                               | Its third cited call site, `ai-mate/conversation-assistant-widget/src/ui/main-header/index.tsx:3`, does not exist. The real `ai-mate` lock is elsewhere.                                                                                                                                                  | actual: `packages/ai-mate/conversation-assistant/src/ui/staging-area-modal/draggable-ephemeral-preview/index.tsx:9`                                                                                                                                                                                                                         |

### The one AFM site where a positional selector meets a focus lock — already immune

Across the 7 platform packages that render a `FocusLock` **and** contain any positional selector,
exactly one pairing is even plausible: `generative-ai-modal`'s `FloatingContainer` has
`'> :last-child'` at `FloatingContainer.tsx:193`. It does not collide, for two independent reasons:

- its `GatedFocusLock` passes **`noFocusGuards`** (`FloatingContainer.tsx:249-253`), so **zero**
  guards are rendered; and
- the `> :last-child` rule is on the **inner** `div` (`:317-361`), which is a _descendant_ of the
  lock container, whereas guards would be _ancestral_ siblings.

The other six (`platform-context-menu`, `eoc/focus-state`, `panel-system`, `emoji`, `media-viewer`,
`nudge-tooltip`) have 0–1 positional lines each, none on a lock's parent.

### How this was verified

```bash
# 1. Library reading (v2.11.0 = what every DS package resolves; v2.13.6 = react-focus-lock-next)
grep -rn 'data-focus-guard' node_modules/react-focus-lock/dist/es2015/*.js
grep -rn 'createElement|appendChild|insertBefore' node_modules/focus-lock/dist/es2015/*.js   # 0 hits

# 2. AFM call sites
grep -rn "from 'react-focus-lock'" --include='*.tsx' platform/packages/    # 18 hits, 5 in design-system
grep -rln 'react-focus-lock' --include='*top-layer*.tsx' platform/packages/ # comment-only in 3 files

# 3. Empirical DOM (jsdom 25 + React 18.3.1, both installed library versions)
OPENSSL_CONF=/dev/null NODE_PATH=<repo>/node_modules node scratchpad/guard-dom.cjs
OPENSSL_CONF=/dev/null NODE_PATH=<repo>/node_modules node scratchpad/guard-dom2.cjs
```

`OPENSSL_CONF=/dev/null` is only needed to work around a sandbox denial on
`/System/Library/OpenSSL/openssl.cnf`; it has no bearing on the result.

Observed child lists (identical in **2.11.0 and 2.13.6**):

| Scenario                                                          | Child list of the container under test          | `> *:last-child` selects |
| ----------------------------------------------------------------- | ----------------------------------------------- | ------------------------ |
| **A** — consumer div directly parents `<FocusLock>`               | `GUARD , div[lock] , GUARD`                     | **a focus guard**        |
| **B** — consumer div has its own children **and** a `<FocusLock>` | `span , GUARD , div[lock] , GUARD , span`       | the consumer's `span` ✅ |
| **C** — modal-dialog shape (DS wrapper parents the lock)          | `GUARD , div[lock] , GUARD`                     | a guard (DS-owned node)  |
| **C-inner** — the node consumer children actually live in         | `span , span , span`                            | the consumer's `span` ✅ |
| `noFocusGuards`                                                   | `div[lock]`                                     | the lock container ✅    |
| `noFocusGuards="tail"`                                            | `GUARD , div[lock]`                             | the lock container ✅    |
| `hasPositiveIndices`                                              | `GUARD , GUARD(tabindex=1) , div[lock] , GUARD` | a guard                  |
| `disabled`                                                        | `GUARD(tabindex=-1) , div[lock] , GUARD(-1)`    | a guard                  |
| body-level guards, every scenario                                 | —                                               | **0**                    |

Scenario **B** is the important one: guards do **not** displace `:last-child` there (they sit in the
middle), but they **do** shift `:nth-child(n)` — the consumer's second `span` is `:nth-child(5)`,
not `:nth-child(2)`. So the hazard class is `nth-child`, not only the edge pseudos.

---

## Verdict: `no-term`

**Do not add `[data-focus-guard]` to `S`.**

The reason is not that the hazard is unreal — item 3a shows it is real, and `PanelContainer` and
`onboarding`'s `Spotlight` are genuine instances. The reason is that **the hazard is flag-invariant,
so the term does not belong in this guard.**

`S` exists for exactly one job (§0.2, Background): when `platform-dst-top-layer` is on, a DS surface
stops portalling to `<body>` and renders its host **inline**, so positional selectors that used to
count only real children now count the host too. `S` **restores** pre-flag counting. Focus guards
fail that test on both sides:

1. **The flag never adds a guard.** No `*-top-layer*` file imports `react-focus-lock`; every
   migrated path (`modal-dialog`, `drawer`, `select`) explicitly _deletes_ the lock in favour of
   native `<dialog>` / `popover`, and the successor `@atlaskit/spotlight` has none. Flag-on DOM
   contains **strictly fewer** `[data-focus-guard]` nodes than flag-off DOM.
2. **Adding the term would therefore change shipped flag-off behaviour**, at every one of ~2,600
   sites that happens to parent a lock. Concretely: today `& > *:last-child` on such a container
   matches the trailing guard — a `1px × 0px` `position: fixed` div, so the declaration lands
   harmlessly. With `[data-focus-guard]` in `S`, `& > :nth-last-child(1 of S)` would instead match
   the **lock container**, a real visible element, newly applying styles that have never applied.
   That is the precise inverse of the flag-off no-op property Phase 4 gate 3 is built to assert, and
   it would enlarge the enumerated expected-diff set with diffs the migration did not cause.
3. **It is a different class from every term already in the list.** `[popover]` and `dialog` are
   there because the _flag_ inserts them; `style`, `script`, `template`, `link`, `noscript` are
   there because they are never-rendered injected noise (§0.2's "free to include, unsafe to omit"
   principle). `[data-focus-guard]` is neither — it is a rendered element that was already being
   counted before top layer existed, whose exclusion is a **semantic** change. That puts it in the
   same bucket as `[hidden]`, react-select's `A11yText` spans and the `WidthObserver` div, all of
   which pre-work #9 correctly ruled out as "fix at source, not a codemod term".

**Corollary — the right home for the real hazard.** `[data-focus-guard]` leaking into caller
containers is a pre-existing bug in `panel-system` and `onboarding`, not top-layer debt. The cheap
fix already exists in the library and is already used elsewhere in AFM: pass `noFocusGuards`
(empirically → 0 guards) or move the lock inside a package-owned wrapper, exactly as
`generative-ai-modal` does at `FloatingContainer.tsx:249-253`. File that against the owning packages
rather than coupling ~2,600 selectors to a vendor attribute. Note this is worth doing on its own
merits: it is the `nth-child` index shift in scenario B, not `:last-child`, that is most likely to
be silently wrong today.

### What would justify revisiting — routes to the Phase 1b runtime sweep

Any **one** of these overturns `no-term`:

1. **A migrated surface keeps a focus lock.** If any future `*-top-layer*` path renders a
   `[popover]`/`dialog` host _and_ a `react-focus-lock` (or lands guards inside the host's parent),
   the guard becomes flag-_variant_ and the term is earned. Re-run
   `grep -rln "from 'react-focus-lock'" --include='*top-layer*'` as a cheap tripwire at each
   migration.
2. **The runtime sweep observes the collision.** Phase 1b should record, for every container that
   carries a positional rule, whether its child list contains `[data-focus-guard]` **and** whether a
   top-layer host is a sibling of those guards. A single hit where a migrated host and a guard share
   a parent means the two hazards compound and must be guarded together.
3. **`InFocusGuard` gains an AFM user.** It is currently 0-usage, but it is the one API that puts
   guards directly around arbitrary children with **no container** (`FocusGuard.js:12-26`) — the
   shape that would make guards siblings of consumer content unavoidably rather than incidentally.
4. **`PanelContainer`'s default flips.** `isFocusLockEnabled` defaulting to `false` is what keeps
   item 3b mostly latent. If that default becomes `true`, every `PanelContainer` caller's container
   gains 2 positional slots at once.
