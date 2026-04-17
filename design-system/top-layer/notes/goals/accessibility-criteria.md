# Accessibility Success Measures for Layering Stack Refresh

> This document defines accessibility-specific success measures for the Popover API + Layering
> migration project. Each measure maps to specific WCAG 2.2 Success Criteria with links to official
> documentation, user benefits, and verification methods.

## WCAG Success Criteria Relevant to Layering

| SC     | Level | Title                           | Key Benefit                                                |
| ------ | ----- | ------------------------------- | ---------------------------------------------------------- |
| 2.1.1  | A     | Keyboard                        | Blind users, low vision, motor impairments                 |
| 2.1.2  | A     | No Keyboard Trap                | Screen reader users who can't see they're trapped          |
| 2.4.3  | A     | Focus Order                     | Mobility, reading difficulties, visual disabilities        |
| 2.4.7  | AA    | Focus Visible                   | Keyboard users, attention/memory limitations               |
| 2.4.11 | AA    | Focus Not Obscured (new in 2.2) | Sighted keyboard users, attention limitations              |
| 3.2.1  | A     | On Focus                        | Blind/low vision users disoriented by context changes      |
| 4.1.2  | A     | Name, Role, Value               | Screen reader, magnifier, speech recognition compatibility |
| 4.1.3  | AA    | Status Messages                 | Blind/low vision awareness of content changes              |
| 1.3.1  | A     | Info and Relationships          | Understanding structure and relationships                  |
| 1.3.2  | A     | Meaningful Sequence             | DOM order matches visual/logical order                     |

<details>
<summary>Details</summary>

### 1. Keyboard Accessible (Guideline 2.1)

#### 2.1.1 Keyboard (Level A)

> All functionality of the content is operable through a keyboard interface without requiring
> specific timings for individual keystrokes.

- **Official doc:**
  [WCAG 2.2 — Understanding 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- **Techniques:**
  [G202: Ensuring keyboard control for all functionality](https://www.w3.org/WAI/WCAG22/Techniques/general/G202)

**Benefits:**

- People who are blind (and cannot use devices such as mice that require eye-hand coordination)
- People with low vision (who may have trouble finding or tracking a pointer indicator on screen)
- People with hand tremors who find using a mouse very difficult and therefore usually use a
  keyboard

**Current violations in layering:**

| Issue                                                        | Component     | Jira      |
| ------------------------------------------------------------ | ------------- | --------- |
| Arrow keys in dropdown propagate to parent scroll containers | Dropdown Menu | DSP-13800 |
| No ArrowLeft/ArrowRight for nested dropdown submenus         | Dropdown Menu | —         |
| PopupSelect arrow navigation inconsistent with DS dropdown   | Select        | —         |

**How migration fixes it:**

- `useArrowNavigation` hook calls `event.preventDefault()` on arrow keys, stopping propagation to
  parent scroll containers
- `useArrowNavigation` supports `orientation: 'both'` and `onArrowRight`/`onArrowLeft` callbacks for
  nested submenu navigation
- All positioned popups get consistent keyboard interaction via shared hooks from
  `@atlaskit/top-layer`

---

#### 2.1.2 No Keyboard Trap (Level A)

> If keyboard focus can be moved to a component of the page using a keyboard interface, then focus
> can be moved away from that component using only a keyboard interface, and, if it requires more
> than unmodified arrow or tab keys or other standard exit methods, the user is advised of the
> method for moving focus away.

- **Official doc:**
  [WCAG 2.2 — Understanding 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
- **Techniques:**
  [G21: Ensuring that users are not trapped in content](https://www.w3.org/WAI/WCAG22/Techniques/general/G21)

**Benefits:**

- People who use keyboards or keyboard interfaces are able to navigate to and away from focused
  content. This is critical because getting trapped in a subset of content on a web page can be a
  very disorienting experience for users who rely on keyboard or keyboard-like input.
- This is especially important for people who are blind and using screen readers, as they may not
  realize they are trapped until they try to navigate away and find they cannot.

**Current violations in layering:**

| Issue                                                                                      | Component          | Jira      |
| ------------------------------------------------------------------------------------------ | ------------------ | --------- |
| `focus-trap` library can trap keyboard focus in popup with no escape                       | Popup              | DSP-11986 |
| `shouldCloseOnEscapePress={false}` allows creating inescapable modals                      | Modal Dialog       | DSP-16662 |
| PopupSelect custom focus lock doesn't participate in layer stack                           | Select             | —         |
| When `focus-trap` and `react-focus-lock` conflict in nested layers, focus can become stuck | Popup inside Modal | —         |

**How migration fixes it:**

2.1.2 requires that focus can be _moved away_ from a component (e.g. Tab or other standard exit
methods); it does not require Escape to close. Our approach ensures focus can always leave:

- `popover="auto"` **always allows Escape.** The browser's light dismiss mechanism cannot be blocked
  by JavaScript — pressing Escape will always close the topmost auto popover. This eliminates
  keyboard traps by design.
- `<dialog>.showModal()` **fires `cancel` event on Escape.** Even for modals, the browser provides a
  native Escape mechanism. The `shouldCloseOnEscapePress` prop would control whether the `cancel`
  event calls `onClose`, but cannot prevent the Escape key from being recognized.
- **Native focus management replaces competing libraries.** `<dialog>.showModal()` natively traps
  focus; `popover="auto"` natively provides light-dismiss. No custom JS focus-trapping libraries are
  needed, eliminating the "two traps fighting" scenario entirely.

Ensuring Escape dismisses also aligns with
[WCAG 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
and [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) (see Requirement 4).

---

### 2. Navigable (Guideline 2.4)

#### 2.4.3 Focus Order (Level A)

> If a web page can be navigated sequentially and the navigation sequences affect meaning or
> operation, focusable components receive focus in an order that preserves meaning and operability.

- **Official doc:**
  [WCAG 2.2 — Understanding 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- **Techniques:**
  [H4: Creating a logical tab order through links, form controls, and objects](https://www.w3.org/WAI/WCAG22/Techniques/html/H4)

**Benefits:**

- People with mobility impairments who must rely on keyboard access for operating a page benefit
  from a logical, usable focus order.
- People with disabilities that make reading difficult can become disoriented when focus jumps to an
  unexpected location. They benefit from a logical focus order.
- People with visual disabilities can become disoriented when focus jumps to an unexpected location
  or when they cannot easily find the content surrounding a focused element. They benefit from a
  logical focus order so they understand the content in the wrong context if the focus order is not
  logical.

**Current violations in layering:**

| Issue                                                                         | Component              | Jira      |
| ----------------------------------------------------------------------------- | ---------------------- | --------- |
| Focus moves to `<body>` when dropdown opens (instead of first menu item)      | Dropdown Menu          | DSP-22371 |
| Focus not returned to trigger on popup close (inconsistent across components) | Popup, PopupSelect     | —         |
| Sibling dropdowns don't close each other, creating multiple focus contexts    | Dropdown Menu          | DSP-20702 |
| Portal rendering disconnects focus order from visual layout                   | Popup, Tooltip, Modal  | DSP-21644 |
| Focus documentation insufficient for consumers                                | All layered components | DSP-21873 |

**How migration fixes it:**

All three aspects of focus management — initial focus, focus wrapping, and focus restoration — are
now **role-based and automatic** in `@atlaskit/top-layer`:

| Role      | Initial Focus           | Focus Wrapping (Tab)    | Focus Restoration (on close) |
| --------- | ----------------------- | ----------------------- | ---------------------------- |
| `dialog`  | First focusable element | ✅ Wraps within content | ✅ Auto-restores to trigger  |
| `menu`    | First menu item         | ✅ Arrow navigation     | ✅ Auto-restores to trigger  |
| `listbox` | Selected option         | ✅ Arrow navigation     | ✅ Auto-restores to trigger  |
| `tooltip` | No focus change         | ❌ No wrapping          | ❌ No restoration            |

> Note: `alertdialog` is intentionally unsupported in top-layer; use `dialog` instead.

- **Popover** (primitive) handles initial focus and focus wrapping automatically based on role.
- **PopupContent** (compound) handles focus restoration automatically via the browser's native
  Popover API, which has access to the trigger element through context.
- **Standalone Popover consumers** who manage their own triggers rely on the browser's native focus
  restoration for `popover="auto"` and `popover="hint"` (see notes/architecture/focus.md).
- **Top layer eliminates portals.** `popover="auto"` and `<dialog>` render in the browser's top
  layer without DOM reordering, preserving the logical focus order.
- **Sibling-aware closing** via the layer graph: when a new popup opens,
  `getSiblings().filter(s => s.isOpen).forEach(s => s.close())` automatically closes sibling popups.
- `useArrowNavigation` ensures focus moves to the first menuitem on dropdown open when triggered via
  keyboard.

---

#### 2.4.7 Focus Visible (Level AA)

> Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is
> visible.

- **Official doc:**
  [WCAG 2.2 — Understanding 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- **Techniques:**
  [G149: Using user interface components that are highlighted by the user agent when they receive focus](https://www.w3.org/WAI/WCAG22/Techniques/general/G149)

**Benefits:**

- Anybody who relies on the keyboard to operate the page will benefit from being able to visually
  determine the component on which keyboard operations will interact at any point in time.
- People with attention limitations, short-term memory limitations, or limitations in executive
  processes benefit by being able to discover where the focus is located.

**Current violations in layering:**

| Issue                                                                          | Component       | Jira |
| ------------------------------------------------------------------------------ | --------------- | ---- |
| Focus ring lost when focus jumps to `<body>` or portal container               | Popup, Dropdown | —    |
| `:focus-visible` not consistently applied to menu items after arrow navigation | Dropdown Menu   | —    |

**How migration fixes it:**

- **No portal rendering** means focus stays in the natural DOM flow — the browser's native
  `:focus-visible` indicator works correctly without workarounds.
- `useArrowNavigation` calls `.focus()` on menu items, which correctly triggers the `:focus-visible`
  pseudo-class since navigation is keyboard-driven.

---

#### 2.4.11 Focus Not Obscured (Minimum) (Level AA) — New in WCAG 2.2

> When a user interface component receives keyboard focus, the component is not entirely hidden due
> to author-created content.

- **Official doc:**
  [WCAG 2.2 — Understanding 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

**Benefits:**

- Sighted users who rely on the keyboard benefit when the focused element is not hidden by other
  author-created content, as they can see the element they are interacting with.
- People with attention or memory limitations benefit because they can find the focused element.

**Current violations in layering:**

| Issue                                                                           | Component              | Jira      |
| ------------------------------------------------------------------------------- | ---------------------- | --------- |
| z-index stacking can cause focused elements to be obscured by other layers      | All layered components | —         |
| `shouldRenderToParent` mode can clip focused content within overflow containers | Popup                  | DSP-18626 |

**How migration fixes it:**

- **Top layer rendering** (`popover` attribute, `<dialog>`) guarantees the focused layer is always
  above all other content — no z-index conflicts possible.
- `shouldRenderToParent` **eliminated** — top layer replaces the need for this prop entirely.

---

### 3. Predictable (Guideline 3.2)

#### 3.2.1 On Focus (Level A)

> When any user interface component receives focus, it does not initiate a change of context.

- **Official doc:**
  [WCAG 2.2 — Understanding 3.2.1 On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)
- **Techniques:**
  [G107: Using "activate" rather than "focus" as a trigger for changes of context](https://www.w3.org/WAI/WCAG22/Techniques/general/G107)

**Benefits:**

- People who are blind or have low vision may not realize that a change of context has occurred and
  may become disoriented.
- Some people with visual or cognitive disabilities may not realize they've been taken to a new
  context because the screen looks the same but focus has moved.

**Relevance to layering:**

- Focus moving into a popup/modal is an intentional context change triggered by user activation
  (click or Enter), not by focus alone — this is correct behavior.
- The browser's native focus restoration handles this correctly: focus is restored synchronously
  during the hide algorithm, before any event listeners run. This prevents circular re-opening.

---

### 4. Compatible (Guideline 4.1)

#### 4.1.2 Name, Role, Value (Level A)

> For all user interface components, the name and role can be programmatically determined; states,
> properties, and values that can be set by the user can be programmatically set; and notification
> of changes to these items is available to user agents, including assistive technologies.

- **Official doc:**
  [WCAG 2.2 — Understanding 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- **Techniques:**
  [ARIA14: Using aria-label to provide an invisible label](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA14),
  [ARIA16: Using aria-labelledby to provide a name for user interface controls](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA16)

**Benefits:**

- Providing role, state, and value information on all user interface components enables
  compatibility with assistive technology, such as screen readers, screen magnifiers, and speech
  recognition software, used by people with disabilities.
- When standard HTML elements are used as intended, they already satisfy this success criterion.
  Custom components (like popover-based menus) must add the equivalent ARIA attributes.

**Current violations in layering:**

| Issue                                                        | Component            | Jira      |
| ------------------------------------------------------------ | -------------------- | --------- |
| Inline Dialog missing `role="dialog"`                        | Inline Dialog        | DSP-18917 |
| Inline Message missing `role="dialog"`                       | Inline Message       | DSP-19108 |
| PopupSelect uses incorrect `aria-haspopup` value             | Select (PopupSelect) | DSP-22283 |
| Popup does not set `role` automatically — relies on consumer | Popup                | —         |
| Trigger buttons missing `aria-expanded` state updates        | Multiple             | —         |
| Missing `aria-controls` linking trigger to popup             | Multiple             | —         |

**How migration fixes it:**

- The **`Popup` compound component** auto-wires correct ARIA attributes based on the content's
  `role` prop:
  - `role="menu"` for dropdown menus
  - `role="dialog"` for popup dialogs, inline dialogs, modals, drawers
  - `role="tooltip"` for tooltips
  - `role="listbox"` for PopupSelect
- **Trigger attributes auto-managed** via `Popup.Trigger` context: `aria-haspopup` (correct value
  per role), `aria-expanded` (reflects open state), `aria-controls` (links to popup ID)
- `<dialog>` **element** provides `role="dialog"` implicitly — no manual ARIA needed for modals and
  drawers
- **TypeScript enforcement:** `TAriaRoleRequired` and `TAriaRoleOptional` discriminated union types
  make missing accessible names a compile-time error for `dialog` and `menu` roles

---

#### 4.1.3 Status Messages (Level AA)

> In content implemented using markup languages, status messages can be programmatically determined
> through role or properties such that they can be presented to the user by assistive technologies
> without receiving focus.

- **Official doc:**
  [WCAG 2.2 — Understanding 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- **Techniques:**
  [ARIA22: Using role=status to present status messages](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22)

**Benefits:**

- When appropriate roles or properties are assigned to status messages, the new content is spoken by
  assistive technologies so that blind and low vision users are more likely to notice it.
- This benefits users who may not be able to see or read content changes that occur away from their
  current focus.

**Relevance to layering:**

- When a popup or dropdown **opens**, the screen reader should announce the new context (the `role`
  on the layer container triggers this announcement).
- When a layer **closes**, the screen reader should announce the return context (focus returning to
  the trigger, which is announced).
- For **async-loaded** layer content, a loading state should use `aria-busy="true"` and
  `role="status"` to announce when content has loaded.

---

### 5. Perceivable (Guideline 1.3)

#### 1.3.1 Info and Relationships (Level A)

> Information, structure, and relationships conveyed through presentation can be programmatically
> determined or are available in text.

- **Official doc:**
  [WCAG 2.2 — Understanding 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- **Techniques:**
  [ARIA11: Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11)

**Benefits:**

- People who are blind or have low vision are able to understand the structure and relationships of
  content that is visually conveyed through formatting, spacing, or visual cues.
- People using screen readers benefit when information relationships that are visually implied (like
  a trigger button opening a menu) are programmatically exposed through ARIA.

**Current violations in layering:**

| Issue                                                      | Component     | Jira |
| ---------------------------------------------------------- | ------------- | ---- |
| Trigger-to-popup relationship not programmatically exposed | Multiple      | —    |
| Menu item groupings not semantically marked                | Dropdown Menu | —    |
| Dividers are visual-only (no `role="separator"`)           | Dropdown Menu | —    |

**How migration fixes it:**

- `aria-controls` on triggers links to popup `id`, making the relationship programmatically
  determinable
- `role="none"` on menu item wrapper divs prevents them from interfering with the menu structure
- `role="separator"` on dividers communicates their purpose to screen readers
- Group headings in dropdown menus use `role="group"` with `aria-label`

---

#### 1.3.2 Meaningful Sequence (Level A)

> When the sequence in which content is presented affects its meaning, a correct reading sequence
> can be programmatically determined.

- **Official doc:**
  [WCAG 2.2 — Understanding 1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
- **Techniques:**
  [G57: Ordering the content in a meaningful sequence](https://www.w3.org/WAI/WCAG22/Techniques/general/G57)

**Benefits:**

- People using screen readers hear content in the order it appears in the DOM. When popup content is
  rendered via React portals to the end of `<body>`, the DOM sequence does not match the
  visual/logical sequence, which can be confusing.
- People using screen magnifiers who navigate by DOM order may be confused when popup content
  appears far from its trigger in the DOM.

**Current violations in layering:**

| Issue                                                                                  | Component             | Jira      |
| -------------------------------------------------------------------------------------- | --------------------- | --------- |
| `@atlaskit/portal` renders popup content at end of `<body>`, disconnected from trigger | Popup, Modal, Tooltip | DSP-21644 |
| `shouldRenderToParent` was introduced to fix this but has its own issues               | Popup                 | DSP-18626 |

**How migration fixes it:**

- **Top layer eliminates portals.** Both `popover` and `<dialog>` elements can remain in their
  natural DOM position while rendering visually above everything else via the browser's top layer.
  The DOM sequence matches the logical sequence.
- `shouldRenderToParent` **becomes unnecessary** — every component renders in-place and appears in
  the top layer, getting the best of both worlds.

</details>

---

## Non-Negotiable A11y Requirements

### Requirement 1: DOM Order Must Match Visual Order

**The problem:** For nearly 2 years, the team has been pushing `shouldRenderToParent` across
experiences to work around portal-based DOM ordering issues. Complex scenarios still can't use it.

**Non-negotiable outcome:**

- ✅ Layer content renders in logical DOM order relative to its trigger — **no portal rendering to
  end of `<body>`**
- ✅ `shouldRenderToParent` prop is deprecated and unnecessary
- ✅ `@atlaskit/portal` is no longer used by any layered DS component

**How the migration solves it:**

- `popover="auto"` and `<dialog>` render in the browser's **top layer** without changing DOM
  position. The element stays exactly where it is in the DOM tree — next to its trigger — but
  visually appears above everything else.
- This eliminates the entire class of DOM-order a11y bugs that `shouldRenderToParent` was created to
  solve.

**WCAG:**
[1.3.2 Meaningful Sequence (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)

**Success measure:**

| Milestone | Target                                                                                    | Verification                                                     |
| --------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 0.5       | No portal rendering in migrated safe layers                                               | Code audit: no `@atlaskit/portal` imports in migrated components |
| 0.7       | `shouldRenderToParent` deprecated across all DS layered components                        | Deprecation notice added; no new usage                           |
| 1.0       | `@atlaskit/portal` removed from all DS layered components; `shouldRenderToParent` removed | Package audit; prop removed from types                           |

---

### Requirement 2: Focus Behavior Must Follow Role Semantics

**The rules:**

| Role                 | Initial Focus                                                            | Tab Behavior                                     | Arrow Behavior                                     | Focus Restoration           | Example                                |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------- | --------------------------- | -------------------------------------- |
| `dialog` (modal)     | First interactive element, or close button, or the dialog element itself | **Cycles** — Tab wraps within dialog             | Not applicable                                     | ✅ Auto-restores to trigger | Modal Dialog, Drawer                   |
| `dialog` (non-modal) | First interactive element, or close button, or the dialog element itself | **Cycles** — Tab wraps within dialog (soft-trap) | Not applicable                                     | ✅ Auto-restores to trigger | Popup (`role="dialog"`), Inline Dialog |
| `menu`               | First menuitem                                                           | **Exits** — Tab closes the menu                  | **Cycles** — ArrowDown/Up navigate items, wrapping | ✅ Auto-restores to trigger | Dropdown Menu                          |
| `listbox`            | First/selected option                                                    | **Cycles** — Tab wraps within content            | **Cycles** — ArrowDown/Up navigate options         | ✅ Auto-restores to trigger | Select, TimePicker                     |
| `tooltip`            | No focus change                                                          | No wrapping                                      | Not applicable                                     | ❌ No restoration           | Tooltip                                |
| No dialog role       | Per consumer                                                             | **Exits** — Tab moves to next element            | Per consumer                                       | ❌ No restoration           | Simple Popup                           |

Focus restoration is handled natively by the browser's Popover API for `popover="auto"` and
`popover="hint"`. When Escape is pressed or `hidePopover()` is called, the browser automatically
restores focus to the trigger element. See notes/architecture/focus.md for full details.

**Key distinction:** Dropdown Menu **does not use `dialog` semantics**, hence Tab should NOT cycle
in dropdown menus. Only components with `role="dialog"` should cycle Tab.

**Non-negotiable outcome:**

- ✅ `role="dialog"` components cycle Tab (soft-trap or full trap depending on modality)
- ✅ `role="menu"` components do NOT cycle Tab — Tab exits and closes the menu
- ✅ Initial focus moves into the layer on open (to first interactive element or the container
  itself)
- ✅ Focus behavior is determined by the component's ARIA role, not by a one-size-fits-all approach

**How the migration solves it:**

- `<dialog>.showModal()` **natively traps focus** for modal dialogs — the browser cycles Tab within
  the dialog without any custom JS focus trapping.
- `popover="auto"` **provides light-dismiss natively** — no custom focus trap needed for non-modal
  layers. Focus behavior follows the browser's built-in popover semantics.
- `useArrowNavigation()` — for `role="menu"` components (arrow keys cycle through menuitems).
- **No custom `useFocusTrap` is needed.** Native `<dialog>` and `popover="auto"` handle focus
  containment and release, eliminating the need for competing JS focus-trapping libraries.
- **Focus restoration is native.** The browser's Popover API handles focus restoration automatically
  for `popover="auto"` and `popover="hint"` — no custom hook needed. See notes/architecture/focus.md
  for details.

**Deliberate design decision — no custom initial-focus API:**

`@atlaskit/top-layer` does **not** expose a custom initial-focus API (e.g., `autoFocusRef`,
`initialFocusRef`). This is intentional:

- **`<dialog>.showModal()`** follows the
  [dialog focusing steps](https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps):
  it focuses the first element with the `autofocus` attribute, then the first focusable element,
  then the dialog itself. Consumers who need to direct initial focus set the native HTML `autofocus`
  attribute on the target element inside the dialog. **Note:** React 18's `autoFocus` JSX prop does
  not set the HTML attribute — consumers must use a ref callback (e.g.
  `node.setAttribute('autofocus', '')`) until React 19+. See `notes/architecture/focus.md` for
  details.
- **`popover="auto"`** does not move focus on open by default (per the
  [Popover API spec](https://html.spec.whatwg.org/multipage/popover.html)). This is correct for most
  popover use cases (tooltips, simple popups). For `role="menu"` components, the adopter (e.g.,
  dropdown-menu) is responsible for moving focus to the first menu item on keyboard-triggered open
  via `getFirstFocusable`.
- **Rationale:** Leaning on the platform's native focus behavior eliminates an entire category of
  bugs caused by custom focus management conflicting with native behavior. It also means we
  automatically benefit from any future browser improvements to focus handling.

**WCAG:**
[2.4.3 Focus Order (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html),
[2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)

**Success measure:**

| Milestone | Target                                                              | Verification                                                            |
| --------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 0.5       | Native `<dialog>` and `popover="auto"` handle focus for safe layers | Manual Tab behavior test; no custom focus-trap imports                  |
| 0.7       | All DS layered components rely on native focus behavior per role    | Audit: no custom focus-trap library usage in migrated components        |
| 1.0       | No component uses wrong focus pattern for its role                  | Automated test: `role="menu"` → Tab exits; `role="dialog"` → Tab cycles |

---

### Requirement 3: External Content Must Not Be Discoverable When Dialog Is Modal

**Non-negotiable outcome:**

- ✅ When a modal is open, background content is completely inert — not focusable, not navigable by
  screen reader, not clickable
- ✅ This applies to both keyboard navigation AND screen reader virtual cursor navigation
- ✅ `<dialog>` element handles this natively via `showModal()`

**How the migration solves it:**

- `<dialog>.showModal()` automatically makes background content inert — the browser handles this
  without any JS
- For additional safety, `inert` attribute can be applied to `<main>` or other containers
- This replaces the current `aria-hidden` approach which only hides from AT but doesn't prevent
  keyboard interaction

**WCAG:**
[2.4.3 Focus Order (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html),
[1.3.2 Meaningful Sequence (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)

**Success measure:**

| Milestone | Target                                                                                  | Verification                                                       |
| --------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 0.7       | Modal Dialog and Drawer use `<dialog>.showModal()` — background automatically inert     | Screen reader test: virtual cursor cannot reach background content |
| 1.0       | `aria-hidden` on background replaced by native `<dialog>` inertness + `inert` attribute | Code audit: no manual `aria-hidden` toggling for modal background  |

---

**Escape to dismiss — where it comes from:** The rule that Escape should dismiss overlays is not
from WCAG 2.1.2 (which only requires that focus can move away). It comes from
[WCAG 1.4.13 Content on Hover or Focus (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
— content that appears on hover/focus must be dismissable, and Escape is the standard method — and
from the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/), which states that
modals, dialogs, and custom menus should close on Escape.

### Requirement 4: Escape Must Always Dismiss — Non-Negotiable

**The problem:** `shouldCloseOnEscapePress` allows consumers to disable Escape dismissal, creating
keyboard traps. Gerard explicitly calls this out — it should not exist.

**Non-negotiable outcome:**

- ✅ Escape **always** dismisses any popup, dialog, dropdown, or modal — no exceptions
- ✅ `shouldCloseOnEscapePress` prop is deprecated and eventually removed
- ✅ Light dismiss (click outside) works for non-modal layers
- ✅ For modals: Escape fires `cancel` event which triggers `onClose` — consumers cannot prevent the
  Escape key from being recognized

**How the migration solves it:**

- `popover="auto"` **light dismiss cannot be blocked.** The browser's native Escape handling for
  auto popovers is not JS-cancelable — pressing Escape will always close the topmost popover. This
  makes keyboard traps **impossible by design**.
- `<dialog>` **fires `cancel` event on Escape.** While technically `preventDefault()` can be called
  on the cancel event, we should NOT expose this to consumers. The `onClose` callback fires
  unconditionally.
- `shouldCloseOnEscapePress` **deprecated.** For the rare case where Escape shouldn't close (e.g.,
  onboarding spotlight), use `popover="manual"` which doesn't have light dismiss — but the consumer
  must provide an alternative exit method (explicit close button).

**WCAG:**
[1.4.13 Content on Hover or Focus (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
— content that appears on hover/focus must be dismissable (Escape is the standard method).
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — modals, dialogs, and custom menus
should close on Escape. Satisfying this also ensures
[2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) (focus
can leave).

**Success measure:**

| Milestone | Target                                                                                         | Verification                                                            |
| --------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 0.5       | Escape works on all migrated safe layers via native light dismiss                              | Manual: open → Escape → verify close                                    |
| 0.7       | `shouldCloseOnEscapePress` deprecated with console warning                                     | Code audit: deprecation warning added                                   |
| 1.0       | `shouldCloseOnEscapePress` removed from all DS components. Zero keyboard traps across all apps | Prop removed from types; manual Escape test for every layered component |

---

### Requirement 5: Focus Must Return to Trigger on Dismiss

**Non-negotiable outcome:**

- ✅ On dismiss (Escape, click outside, explicit close), focus returns to the trigger element
- ✅ If the trigger no longer exists (e.g., deleted item), consumer provides a `returnFocusRef` for
  alternative target
- ✅ Focus return works correctly for nested layers — each layer returns to its own trigger

**How the migration solves it:**

- **Browser's native focus restoration** handles focus return automatically for `popover="auto"` and
  `popover="hint"`. When Escape is pressed or `hidePopover()` is called, the browser restores focus
  to the trigger element. See notes/architecture/focus.md for full details.
- **`PopupContent`** (the compound component wrapper) relies on native restoration — consumers using
  the `Popup` compound need zero manual focus code.
- **Standalone `Popover` consumers** benefit from the browser's native restoration automatically —
  no custom hook or manual wiring needed.
- `returnFocusRef` **prop** can be supported at the component level for the rare "trigger no longer
  exists" case (e.g., a deleted item) where custom focus handling is needed.
- **Entry points:** `@atlaskit/top-layer/popup` (automatic native restoration),
  `@atlaskit/top-layer/popover` (automatic native restoration).

**WCAG:**
[2.4.3 Focus Order (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)

**Success measure:**

| Milestone | Target                                                                     | Verification                                                         |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 0.5       | Native `popover="auto"` and `<dialog>` handle focus return for safe layers | Automated: assert `document.activeElement === trigger` after close   |
| 0.7       | Nested focus return works (3+ levels deep) via native browser behavior     | Test: open 3 nested layers → Escape 3× → verify focus at each level  |
| 1.0       | `returnFocusRef` supported at component level for "trigger deleted" case   | API audit: prop available on all components; documented with example |

---

### Non-Negotiable Requirements Summary

| #   | Requirement                                 | Source       | WCAG                                                                                                                                                                                                                | Solved By                                                                                                              | Milestone |
| --- | ------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | DOM order matches visual order (no portals) | Gerard Cohen | [1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)                                                                                                                                       | Top layer (`popover`, `<dialog>`) replaces `@atlaskit/portal`                                                          | 0.5–1.0   |
| 2   | Focus behavior follows role semantics       | Gerard Cohen | [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), [2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)                                                                           | Native `<dialog>` + `popover="auto"` focus behavior; `useArrowNavigation` for menus                                    | 0.5–1.0   |
| 3   | Background inert when modal is open         | Gerard Cohen | [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), [1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)                                                                | `<dialog>.showModal()` native inertness                                                                                | 0.7       |
| 4   | Escape always dismisses — no exceptions     | Gerard Cohen | [1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html), [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) (and [2.1.2](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)) | `popover="auto"` native light dismiss; deprecate `shouldCloseOnEscapePress`                                            | 0.5–1.0   |
| 5   | Focus returns to trigger on dismiss         | Gerard Cohen | [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                                                                                                                               | Browser's native focus restoration (Popover API); `returnFocusRef` at component level for "trigger deleted" edge cases | 0.5–1.0   |

---

## A11y Success Measures by Milestone

### 0.5 — Safe Layers

| Measure                       | Target                                                                              | Verification                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **2.1.2 No Keyboard Trap**    | Zero keyboard traps in migrated components (tooltip, simple popup)                  | Manual: open → Escape → verify close. Automated: no `focus-trap` import |
| **2.4.3 Focus Order**         | Focus moves to correct element on open; returns to trigger on close for safe layers | Automated: assert `document.activeElement` on open/close                |
| **4.1.2 Name, Role, Value**   | Migrated components have correct `role` and ARIA attributes                         | Axe-core scan passes                                                    |
| **1.3.2 Meaningful Sequence** | No portal rendering in migrated components; DOM order matches visual order          | Code audit: no `@atlaskit/portal` imports                               |

### 0.7 — Full DS in One App

| Measure                       | Target                                                                     | Verification                                                        |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **2.1.1 Keyboard**            | Arrow keys in dropdown don't propagate; ArrowRight/Left works for submenus | Manual keyboard test + `event.preventDefault()` in code             |
| **2.1.2 No Keyboard Trap**    | Zero keyboard traps across ALL layered DS components                       | Manual Escape test for every component; CI automated test           |
| **2.4.3 Focus Order**         | Nested layers (3+ deep) return focus correctly at each level               | Test: open 3-level dropdown → Escape 3× → verify focus at each step |
| **2.4.7 Focus Visible**       | Focus indicator visible on all menu items during arrow navigation          | Visual inspection + `:focus-visible` audit                          |
| **2.4.11 Focus Not Obscured** | No focused element hidden behind other layers                              | Top layer audit: all layers render in top layer                     |
| **4.1.2 Name, Role, Value**   | All DS layered components have correct ARIA across one application         | Axe-core scan on target app pages with layered content              |
| **Open bug reduction**        | 50% reduction in `dst-a11y` layering bugs (from 25 → ≤12)                  | JQL query count                                                     |
| **Screen reader testing**     | Migrated components tested with VoiceOver (macOS) and NVDA (Windows)       | Test matrix documented                                              |

### 1.0 — All Apps

| Measure                     | Target                                                                                          | Verification                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **2.1.2 No Keyboard Trap**  | Zero violations across ALL apps on local consumption                                            | Axe-core scan + manual test across apps            |
| **2.4.3 Focus Order**       | Focus order correct for all layered component instances across all apps                         | RUM focus tracking or automated regression tests   |
| **4.1.2 Name, Role, Value** | Zero axe violations for ARIA attributes on layered components                                   | Axe-core CI pipeline across all apps               |
| **4.1.3 Status Messages**   | Async-loaded layer content announces correctly via `aria-busy` / `role="status"`                | Screen reader test with async content              |
| **Open bug reduction**      | 80% reduction in `dst-a11y` layering bugs (from 25 → ≤5, expected: only contrast issues remain) | JQL query count                                    |
| **Screen reader docs**      | Published expected screen reader behavior for all layered components on atlassian.design        | Documentation review                               |
| **SR test coverage**        | All components tested with JAWS, NVDA, VoiceOver, and TalkBack                                  | Test matrix complete: pass/fail per component × SR |

---

## WCAG Resolution Matrix

A complete view of every WCAG SC violation, which components are affected, and exactly how the
migration resolves each one. (Escape-to-dismiss is required by 1.4.13 and ARIA APG; our
implementation also satisfies 2.1.2 by ensuring focus can always leave.)

| WCAG SC                                                                                                  | Level | Violation                                     | Components                   | Resolution                                                                                                    | Milestone |
| -------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)                              | A     | Arrow keys propagate to parent                | Dropdown Menu                | `useArrowNavigation` with `preventDefault()`                                                                  | 0.7       |
| [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)              | A     | `focus-trap` can trap in popup                | Popup                        | `popover="auto"` always allows Escape (per 1.4.13/APG); focus can leave                                       | 0.5       |
| [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)              | A     | `shouldCloseOnEscapePress=false` traps        | Modal Dialog                 | Deprecate prop → replace with `onBeforeClose` + Escape confirmation escalation (max 2 presses to exit)        | 0.7       |
| [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)              | A     | Two focus libraries conflict in nested layers | Popup in Modal               | Native `<dialog>` + `popover="auto"` handle focus natively — no competing JS focus libraries                  | 0.7       |
| [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                        | A     | Focus jumps to `<body>` on open               | Dropdown Menu                | `useArrowNavigation` focuses first item                                                                       | 0.5       |
| [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                        | A     | Focus not returned on close                   | Popup, PopupSelect           | Browser's native focus restoration (Popover API handles focus return automatically on Escape and hidePopover) | 0.5       |
| [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                        | A     | Sibling popups don't close each other         | Dropdown Menu                | Layer graph `getSiblings()` auto-close                                                                        | 0.7       |
| [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)                    | AA    | Focus ring lost in portals                    | Popup, Dropdown              | Top layer: no portals, native `:focus-visible`                                                                | 0.7       |
| [2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA    | z-index can obscure focused layer             | All                          | Top layer guarantees visibility                                                                               | 0.7       |
| [3.2.1 On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)                              | A     | Focus return could re-trigger popup           | Popup                        | Graph separates close from focus events                                                                       | 0.7       |
| [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)              | A     | Missing `role` on popup/inline-dialog         | Popup, Inline Dialog/Message | `Popup` compound auto-wires roles via `role` prop                                                             | 0.5       |
| [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)              | A     | Wrong `aria-haspopup` on PopupSelect          | Select                       | `Popup.Trigger` derives correct `aria-haspopup` from content role                                             | 0.7       |
| [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)              | A     | Missing `aria-expanded` / `aria-controls`     | Multiple                     | `Popup.Trigger` auto-manages via context                                                                      | 0.5       |
| [4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                | AA    | No announcement on popup open/close           | Multiple                     | Correct `role` triggers SR announcement                                                                       | 0.7       |
| [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)  | A     | Trigger-popup relationship not exposed        | Multiple                     | `aria-controls` links trigger to popup ID                                                                     | 0.5       |
| [1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)        | A     | Portal disconnects DOM from visual order      | Popup, Modal, Tooltip        | Top layer: in-place rendering, no portals                                                                     | 0.5       |

---

## A11y Scoring Dashboard

Track progress quantitatively across dimensions:

| Dimension           | Metric                                                                                 | Baseline (Current) | Target (0.5) | Target (0.7) | Target (1.0) | How to Measure                            |
| ------------------- | -------------------------------------------------------------------------------------- | ------------------ | ------------ | ------------ | ------------ | ----------------------------------------- |
| Keyboard Navigation | % of layered components with full keyboard support                                     | ~60%               | 70%          | 90%          | **100%**     | Audit against WAI-ARIA APG patterns       |
| Focus Management    | % with correct focus-on-open + focus-return-on-close                                   | ~50%               | 70%          | 90%          | **100%**     | Automated `activeElement` assertion tests |
| ARIA Completeness   | % with correct `role`, `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-label` | ~40%               | 60%          | 90%          | **100%**     | Axe-core rule pass rate                   |
| Screen Reader       | % tested & passing with JAWS, NVDA, VoiceOver                                          | ~30%               | 40%          | 70%          | **100%**     | SR test matrix (component × SR)           |
| Open A11y Bugs      | Count of `dst-a11y` layering bugs                                                      | **25**             | 20           | ≤12          | **≤5**       | JQL query                                 |
| WCAG Violations     | Distinct WCAG SC violations                                                            | **~8 SC**          | 5            | 2            | **0**        | Axe-core + manual audit                   |
| Keyboard Trap Free  | Keyboard trap scenarios                                                                | **~3**             | 1            | 0            | **0**        | Manual: Escape from every layer           |

---

## Focus Restoration — Browser Native Behavior

### Decision

Focus restoration on popup close is **automatically handled by the browser's Popover API** for
`popover="auto"` and `popover="hint"`. Consumers do NOT need to manually call
`triggerRef.current?.focus()` in their `onClose` handlers or import any custom hook.

This is built into the HTML standard and requires no custom code.

### WCAG 2.4.3 Focus Order (Level A)

> If a web page can be navigated sequentially and the navigation sequences affect meaning or
> operation, focusable components receive focus in an order that preserves meaning and operability.

When a popup with a focus-receiving role closes, focus must return to the trigger element to
preserve logical focus order. Without this, focus would jump to `<body>` or an unpredictable
location, disorienting keyboard and screen reader users.

### Roles That Auto-Restore Focus

| Role      | Focus Restored? | Reason                                                |
| --------- | --------------- | ----------------------------------------------------- |
| `dialog`  | ✅ Yes          | Focus moves into dialog content; must return on close |
| `menu`    | ✅ Yes          | Focus moves to menu items for arrow-key navigation    |
| `listbox` | ✅ Yes          | Focus moves to options for selection                  |
| `tooltip` | ❌ No           | Focus never moves to tooltip; informational only      |
| `note`    | ❌ No           | Passive content; focus not moved                      |
| `status`  | ❌ No           | Live region; focus not moved                          |
| `alert`   | ❌ No           | Live region; focus not moved                          |
| `log`     | ❌ No           | Live region; focus not moved                          |
| No role   | ❌ No           | No semantic requirement for focus restoration         |

### Implementation

The browser's Popover API natively restores focus when:

- **Escape is pressed** → browser restores focus to the trigger (synchronously, before toggle event
  fires)
- **`hidePopover()` is called** → browser restores focus to the trigger (synchronously, before
  toggle event fires)
- **Click-outside (light dismiss)** → browser deliberately does NOT restore focus (correct per spec)

For consumers using the `Popup` compound (`@atlaskit/top-layer/popup`), this focus restoration is
fully automatic — zero manual focus code needed.

For standalone `Popover` consumers (`@atlaskit/top-layer/popover`) who manage their own triggers,
the browser's native restoration also applies automatically — no custom hook or manual wiring is
required.

See notes/architecture/focus.md for full technical details.

### Entry Points Summary

| Entry Point                   | Initial Focus             | Focus Wrapping            | Focus Restoration                                      |
| ----------------------------- | ------------------------- | ------------------------- | ------------------------------------------------------ |
| `@atlaskit/top-layer/popup`   | ✅ Automatic (role-based) | ✅ Automatic (role-based) | ✅ Automatic (role-based)                              |
| `@atlaskit/top-layer/popover` | ✅ Automatic (role-based) | ✅ Automatic (role-based) | ✅ Automatic (native browser)                          |
| `@atlaskit/top-layer/focus`   | N/A                       | N/A                       | No longer exports focus restoration — handled natively |

### Migration Impact

Components that previously implemented manual focus restoration in their `onClose` handlers can
remove that code:

```diff
 const handleOnClose = ({ reason }) => {
-  if (reason === 'escape') {
-    triggerRef.current?.focus();
-  }
   onClose();
 };
```

Focus restoration is now built-in when using `role="dialog"`, `role="menu"`, or `role="listbox"`.
