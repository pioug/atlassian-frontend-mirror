import { getDocument } from '@atlaskit/browser-apis';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

type TDialogScrollLockProps = {
	/**
	 * Whether the parent dialog is open. The scroll lock applies while `true`, and is released as
	 * soon as this becomes `false`, whenever (or whether) React unmounts this component. Pass the
	 * same `isOpen` value that you pass to the parent `Dialog`.
	 */
	isOpen: boolean;
};

/**
 * __DialogScrollLock__
 *
 * Prevents background page scrolling while a dialog is open. Render it inside a `Dialog` and give
 * it the same `isOpen` value.
 *
 * Native `<dialog>.showModal()` makes background content _inert_ (not focusable or clickable), but
 * does **not** prevent scroll events from reaching the document body. This component fills that
 * gap: it sets `overflow: hidden` on `document.body` while `isOpen` is `true`.
 *
 * `isOpen` drives the lock, not mount and unmount, so the lock is released in the same commit that
 * sets `isOpen` to `false`. Unmount alone was racy: `Dialog` unmounts its children only after the
 * `close` or `toggle` event of the host element. That can be after a consumer or a test sees the
 * dialog as hidden, so `overflow: hidden` stayed on for a short time.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@atlaskit/top-layer/dialog-content';
 * import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';
 *
 * <Dialog isOpen={isOpen} onClose={onClose} label="Settings">
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
