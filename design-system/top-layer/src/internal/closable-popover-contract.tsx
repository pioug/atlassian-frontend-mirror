/**
 * Set by `Popover` on its host element when it has an `onClose`. Only those
 * popovers can be asked to close, so only those are counted by
 * `hasOpenDialogOrPopover` and asked to close by `requestClosePopovers`.
 * Popovers without `onClose` (for example the flag group or a spotlight) are
 * not dismissible by outside code and are skipped.
 */
export const closablePopoverAttribute = 'data-top-layer-closable';

/**
 * Dispatched (without bubbling) on a closable popover host by
 * `requestClosePopovers`. `Popover` answers it by calling its `onClose`
 * with `reason: 'programmatic'`.
 */
export const requestCloseEventName = 'top-layer-request-close';
