/**
 * **Listener order**
 *
 * One Escape `keydown` reaches the listeners in this order:
 *
 * 1. `Dialog`, `window` capture: decides if the Escape is its own while every layer is still open.
 * 2. `useCloseOnUnclaimedEscape` with a `targetRef`: on that element, so only while focus is in it.
 * 3. React handlers, on the React root (bubble).
 * 4. `useManualLightDismiss` and `useCloseOnUnclaimedEscape` without a `targetRef`: on `document`
 *    (bubble), in bind order. React binds child effects first.
 * 5. `Dialog`, `window` bubble: closes the dialog.
 * 6. The browser, unless a listener called `preventDefault()`: closes the topmost close watcher (an
 *    open `auto` or `hint` popover, or a `<dialog>` that closes on Escape). A `Dialog` has
 *    `closedby="none"`, so it is skipped.
 *
 * The open layers decide which layer takes Escape, not focus. But the `keydown` starts at the
 * focused element, so a handler on its path can take the Escape first, and step 2 hears it only
 * while focus is inside its element.
 *
 * Rules:
 *
 * - A listener that takes an Escape calls `claimEscape()`. Every listener checks
 *   `isEscapeToHandle()` first, so later listeners and the browser leave their layers open.
 * - `defaultPrevented` only shows earlier listeners. A listener that runs before a layer above it
 *   must find that layer itself, with `hasEscapeOwnerAbove`:
 *   - `Dialog` asks in step 1, because the browser (step 6) closes `auto` and `hint` popovers.
 *   - A page surface on an element (step 2) runs before `manual` popovers (step 4), so it counts
 *     them too.
 *   - `document` listeners (step 4) run in bind order, not open order, so popovers, page surfaces
 *     and `Dialog` all ask. The later open is above, but a descendant is always above its ancestors.
 *     A marked page surface ranks just above its nearest containing layer. An owner claims the
 *     Escape even when it declines to close.
 * - `stopPropagation()` before `document` (for example in a React handler) skips steps 4 and 5, not
 *   step 6: the browser closes the topmost `auto` or `hint` popover, and a `Dialog` stays open.
 *
 * Check these rules before moving a listener to another target or phase. For example, a `Dialog`
 * listener on `document` could run before a `manual` popover inside it, and close the dialog
 * instead of the popover.
 */

/**
 * Takes this Escape for a layer. `preventDefault()` stops ancestor layers and the browser from also
 * closing, so one press closes one layer (as a native close watcher), even if the layer stays open.
 *
 * Returns `false` for a held-key repeat: the layer still takes it, but closes once per key press.
 */
export function claimEscape({ event }: { event: KeyboardEvent }): boolean {
	event.preventDefault();
	return !event.repeat;
}
