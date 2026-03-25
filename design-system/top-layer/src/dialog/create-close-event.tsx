import type { TDialogCloseReason } from './types';

/**
 * Creates a synthetic DOM event from a `TDialogCloseReason`.
 *
 * Useful when bridging the Dialog primitive's `onClose({ reason })` callback
 * to a legacy API that expects a `KeyboardEvent` or `MouseEvent` — for example,
 * `@atlaskit/modal-dialog`'s `onClose(event, analyticsEvent)` contract.
 *
 * - `'escape'` → `KeyboardEvent('keydown', { key: 'Escape' })`
 * - `'overlay-click'` → `MouseEvent('click')`
 *
 * @example
 * ```tsx
 * import { createCloseEvent } from '@atlaskit/top-layer/create-close-event';
 * import { type TDialogCloseReason } from '@atlaskit/top-layer/dialog';
 *
 * function onDialogClose({ reason }: { reason: TDialogCloseReason }) {
 *   legacyOnClose(createCloseEvent({ reason }));
 * }
 * ```
 */
export function createCloseEvent({
	reason,
}: {
	reason: TDialogCloseReason;
}): KeyboardEvent | MouseEvent {
	if (reason === 'escape') {
		return new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
	}

	return new MouseEvent('click', { bubbles: true, cancelable: true });
}
