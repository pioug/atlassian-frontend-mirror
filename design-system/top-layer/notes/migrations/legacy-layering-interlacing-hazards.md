# Legacy layering that does not interlace with the top layer

> **Purpose:** A field guide for the `@atlaskit/top-layer` rollout. It catalogues the **static
> clues** in existing (often custom / product-owned) layering code that predict trouble once a
> neighbouring surface moves into the browser top layer, explains _why_ each pattern breaks, and
> gives a triage procedure plus greppable signals.
>
> **Audience:** Anyone auditing a product or package for top-layer readiness, and reviewers of the
> `platform-dst-top-layer` rollout.
>
> **Related:** [`goals/project-goals.md`](./goals/project-goals.md) ("you cannot interlace top layer
> and non-top layers"), [`decisions/migration-roadmap.md`](./decisions/migration-roadmap.md), and
> the per-package `interlacing` findings in [`migrations/`](./migrations/) (notably
> [`modal-dialog-migration.md`](./migrations/modal-dialog-migration.md) Bug #9 and the tooltip /
> spotlight notes).

---

## 1. The mental model (read this first)

The browser paints in two worlds:

- **Base layer** — the normal document. Everything here is ordered by stacking context and
  `z-index`. This is where the legacy Atlassian layering stack lives: `@atlaskit/portal` appends
  overlay nodes to the end of `<body>` and gives them a `z-index` from `@atlaskit/theme`'s `layers`
  (`tooltip: 9999`, `spotlight: 700`, `flag: 600`, `modal: 510`, `blanket: 500`, `layer: 400`, …).
- **Top layer** — a single browser-managed layer that paints **above the entire base layer**.
  `popover` and `<dialog>.showModal()` promote an element here. **`z-index` is meaningless against
  the top layer** — no base-layer element, at any `z-index`, can paint above a top-layer element.
  Within the top layer, elements stack by **insertion order** (last opened is on top).

A modal `<dialog>` adds two more effects: it renders a top-layer `::backdrop`, and it makes
**everything outside the dialog
[`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)** (unfocusable,
unclickable, hidden from AT).

### The one rule

> A legacy layer coexists with the top layer **only** if it is content that is meant to sit
> _underneath_ the top-layer surface, **or** it is rendered **inline as a real DOM descendant** of
> the top-layer element (so it is promoted along with its parent).
>
> A legacy layer breaks the moment it needs to sit **above** a top-layer surface but lives
> **outside** that surface's DOM subtree — which is exactly what a **portal** (or a body-appended
> `position: fixed` node) does.

Portals were invented to _escape_ the DOM subtree (to dodge `overflow: hidden`, ancestor
`transform`, etc.). That escape is precisely what makes them incompatible: an escaped node lands in
the base layer, so a top-layer surface will occlude it — and if that surface is a modal `<dialog>`,
the escaped node also becomes `inert` and invisible behind the backdrop.

---

## 1a. Rollout state: top-layer surfaces are already pervasive

This is the single most important framing update. Essentially the **entire Design System overlay
surface** now ships a top-layer code path behind `platform-dst-top-layer` (see
[`decisions/migration-roadmap.md`](./decisions/migration-roadmap.md)): `ModalDialog`, `Popup`,
`Tooltip`, `DropdownMenu`, `Flag`, `Spotlight`, `PopupSelect`, `Drawer`, `InlineDialog`,
`DatetimePicker`, `AvatarGroup` overflow, and the react-select `MenuPortal`. **With the flag on,
these all render in the browser top layer.** Two consequences reshape the risk profile:

1. **The "could they coexist?" question is now effectively answered _yes_.** The original triage
   hinged on whether a legacy layer could be open at the same time as a top-layer surface. With DS
   overlays pervasive, almost any non-trivial page already has one — a `Tooltip`, a `Flag`, a
   `ModalDialog` somewhere in play. So **Direction A (legacy occluded behind a migrated surface) is
   now the _default_ outcome, not an edge case.** Treat a custom base-layer overlay as guilty until
   proven isolated.

2. **The DS packages are no longer what you audit — they are what breaks _your_ code.** You do not
   need to check whether `@atlaskit/modal-dialog` or `@atlaskit/tooltip` interlaces; they are on the
   correct side of the line. The audit target is **product / custom layering** and the handful of DS
   surfaces that stayed base-layer on purpose:
   - `@atlaskit/blanket` used standalone (native `<dialog>`'s `::backdrop` replaces it only where
     the modal migrated),
   - `@atlaskit/navigation-system` flyouts (deferred),
   - `@atlaskit/menu` and `@atlaskit/banner` (in-flow, not overlays — fine unless a consumer portals
     them),
   - **base `@atlaskit/select` / `@atlaskit/react-select`** — only `PopupSelect` / `MenuPortal`
     migrated; a plain `Select` with `menuPortalTarget={document.body}` is still a base-layer portal
     (Rule 3).

**How to detect that a top-layer surface is present** (i.e. that a nearby legacy overlay _will_
interlace): the presence of any of these DS components in the subtree is now itself the signal,
because with the flag on they are top-layer.

```
ModalDialog   Popup   Tooltip   DropdownMenu   Flag   Spotlight   PopupSelect   Drawer   InlineDialog
```

A custom portal/overlay rendered **inside, around, or concurrently with** any of these is a live
interlacing hazard — you no longer have to imagine a hypothetical future migration.

---

## 2. The two failure directions

Every interlacing bug is one of these:

| #     | Direction                                                                                                                                                                                                           | Mixed state that triggers it                                                            | Symptom                                                                                                                                                                                                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A** | **Legacy wants to be on top, but a neighbour migrated.** A base-layer portal/`z-index` layer that _used_ to sit above another surface now sits below the migrated (top-layer) surface.                              | The **other** surface migrated first; the layer under audit is still legacy.            | Legacy layer (tooltip, dropdown, toast, its own nested popup) **disappears behind** the top-layer surface. If the surface is a modal `<dialog>`, the legacy layer is also **inert / non-interactive**. This is [`modal-dialog-migration.md`](./migrations/modal-dialog-migration.md) **Bug #9**. |
| **B** | **A migrated surface unexpectedly jumps on top of legacy.** A surface that migrated to top layer now paints above a legacy layer that assumed it owned the top (`z-index: 9999`, a blanket, a full-screen overlay). | The layer under audit migrated; a **legacy** blanket/modal/overlay is still base-layer. | Migrated tooltip / popup / flag renders **over** a legacy modal's blanket or a full-page overlay that was supposed to cover everything.                                                                                                                                                          |

Both directions are live during the rollout, but they are no longer symmetric. With the DS overlay
surface already migrated (§1a), **Direction A dominates** — any base-layer overlay that can share
the screen with a DS modal / popup / tooltip / flag is already exposed. **Direction B** now mostly
bites where a **product's own** legacy modal or blanket coexists with a migrated DS surface (e.g. a
DS `Tooltip` or `Flag` painting over a hand-rolled product modal that still relies on
`z-index: 510`). Direction B is largely moot _between_ DS packages, since they all migrated together
and order themselves via top-layer insertion order.

---

## 3. Ruleset — static clues that predict trouble

Each rule = a **signal you can grep for**, why it's a hazard, which failure direction it feeds, a
severity, and the fix. Severities: **🔴 High** (breaks by default in a mixed stack), **🟠 Medium**
(breaks in specific arrangements), **🟡 Low** (works, but relies on assumptions the top layer
invalidates).

### Rule 1 — Portals to `document.body` (or any out-of-subtree target) 🔴

**Clue**

```
createPortal(              # react-dom
ReactDOM.createPortal(
import Portal from '@atlaskit/portal'
<Portal ...>               # esp. with a zIndex prop
document.body.appendChild( # imperative portal
```

**Why** The portalled node lands in the base layer at the end of `<body>`. Any open top-layer
surface paints above it (direction A); inside a modal `<dialog>` it is also `inert` and hidden
behind `::backdrop`.

**Fix** In preference order (cheapest / least-invasive first):

1. **Render inline as a real DOM child of its parent, if you can.** If the content only ever needs
   to appear _within_ an existing top-layer surface, drop the portal and render it inline — it then
   rides inside the same top layer as its parent and stacks correctly, with no new dependency. This
   is the smallest change and fixes the common "escaped out of a `Dialog`" case.
2. **If it needs to be its own surface, move to an existing DS layering output.** If it is really a
   modal / popup / tooltip / menu / dropdown / flag / spotlight / select, adopt the DS component
   (`@atlaskit/modal-dialog`, `popup`, `tooltip`, `dropdown-menu`, `flag`, `spotlight`, `select`'s
   `PopupSelect`, `drawer`, `inline-dialog`). These already render in the top layer with the flag on
   and handle focus/dismiss/positioning for you — no bespoke portal or z-index needed.
3. **If none fits, use `@atlaskit/top-layer` directly** (`Popover` / `Dialog`) so the surface
   renders in the top layer instead of portalling to `body`.

A portal is only acceptable as-is when its content is meant to sit _below_ all top-layer surfaces
(i.e. it never needs to be on top).

**Caveat on option 1** — inline rendering fixes stacking only because the element is (or is inside)
a top-layer surface. A plain inline `<div>` will be clipped by the very ancestor `overflow: hidden`
/ `transform` / `contain` the portal was escaping. Top-layer _promotion_ (popover/dialog) is what
lets content escape clipping, not the inline DOM position alone — so "drop the portal" must go
together with "the surface is top-layer."

---

### Rule 2 — Hardcoded / `layers` `z-index` used to order two surfaces 🔴

**Clue**

```
import { layers } from '@atlaskit/theme'
layers.tooltip()  layers.modal()  layers.blanket()  layers.flag()  layers.spotlight()  layers.layer()
zIndex: 9999   z-index: 510   z-index: 700    # large "get above everything" values (> ~10)
# NOT this: z-index: 1 / single-digit local ordering within a component — see Nuance below
```

**Why** `z-index` has **zero** effect relative to the top layer. Any code whose correctness depends
on "my 9999 beats your 510" is invalid the instant either surface migrates (direction A **and** B).
The higher and more "I must win" the value, the more certainly it was relying on ordering that the
top layer overrides.

**Nuance — magnitude is the tell.** Small, **local** `z-index` values (`z-index: 1`, `2`, single
digits — roughly `≤ 10`) are almost always just ordering siblings _within a component's own stacking
context_ (a badge over an avatar, a sticky cell header). Those are **fine** — they never tried to
compete with global overlays, and the top layer doesn't change their local ordering. The hazard is
the **large** values (`> ~10`, and especially the `layers.*` constants and 3–4-digit "get above
everything" numbers): those exist specifically to win a _global_ stack, which is exactly the contest
the top layer now settles. When triaging, don't flag every `z-index`; flag the ones reaching for a
global win.

**Migration twist (most fragile of all)** A layer whose `z-index` was hand-tuned to sit _just above_
a specific DS value — e.g. `z-index: 511` to beat `layers.modal() = 510`, or `z-index: 10000` to
beat `layers.tooltip() = 9999` — was explicitly designed around DS living in the base layer. The
moment that DS surface migrates (§1a), the carefully chosen number means nothing and the layer is
occluded. These are the highest-confidence hits.

**Fix** Ordering between surfaces must be expressed as top-layer insertion order (open the one that
should be on top last), or via DOM nesting. Drop the `z-index` once both surfaces are top-layer.

---

### Rule 3 — `react-select` / `@atlaskit/select` with `menuPortalTarget` or `menuPosition: 'fixed'` 🔴

**Clue**

```
menuPortalTarget={document.body}
menuPortalTarget=
menuPosition="fixed"     menuPosition={'fixed'}
```

**Why** The dropdown menu portals to `<body>`. Inside a top-layer modal it is invisible and inert
(the canonical **Bug #9**). This is common enough to call out on its own even though it is a special
case of Rule 1.

**Fix** Remove `menuPortalTarget: document.body` inside a top-layer `Dialog` (the dialog scrolls its
own overflow, so the escape hatch is rarely needed), or adopt the top-layer `PopupSelect` /
`MenuPortalTopLayer` path (`platform-dst-top-layer`), which hosts the menu in the top layer.

---

### Rule 4 — `position: fixed` overlays mounted outside their logical parent 🟠

**Clue**

```
position: 'fixed'     position: fixed     position: 'sticky'   position: sticky
FixedLayer            # @atlaskit/datetime-picker style
inset: 0              top: 0; left: 0; right: 0; bottom: 0   # full-screen overlays
```

**Why** `position: fixed` still lives in the base layer. A fixed full-screen overlay/backdrop
expecting to cover "everything" will be **under** any open top-layer surface (direction B); a fixed
menu/popover expecting to be on top of a migrated surface will be occluded (direction A).
(`position: fixed` is only fine for content that legitimately sits below all overlays, e.g. a sticky
header.)

**Safe pattern (not a hit)** A `position: fixed` child rendered _inside_ `<Popover mode="manual">`
is the **supported** fixed-corner recipe (flags, toasts, snackbars pinned to a viewport region) —
the fixed element rides inside a top-layer surface, so it is correct. See
[`decisions/fixed-position-popover.md`](./decisions/fixed-position-popover.md). Only raw
`position: fixed` overlays _outside_ the top layer are the risk.

**Fix** Move overlays/backdrops into the top layer (`<dialog>`'s `::backdrop`, or `popover`).

---

### Rule 5 — Direct Popper.js / Floating UI positioning of a portalled surface 🟠

**Clue**

```
import ... from '@atlaskit/popper'
usePopper(   <Popper>   <Manager>   <Reference>
@popperjs/core   floating-ui
```

**Why** Positioning itself is not the stacking bug, but Popper/Floating-UI + a portal is the
**signature of a hand-rolled base-layer overlay**. It will interlace exactly like Rule 1, and its
positioning assumes a base-layer containing block that CSS anchor positioning changes.

**Fix** Migrate to `useAnchorPosition` + `Popover`; the positioning and stacking move together.

---

### Rule 6 — `@atlaskit/layering` coordination on a surface that stays base-layer 🟠

**Clue**

```
import { Layering, useLayering, useCloseOnEscapePress } from '@atlaskit/layering'
useLayering()   <Layering ...>
```

**Why** The **level-tree / Escape** surface of `@atlaskit/layering` (`useLayering`, `Layering`,
`useCloseOnEscapePress`, `getLevel`/`getHeight`) is the legacy coordinator for Escape-to-close
ordering and click-outside across nested layers (a JS "level" tree). The browser top layer does this
**natively** (Escape closes the top-most `popover`/`dialog` first; light-dismiss handles
click-outside). When a migrated top-layer surface and a legacy `Layering`-coordinated surface are
open together, the two Escape/dismiss systems don't share a stack — you get double-closes, wrong
close order, or an Escape that closes the wrong layer.

**Safe subset (not a hit)** `@atlaskit/layering/experimental/open-layer-observer`
(`useNotifyOpenLayerObserver`, `useOpenLayerObserver`, `closeLayers`, the namespace providers) is a
**notification/coordination** API, **not** a stacking mechanism. It stays valid on both the legacy
and top-layer paths — only the level-tree/Escape surface above is the interlacing risk.

**Fix** Let the browser own dismissal for migrated surfaces; keep the `@atlaskit/layering` level
tree only for surfaces still in the base layer, and don't mix a single logical stack across both
systems.

---

### Rule 7 — Manual focus traps / inert-ing the rest of the app 🟠

**Clue**

```
react-focus-lock   focus-lock   FocusLock   focus-trap   createFocusTrap
document.body.setAttribute('inert'  root.inert = true
aria-hidden="true"   # applied to the app root while an overlay is open
```

**Why** Two problems. (a) A manual focus trap around a base-layer overlay fights the browser's
top-layer focus management and won't contain content that has been promoted to the top layer — Tab
can escape into or out of the trapped region. (b) Manually inert-ing / `aria-hidden`-ing the app
root duplicates what `<dialog>.showModal()` already does, and it will _not_ inert a top-layer
sibling (top-layer elements are outside the inert-ed subtree), so a stray migrated popover stays
interactive behind/over your "modal".

**Fix** Prefer the native `<dialog>` focus trap + inertness (`Dialog`). If you keep custom focus
management during migration, scope it and don't assume it captures top-layer children.

---

### Rule 8 — Custom blanket / backdrop `<div>` 🟠

**Clue**

```
import Blanket from '@atlaskit/blanket'   <Blanket ...>
layers.blanket()   className="...backdrop..."   a fixed, semi-transparent full-screen div
```

**Why** A base-layer blanket cannot cover a top-layer surface (direction B: a migrated tooltip/flag
shows _over_ the blanket), and a top-layer surface's own `::backdrop` will paint over a legacy
blanket. Two backdrops from two systems will not agree on who is on top.

**Fix** Use the native `::backdrop` of a top-layer `<dialog>`; retire the legacy blanket for
migrated modals.

---

### Rule 9 — Imperative React roots / detached nodes for overlays 🟡

**Clue**

```
ReactDOM.render(   createRoot(   .render(  # into an appended/detached container
document.createElement('div') ... appendChild
```

**Why** Same escape-to-base-layer problem as portals (Rule 1) and it never gets top-layer promotion,
plus it lives outside the React tree so it can't be nested inside a `Dialog`/`Popover`.

**Fix** Bring the overlay into the React tree and use the top-layer primitives.

---

### Rule 10 — Code coupled to the legacy portal DOM shape (selectors, measurements, events) 🟠

**Clue**

```
.atlaskit-portal        [data-ds--level]        body > div[...]   # styling/targeting portal containers
querySelector('.atlaskit-portal ...')   getElementsByClassName('atlaskit-portal
akPortalMount   akPortalUnmount                                   # @atlaskit/portal lifecycle events
getBoundingClientRect()                 # measured from a DS-portalled node to position against it
layers.…                                # read in product code to compute a competing z-index
```

**Why** The legacy DS path portals to a shared container at the end of `<body>` and paints at a
known `z-index`. Code that reaches into that DOM shape — styling the portal container,
querying/measuring a portalled DS node to position something against it, subscribing to portal-mount
events, or reading `layers.*` to compute a value that "beats" a DS surface — silently breaks when
the DS component migrates (§1a): the portalled node no longer exists in that place (or at all), and
the `z-index` it computed against is now irrelevant. Pure styling coupling is 🟡;
**measuring/positioning against a DS-portalled node is 🟠** because it produces mis-placed UI, not
just missed styles.

**Fix** Style and position surfaces via their own component APIs, not by reaching into a global
portal container or reading DS internals.

---

### Rule 11 — Stacking-context traps on ancestors of an anchored surface 🟡 (positioning, not stacking)

**Clue** (on ancestors of a trigger that will become a `useAnchorPosition` anchor)

```
transform:   filter:   perspective:   will-change: transform   contain: paint|layout|strict
backdrop-filter:   isolation: isolate   mix-blend-mode:   opacity: 0.…
```

**Why** These do **not** affect top-layer _stacking_ (the top layer ignores stacking contexts), but
they **do** change the containing block used by CSS Anchor Positioning, which can leave a migrated
anchored popover mis-positioned. Flagged here because auditors will hit it while looking at layering
ancestors.

**Fix** Verify anchored placement after migration; the JS fallback in `useAnchorPosition` covers the
worst cases but check ancestors with these properties.

---

### Rule 12 — "Must be above the modal" surfaces rendered globally 🔴

**Clue** Global/root-mounted UI that is _expected_ to appear over everything: toast/flag systems,
session-timeout dialogs, cookie/consent banners, full-page loading blockers, chat/support widgets,
anything mounted at app root via a portal.

**Why** If these stay legacy-portalled and a top-layer `<dialog>` opens, they land **behind the
backdrop and become inert** (direction A) — the "my toast vanished when the modal opened" bug. If
they migrate but the modal is still legacy, they jump **over** the legacy blanket (direction B).

**Fix** Migrate global overlays and modals together, or make global overlays top-layer (`popover`,
which coexists with `<dialog>` and can be ordered after it).

---

### Rule 13 — Hand-rolled click-outside / scroll / resize dismissal 🟠 (behavioural, not visual)

**Clue**

```
document.addEventListener('click'    document.addEventListener('mousedown'   { capture: true }
window.addEventListener('scroll'     window.addEventListener('resize')
useOnClickOutside   onClickOutside   useCloseManager   # userland light-dismiss / reposition
```

**Why** Legacy layers emulate light-dismiss and follow-on-scroll with global listeners. Once a
top-layer surface is present, **"outside" becomes ambiguous**: a click _inside_ a top-layer element
is _outside_ the legacy layer's DOM subtree, so the handler may wrongly dismiss the legacy layer
(or, with `capture`, swallow the event before the top-layer surface sees it). This is an interlace
you won't see in a screenshot — the stack looks right but dismissal misfires.

**Fix** Prefer the browser's native light-dismiss (`popover="auto"`) / `useSimpleLightDismiss` for
migrated surfaces; scope legacy outside-click logic so it treats top-layer elements as "inside".

---

### Rule 14 — Background UI that must stay interactive or announced under a modal 🔴 (interaction + a11y)

**Clue**

```
aria-live=   role="status"   role="alert"                 # live regions mounted at app root
toast / snackbar / notification systems mounted globally
Intercom / Drift / Zendesk / support & chat widgets       # persistent, always-clickable
cookie / consent banners   onboarding / product tours / walkthroughs
"session expiring" / re-auth prompts rendered outside the modal
```

**Why** This is the mirror image of Rule 7 and it is easy to miss. `<dialog>.showModal()` makes
**everything outside the dialog `inert`** — unclickable, unfocusable, and hidden from assistive
technology. Legacy blanket-based modals never enforced true inertness, so background UI that stayed
live "worked" before. Once the modal is a native `<dialog>`, a background toast you could click, a
live region that kept announcing, a persistent call/chat bar, or a running product tour all go
**dead** while the modal is open. Note the asymmetry: a **non-modal `popover` does _not_ inert**
anything — only `showModal()` does — so this hazard is specific to modal migration.

**Fix** Render must-stay-live UI **inside** the dialog, or as its **own top-layer surface**
(`popover`, which a sibling `<dialog>` does not inert, and which can be ordered above it). Put
`aria-live` announcement regions inside the dialog so they are still conveyed.

---

### Rule 15 — Hand-rolled background scroll locking 🟠

**Clue**

```
document.body.style.overflow = 'hidden'    setAttribute('style', 'overflow:hidden') on body/html
body-scroll-lock   react-remove-scroll   disableBodyScroll / enableBodyScroll
a global "scroll-locked" class toggled on <body> / <html>
```

**Why** Legacy modals stop background scroll by mutating `body`/`html` overflow. The top-layer
`Dialog` ships [`DialogScrollLock`](./architecture/overview.md). Running both **double-locks** (and
the two independent cleanups can race, leaving scroll permanently disabled after close); a hand lock
applied while only a non-modal `popover` is open can also trap the user for no reason.

**Fix** Use `DialogScrollLock` with the top-layer `Dialog`; delete the hand-rolled body-overflow
lock on the migrated path.

---

### Rule 16 — Cross-app / cross-bundle `z-index` "contracts" 🔴 (Atlassian-specific)

**Clue**

```
shared z-index constants/ranges agreed between products or with Forge / marketplace apps
comments like "must sit above the global nav (z-index 200)" / per-app z-index registries
multiple React roots / bundles / micro-frontends rendering overlays into one document
```

**Why** Top-layer stacking is **document-global** and ignores `z-index` entirely. Two
independently-shipped surfaces in the **same document** (host product + a Forge UI-kit/native app,
or two product bundles) that used to coordinate via agreed z-index _ranges_ now stack purely by
**which opened last**. A host top-layer modal covers a partner app's legacy overlay regardless of
the contract — and vice versa once the partner migrates. The negotiated numbers become meaningless.

**Fix** Within one document, all overlapping overlays must live on the same layering system;
coordinate migration across app boundaries. Where a partner app can't migrate, prevent its overlays
from overlapping a top-layer surface. (Cross-**document** boundaries — a Forge Custom UI iframe —
are naturally isolated; see Rule 18.)

---

### Rule 17 — Other things that also enter the top layer: Fullscreen API & third-party embeds 🟠

**Clue**

```
requestFullscreen(   webkitRequestFullscreen(   :fullscreen   :-webkit-full-screen
third-party embeds with astronomically high z-index (e.g. reCAPTCHA 2147483647, chat/video SDKs)
```

**Why** Two under-appreciated facts. (1) The **Fullscreen API also promotes to the top layer** — a
fullscreen video/editor and a `<dialog>` are both top-layer citizens and stack by insertion order,
so a dialog opened _before_ an element goes fullscreen disappears, and a legacy portal overlay over
a fullscreen element is hidden. (2) A third-party widget relying on a giant `z-index` **cannot win
against the top layer** — any top-layer surface covers it, and a modal `<dialog>` also renders it
inert. These third parties usually can't be changed. (Overlaps Rule 2, but flagged because you
control neither the fullscreen stack nor the vendor's code.)

**Fix** Sequence fullscreen and dialogs deliberately (don't leave a stale dialog under a fullscreen
element). For critical vendor flows (captcha, payment, consent), don't open a top-layer modal over
them — host the flow inside the dialog or gate the modal until the flow finishes.

---

### Rule 18 — Document-boundary layers: iframes & shadow DOM 🟡

**Clue**

```
overlay content postMessage-d to a parent frame to escape an iframe
attachShadow(  / web components that render overlays inside a shadow root
rendering into iframe.contentDocument / a separate document
```

**Why** The top layer is **per-document**. A `<dialog>`/`popover` inside an iframe is confined to
the iframe's own box and **cannot overlay the parent page** (legacy embeds often broke out via
`postMessage` + a parent-rendered overlay). `popovertarget` / anchor associations also don't cross
shadow or iframe boundaries reliably.

**Fix** Render an overlay in the document whose viewport it must cover; if an iframe embed must
overlay its host, the **host** has to own the top-layer surface.

---

### Rule 19 — DOM-serialization, screenshot & print tooling 🟡

**Clue**

```
html2canvas   dom-to-image   modern-screenshot   custom outerHTML serialization of overlays
@media print   window.print()  print-specific overlay styling
```

**Why** These walk the live DOM and do **not** reproduce top-layer promotion or the `::backdrop`
pseudo-element. A screenshot/PDF/print of a page with an open dialog or popover can render the
surface mis-placed, unstyled, or omit its backdrop entirely.

**Fix** Capture with a tool that understands the top layer (native/browser screenshot APIs),
snapshot the surface's own subtree directly, or adjust `@media print` rules to account for top-layer
surfaces.

---

## 4. Triage procedure for a single custom layer

```
Is this a DS overlay component on its FF-on path? (ModalDialog/Popup/Tooltip/DropdownMenu/Flag/
  Spotlight/PopupSelect/Drawer/InlineDialog — §1a)
  └─ yes → the migration handles it; it's a top-layer surface. Stop — audit its LEGACY neighbours instead.
  └─ no (product/custom layer, or an un-migrated surface) ↓

Is this UI an overlay (renders visually on top of other content)?
  └─ no  → not a layering concern. Stop.
  └─ yes ↓

Does it escape its DOM subtree? (createPortal / Portal / body.appendChild / imperative root / position:fixed on body)
  └─ no, it renders inline as a child of its trigger/parent
        → SAFE. It will be promoted with a top-layer parent, or sit correctly below one. Stop.
  └─ yes ↓

Does it need to appear ABOVE any other surface that could be open at the same time?
  (With DS overlays migrated (§1a), "could be open at the same time" is almost always YES —
   a DS Tooltip / Flag / ModalDialog is present on most non-trivial pages. Default to yes.)
  └─ no (it's background/underlay content, or provably isolated from every top-layer surface)
        → SAFE (it belongs in the base layer).
  └─ yes / unsure ↓

Does it (or a sibling it must order against) rely on z-index / layers.* to win?
        → 🔴 HAZARD. It will break when either side migrates. See Rules 1–3, 12.

Extra multipliers (each raises severity):
  • It's a MODAL or is opened inside/around a modal        → inert + backdrop occlusion (Bug #9)
  • It uses @atlaskit/layering for Escape/click-outside    → dismissal-ordering conflict (Rule 6)
  • It runs its own focus trap / inert scheme              → focus + inert conflict (Rule 7)
  • It's mounted globally ("above everything")             → direction A & B both (Rule 12)
```

**Rule of thumb:** _portal + high z-index + "must be on top" = it will break._ The absence of a
portal (inline rendering) is the single strongest signal that a layer is safe.

---

## 5. What is probably fine (avoid false positives)

- **Inline overlays** with no portal that are DOM children of their trigger/parent — they promote
  correctly inside a top-layer parent and sit correctly below one.
- **Content meant to be underneath** everything (page chrome, sticky headers, in-flow banners) — the
  base layer is where they belong; `position: fixed` here is fine.
- **A low `z-index` used only for local ordering _within_ one component's own subtree** (e.g.
  ordering two children of the same card). The top layer only overrides _cross-surface_ ordering.
- **A DS overlay component with the flag on** — `ModalDialog`, `Popup`, `Tooltip`, `DropdownMenu`,
  `Flag`, `Spotlight`, `PopupSelect`, `Drawer`, `InlineDialog`, `AvatarGroup` overflow, react-select
  `MenuPortal`. Already top-layer; don't audit it (§1a). **Exception:** base `Select` /
  `react-select` with `menuPortalTarget` is _not_ migrated (only `PopupSelect` / `MenuPortal` is) —
  still a Rule 3 hazard.
- **`@atlaskit/layering/experimental/open-layer-observer`** (`useNotifyOpenLayerObserver`,
  `useOpenLayerObserver`, `closeLayers`) — notification/coordination, not stacking; valid on both
  paths (see Rule 6).
- **A `position: fixed` child inside `<Popover mode="manual">`** — the supported fixed-corner recipe
  (see Rule 4 and [`decisions/fixed-position-popover.md`](./decisions/fixed-position-popover.md)).
- **`aria-hidden` / `inert` used for reasons unrelated to modality** (e.g. hiding a decorative
  region) — only the "inert the whole app while my overlay is open" pattern is a hazard.
- **Background UI under a non-modal `popover`** — only `<dialog>.showModal()` inerts the rest of the
  page. A `popover` (auto or manual) leaves the background interactive and announced, so Rule 14
  does **not** apply to popovers, only to modal dialogs.
- **Drag previews via Pragmatic drag and drop** (`setCustomNativeDragPreview` from
  `@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview`, or the default native
  preview) — these use the browser's **native drag image**, an OS-composited bitmap that is not a
  DOM node and is not subject to `z-index` or the top layer, so it always floats above everything
  (including open dialogs/popovers). ✅ The only drag-preview hazard is a **hand-rolled** cursor-
  following preview (a `position: fixed` portal at high `z-index` moved with JS) — that is a Rule 1
  / Rule 4 case, and the fix is to adopt Pragmatic drag and drop.

A hit on Rules 1–3 is a real bug whenever the layer can be open at the same time as a top-layer
surface it must order against — and with the DS overlay surface migrated (§1a), that is now the
**common case, not the exception**. Confirm coexistence if it's cheap, but default to assuming a
top-layer surface (some DS `Tooltip` / `Flag` / `ModalDialog`) is present.

---

## 6. Starter grep commands

Run from the product/package root (scope narrowly per AGENTS.md). High-signal first:

```bash
# Portals & imperative mounts (Rule 1, 9)
git grep -nE "createPortal|@atlaskit/portal|body\.appendChild|createRoot\(|ReactDOM\.render"

# z-index reliance (Rule 2)
git grep -nE "layers\.(tooltip|modal|blanket|flag|spotlight|layer|dialog|card|navigation)"
git grep -nE "zIndex[:=].*(9999|700|600|510|500|400)|z-index:\s*(9999|700|600|510|500)"

# react-select portal escape (Rule 3)
git grep -nE "menuPortalTarget|menuPosition.*fixed"

# fixed overlays / backdrops (Rule 4, 8)
git grep -nE "position:\s*'?fixed|FixedLayer|@atlaskit/blanket|<Blanket"

# legacy positioning & coordination (Rule 5, 6) — level tree only; open-layer-observer is safe
git grep -nE "@atlaskit/popper|usePopper|@popperjs|floating-ui"
git grep -nE "useLayering|useCloseOnEscapePress|<Layering|getLevel|getHeight"

# manual focus trap / inert (Rule 7)
git grep -nE "focus-lock|FocusLock|focus-trap|createFocusTrap|\.inert\b|setAttribute\('inert'"

# portal-structure coupling & measuring DS-portalled nodes (Rule 10)
git grep -nE "atlaskit-portal|data-ds--level|akPortal(Mount|Unmount)"

# hand-rolled dismissal listeners (Rule 13)
git grep -nE "addEventListener\('(click|mousedown|scroll|resize)'|useOnClickOutside|onClickOutside"

# top-layer surface present nearby (§1a) — a portal in the same file/tree will interlace NOW
git grep -nE "ModalDialog|<Popup|<Tooltip|DropdownMenu|<Flag|Spotlight|PopupSelect|<Drawer|InlineDialog"

# which DS packages actually have a migrated adapter (to confirm a neighbour is top-layer, §1a)
git grep -lE "fg\('platform-dst-top-layer'\)" -- 'packages/design-system/**/src/**/*-top-layer.tsx'

# background inertness under a modal (Rule 14)
git grep -nE "aria-live|role=\"(status|alert)\"|Intercom|Zendesk|Drift|consent|onboarding|walkthrough|tour"

# hand-rolled scroll lock (Rule 15)
git grep -nE "body-scroll-lock|react-remove-scroll|disableBodyScroll|body\.style\.overflow|overflow: ?'?hidden"

# other top-layer participants (Rule 17)
git grep -nE "requestFullscreen|webkitRequestFullscreen|:fullscreen|2147483647"

# document-boundary layers (Rule 18)
git grep -nE "attachShadow|contentDocument"

# serialization / screenshot / print (Rule 19)
git grep -nE "html2canvas|dom-to-image|modern-screenshot|@media print"
```

A file matching **portal + (z-index or "must be on top")** is the top-priority candidate. A file
that matches a portal grep **and** the DS-surface grep above is an even higher-confidence hit,
because the coexisting top-layer surface is right there (no hypothetical migration required). A file
matching only Rule 5/6/11 is a secondary signal — usually accompanies a portal but worth confirming.

---

## 7. Why "rendered as a child of its parent" is the escape hatch

The top layer promotes a `popover`/`<dialog>` **and everything inside its DOM subtree** as one unit.
So a legacy overlay that renders **inline** (a real DOM descendant, no portal) inside a top-layer
parent is painted as part of that parent's top-layer content — it correctly sits above the parent's
other content and above the base layer. The bug is entirely caused by the overlay **leaving** that
subtree (portal, body-append, detached root). This is why the fix for almost every hazard above is
the same: **stop escaping, or move the surface itself into the top layer.**

Note the subtlety: it is not enough for the React _parent_ to be inside a `Dialog`. If the child
itself calls `createPortal(..., document.body)`, it escapes regardless of where its React parent
sits. "Child of its parent" means **DOM** descendant, not just React descendant. </content>
</invoke>
