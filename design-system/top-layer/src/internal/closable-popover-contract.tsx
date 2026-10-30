/**
 * `Popover` sets this attribute on its host element when it has an `onClose`. Only those popovers
 * can be asked to close, so `hasOpenDialogOrPopover` counts only those and `requestClosePopovers`
 * asks only those. Outside code cannot dismiss a popover without `onClose` (for example the flag
 * group or a spotlight), so both skip it.
 *
 * `Popover` writes the attribute name as a literal JSX prop. Keep the two in sync.
 */
export const closablePopoverAttribute = 'data-top-layer-closable';

/**
 * `requestClosePopovers` dispatches this event (it does not bubble) on a closable popover host.
 * `Popover` answers it by calling its `onClose` with `reason: 'programmatic'`.
 */
export const requestCloseEventName = 'top-layer-request-close';
