import type { TDialogCloseReason } from './types';

/**
 * Creates a synthetic DOM event from a `TDialogCloseReason`.
 *
 * Useful when bridging the Dialog primitive's `onClose({ reason })` callback to a legacy API that
 * expects a `KeyboardEvent` or `MouseEvent`, for example the `onClose(event, analyticsEvent)`
 * contract of `@atlaskit/modal-dialog`.
 *
 * - `'escape'` → `KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' })`
 * - `'overlay-click'` → `MouseEvent('click', { cancelable: true })`
 *
 * Both events bubble.
 *
 * @example
 * ```tsx
 * import { createCloseEvent } from '@atlaskit/top-layer/create-close-event';
 * import { type TDialogCloseReason } from '@atlaskit/top-layer/dialog/types';
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
		return new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
	}

	return new MouseEvent('click', { bubbles: true, cancelable: true });
}
