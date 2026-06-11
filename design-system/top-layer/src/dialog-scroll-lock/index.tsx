import { useLayoutEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';

type TDialogScrollLockProps = {
	/**
	 * Whether the parent dialog is open. The scroll lock is applied while
	 * `true` and released the moment this flips to `false`, regardless of
	 * when (or whether) React unmounts this component. Pass the same
	 * `isOpen` value you pass to the parent `Dialog`.
	 */
	isOpen: boolean;
};

/**
 * __DialogScrollLock__
 *
 * Prevents background page scrolling while a dialog is open. Designed to be
 * rendered inside a `Dialog` and given the same `isOpen` value.
 *
 * Native `<dialog>.showModal()` makes background content _inert_ (not
 * focusable/clickable), but does **not** prevent scroll events from reaching
 * the document body. This component fills that gap by setting
 * `overflow: hidden` on `document.body` while `isOpen` is `true`.
 *
 * The lock is driven by `isOpen` rather than by mount/unmount so that release
 * happens synchronously in the same commit that flips `isOpen` to `false`.
 * Relying on unmount alone was racy: `Dialog` defers the unmount of its
 * children until the host element's close/toggle event fires, which can be
 * after a consumer or test observes the dialog as hidden, leading to a
 * stale `overflow: hidden` window.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@atlaskit/top-layer/dialog';
 * import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';
 *
 * <Dialog isOpen={isOpen} onClose={onClose}>
 *   <DialogScrollLock isOpen={isOpen} />
 *   {children}
 * </Dialog>
 * ```
 */
export function DialogScrollLock({ isOpen }: TDialogScrollLockProps): null {
	useLayoutEffect(() => {
		if (!isOpen) {
			return;
		}
		const body = getDocument()?.body;
		if (!body) {
			return;
		}
		const previousOverflow = body.style.overflow;
		body.style.overflow = 'hidden';

		return () => {
			body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	return null;
}
