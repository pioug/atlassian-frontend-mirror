import type { TPopoverCloseReason } from './types';

/**
 * Creates a synthetic DOM event from a `TPopoverCloseReason`.
 *
 * Useful when bridging the Popover primitive's `onClose({ reason })` callback
 * to a legacy API that expects a native DOM event — for example,
 * `@atlaskit/inline-dialog`'s `onClose(event)` contract.
 *
 * - `'escape'` → `KeyboardEvent('keydown', { key: 'Escape' })`
 * - `'light-dismiss'` → `MouseEvent('click')`
 *
 * For any other reason, a generic `Event('close')` is returned as a fallback.
 *
 * @example
 * ```tsx
 * import { createPopoverCloseEvent } from '@atlaskit/top-layer/create-close-event';
 * import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
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
		return new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
	}
	if (reason === 'light-dismiss') {
		return new MouseEvent('click', { bubbles: true, cancelable: true });
	}
	return new Event('close');
}
