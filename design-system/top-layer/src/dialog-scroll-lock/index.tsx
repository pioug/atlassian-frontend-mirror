import { useLayoutEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';

/**
 * __DialogScrollLock__
 *
 * Prevents background page scrolling while mounted. Designed to be rendered
 * inside a `Dialog` so that the scroll lock is automatically removed when the
 * dialog closes (unmounts its children).
 *
 * Native `<dialog>.showModal()` makes background content _inert_ (not
 * focusable/clickable), but does **not** prevent scroll events from reaching
 * the document body. This component fills that gap by setting
 * `overflow: hidden` on `document.body`.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@atlaskit/top-layer/dialog';
 * import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';
 *
 * <Dialog isOpen={isOpen} onClose={onClose}>
 *   <DialogScrollLock />
 *   {children}
 * </Dialog>
 * ```
 */
export function DialogScrollLock(): null {
	useLayoutEffect(() => {
		const body = getDocument()?.body;
		if (!body) {
			return;
		}
		const previousOverflow = body.style.overflow;
		body.style.overflow = 'hidden';

		return () => {
			body.style.overflow = previousOverflow;
		};
	}, []);

	return null;
}
