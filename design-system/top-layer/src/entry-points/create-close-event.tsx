/**
 * @deprecated Combined entry-point retained for backwards-compatibility.
 * Prefer the disjoint subpaths so that bundle analysis attributes the cost
 * to the right consumer:
 *   - `@atlaskit/top-layer/dialog/create-close-event` for `createCloseEvent`
 *   - `@atlaskit/top-layer/popover/create-close-event` for `createPopoverCloseEvent`
 */
export { createCloseEvent } from '../dialog';
export { createPopoverCloseEvent } from '../popover/create-close-event';
export type { TDialogCloseReason } from '../dialog';
export type { TPopoverCloseReason } from '../popover';
