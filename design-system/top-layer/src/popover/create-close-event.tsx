import type { TPopoverCloseReason } from './types';

/**
 * Creates a synthetic DOM event from a `TPopoverCloseReason`.
 *
 * Use it to bridge the Popover primitive's `onClose({ reason })` callback to a legacy API that
 * expects a native DOM event, for example the `onClose(event)` contract of
 * `@atlaskit/inline-dialog`.
 *
 * - `'escape'` → `KeyboardEvent('keydown', { key: 'Escape' })`
 * - `'light-dismiss'` → `MouseEvent('click')`
 *
 * For any other reason (`'programmatic'`), it returns a generic `Event('close')`.
 *
 * @example
 * ```tsx
 * import { createPopoverCloseEvent } from '@atlaskit/top-layer/popover/create-close-event';
 * import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
 *
 * function onPopoverClose({ reason }: { reason: TPopoverCloseReason }) {
 *   legacyOnClose(createPopoverCloseEvent({ reason }));
 * }
 * ```
 */
export function createPopoverCloseEvent({
	reason,
}: {
	reason: TPopoverCloseReason;
}): KeyboardEvent | MouseEvent | Event {
	if (reason === 'escape') {
		return new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
	}
	if (reason === 'light-dismiss') {
		return new MouseEvent('click', { bubbles: true, cancelable: true });
	}
	return new Event('close');
}
