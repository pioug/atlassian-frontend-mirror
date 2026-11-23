/**
 * The `manual` popovers that `useManualLightDismiss` is asking to close for an outside press, while
 * the owner's answer commits. `Popover` returns no focus for that close, as native light dismiss
 * returns none.
 */
export const lightDismissRequests: WeakSet<HTMLElement> = new WeakSet();
