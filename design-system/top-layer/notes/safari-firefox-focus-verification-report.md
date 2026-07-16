# Safari and Firefox focus verification — `@atlaskit/top-layer`

**Date:** 2026-07-08. **Validates:** the native `<dialog>` (`showModal()`) and Popover API
(`showPopover()`) focus behaviour top-layer builds on, in Safari, Firefox, and Chrome. **How:**
Playwright 1.57.0 and 1.61.1 (headless and headed); real Chrome 149, Firefox 145, and Safari 26.5
via WebDriver (`safaridriver` for Safari); plus a human-in-the-loop page in real Safari for the
interaction probes automation cannot drive. Complements
[`architecture/focus.md`](./architecture/focus.md).

## Bottom line

The focus contracts top-layer depends on hold, and reproduce in the real browsers including Safari
26.5. **No code change is required.** The only variable result is Safari's Tab order, which is
user-setting dependent by design.

| Finding                                                                                             | Confidence |
| --------------------------------------------------------------------------------------------------- | ---------- |
| Dialog initial focus: `[autofocus]` descendant, else first focusable, else the dialog element       | Very high  |
| Popover initial focus: no move unless an `autofocus` delegate exists                                | Very high  |
| Dialog restore (Escape / programmatic) returns to the trigger                                       | Very high  |
| Popover restore: Escape and `hidePopover()` restore; light dismiss does not                         | Very high  |
| Nested popover does NOT restore to the inner trigger (Escape and programmatic); lands on `<body>`   | Very high  |
| `autofocus` on the `<dialog>` element diverges (see below)                                          | Very high  |
| Shipping Safari 26 lacks `closedby` and `CloseWatcher`; ships `requestClose()` and Invoker Commands | Very high  |
| Tab reaching `<button>` / `<a>` in Safari is not a fixed fact (see below)                           | High       |

Every "very high" row reproduced identically across Chromium, Firefox, and WebKit, on both
Playwright versions, and in the real browsers.

## Where engines differ

Everything not listed here behaved identically across all engines and real browsers.

| Behaviour                                                       | Chrome      | Firefox           | Safari / WebKit        |
| --------------------------------------------------------------- | ----------- | ----------------- | ---------------------- |
| `autofocus` on the `<dialog>` element (with focusable children) | first child | dialog element    | dialog element         |
| `closedby` attr / `CloseWatcher`                                | yes / yes   | yes / no (FF 145) | no / no                |
| Tab reaches `<button>`                                          | yes         | yes               | user-setting dependent |

## Key findings

- **`autofocus` on the `<dialog>` element itself.** The spec focuses the dialog element; Firefox and
  Safari do, Chrome focuses the first child. Reproduced on Chromium 143 and 149, corroborated by
  Matuzović (Oct 2025). Low impact (the package does not use this), but `focus.md`'s "consistent
  across all three engines" wording needs narrowing.
- **Safari Tab order is user-setting dependent.** The same markup gave three answers:
  Playwright-WebKit (links yes, buttons no), `safaridriver` (everything), default Safari (only
  inputs/selects). It is governed by macOS "Full Keyboard Access" and Safari's "press Tab to
  highlight each item", both off by default. Do not assert Tab lands on a `<button>` in Safari.
  `useFocusWrap` is unaffected because it moves focus with `.focus()`, which works everywhere.
- **Nested popover restoration is a spec-intended gap.** `shouldRestoreFocus` is set only for the
  first popover in a stack, so a nested popover never stores a previously-focused element and focus
  lands on `<body>` on close (identical across engines). This validates the package's fallback, for
  both Escape and programmatic close.
- **Restoration is keyboard-first; Safari's pointer behaviour is deliberate.** Restoration returns
  focus to whatever was focused at open. Keyboard activation focuses the trigger first, so close
  returns to the trigger everywhere. Safari does not focus a `<button>` on click, so a mouse-opened
  overlay has nothing to restore and lands on `<body>` (native Safari; Chrome and Firefox focus the
  button on click). Tests must exercise restoration via keyboard, not `trigger.click()`.
- **Newer features (real Safari 26.5, cross-checked with MDN browser-compat-data):** `closedby` and
  `CloseWatcher` are Technology-Preview-only in Safari, so their absence is real, not a Playwright
  lag. `requestClose()` (Safari 18.4) and Invoker Commands (Safari 26.2) ship. Keep the package's
  own backdrop-click-to-close; `requestClose()` is safe to adopt.

## WebKit in the test harness

Playwright's bundled WebKit **hangs** when a top-layer `Popover` is closed via Escape (the page main
thread blocks; reproduced 6 of 6). **Real Safari 26.5 does not** (it closes, restores focus, and
stays responsive, confirmed via `safaridriver`). A raw native `[popover]` does not hang, so it is
the component's animated close, and the hang is a Playwright-WebKit artifact, not real-Safari
behaviour.

Consequences for the test matrix:

- `desktop-webkit` is **not** enabled for integration tests (it would add flaky hangs that
  misrepresent Safari). `desktop-firefox` is kept.
- Safari-specific **visual / layout** checks (for example the flex-collapse guard at
  `__tests__/informational-vr-tests/safari-flex-collapse.vr.tsx`) run as `vr-informational`
  snapshots on the `DESKTOP_WEBKIT` device, a static render that never drives the hang-prone close.
- Safari **interactive focus** is verified via `safaridriver` and the human-in-the-loop page.

## Recommendations

1. No code change needed for the focus contracts.
2. Narrow the `focus.md` "consistent across all three engines" wording (the
   `autofocus`-on-`<dialog>` divergence). Documentation only.
3. Keep the nested-popover fallback.
4. Do not adopt native `closedby` for `Dialog` (shipping Safari lacks it); `requestClose()` is fine.
5. Do not enable `desktop-webkit` for integration tests (Playwright-WebKit close-hang).
6. Do not assert Tab lands on a `<button>` in Safari / WebKit.
7. Manually spot-check on Safari: VoiceOver into a modal dialog (a known Safari 26 regression), and
   a visible focus ring after programmatic initial focus.

## Validation limits

- Playwright's WebKit and Firefox are not the shipping apps, which is why the real-browser pass was
  run.
- `safaridriver` runs with an unfocused window (`document.hasFocus()` is false), so the click-driven
  light-dismiss probe was confirmed on the human-in-the-loop page instead. Key- and DOM-driven
  probes are unaffected.
- Real Chrome via Selenium also ran unfocused; re-running via Playwright `channel:'chrome'`
  (focused) matched Playwright Chromium, confirming those were window-focus artifacts.

## Open bugs and spec state (secondary; web research)

Nested-popover restoration is normative (`shouldRestoreFocus` is first-in-stack). The in-dialog
focus-trap proposal ([whatwg/html#8339](https://github.com/whatwg/html/issues/8339)) was closed.

| Browser | Bug                                                                         | Area                                                      |
| ------- | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| WebKit  | [276864](https://bugs.webkit.org/show_bug.cgi?id=276864)                    | Escape does not close when focus is in a search input     |
| WebKit  | [252441](https://bugs.webkit.org/show_bug.cgi?id=252441)                    | Restoration breaks when an input's `type` changes         |
| WebKit  | [258682](https://bugs.webkit.org/show_bug.cgi?id=258682)                    | Broken autofocus with a popover custom element            |
| WebKit  | [309670](https://bugs.webkit.org/show_bug.cgi?id=309670)                    | Popover missing from tab order via a button with content  |
| Safari  | Apple Community [256161078](https://discussions.apple.com/thread/256161078) | VoiceOver does not follow into a modal dialog (Safari 26) |
| Firefox | [1765083](https://bugzilla.mozilla.org/show_bug.cgi?id=1765083)             | No focus ring when focus is set in JavaScript             |
| Firefox | [1076638](https://bugzilla.mozilla.org/show_bug.cgi?id=1076638)             | `autofocus` scrolls to an on-screen element               |

## Reproduce

Harness scripts are in the session scratchpad: `focus-probe/` (Playwright) and `real-browser/`
(WebDriver plus the `focus-validation.html` page). Real browsers:
`node real-browser/real-probe.mjs chrome firefox safari` (Safari needs `sudo safaridriver --enable`
plus Develop menu -> Allow Remote Automation).

## Sources

- HTML Standard: [Popover](https://html.spec.whatwg.org/multipage/popover.html),
  [Interactive elements](https://html.spec.whatwg.org/multipage/interactive-elements.html)
- [MDN browser-compat-data](https://github.com/mdn/browser-compat-data)
- Cross-engine dialog focus testing (Matuzović, Oct 2025):
  [matuzo.at/blog/2023/focus-dialog](https://www.matuzo.at/blog/2023/focus-dialog/)
- Bugzilla and Apple links inline in the table above.
