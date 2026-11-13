import { type ReactNode, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { bind } from 'bind-event-listener';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { openOrderTracker } from '../internal/escape-ownership/open-order-tracker';
import { openRequestedAttribute } from '../internal/open-requested-attribute';

type TPortalTarget =
	| { type: 'not-picked' }
	| { type: 'in-place' }
	| { type: 'dialog'; dialog: HTMLDialogElement };

function subscribeToNothing(): () => undefined {
	return () => undefined;
}

function getClientSnapshot(): boolean {
	return true;
}

// The server snapshot is also used while the client hydrates.
function getServerSnapshot(): boolean {
	return false;
}

/**
 * The topmost open `Dialog`. `Dialog` sets `data-top-layer-open-requested` while `isOpen` is
 * `true`. A dialog with it that is not open (closing, hidden by Suspense, or waiting to show) is
 * not a candidate. The browser does not tell us the top-layer order, so the open order tracker
 * gives it. On a tie, the later dialog in DOM order wins.
 *
 * `leavingDialog`: skip it and the dialogs inside it. The dialogs inside it include the ones that
 * the portal children render.
 */
function pickTarget({
	ownerDocument,
	leavingDialog,
}: {
	ownerDocument: Document;
	leavingDialog: HTMLDialogElement | null;
}): TPortalTarget {
	const candidates = Array.from(
		ownerDocument.querySelectorAll<HTMLDialogElement>(`dialog[${openRequestedAttribute}]`),
	).filter((dialog) => dialog.open && !leavingDialog?.contains(dialog));
	const topmost = candidates.reduce<HTMLDialogElement | null>((best, dialog) => {
		if (
			!best ||
			(openOrderTracker.getOpenOrder({ element: dialog }) ?? 0) >=
				(openOrderTracker.getOpenOrder({ element: best }) ?? 0)
		) {
			return dialog;
		}
		return best;
	}, null);
	if (!topmost) {
		return { type: 'in-place' };
	}
	return { type: 'dialog', dialog: topmost };
}

/**
 * __Dialog aware portal__
 *
 * Portals its children into the topmost open `Dialog`, so that the dialog does not make them inert.
 * With no `Dialog` open, it renders them in place.
 *
 * A modal `<dialog>` makes everything outside it inert, popovers too, even when they paint above
 * it. Use this portal for a layer that is not part of a `Dialog`, but must stay usable while one is
 * open (for example the flag group). Put the whole layer (for example a `Popover`) inside it.
 *
 * - It picks its place once, in its first render, from the `Dialog`s that are open then.
 * - It does not move into a `Dialog` that opens later, or in the same commit. Its children are inert
 *   until that dialog closes. See `notes/decisions/dialog-covers-what-was-open-before.md`.
 * - When the dialog it picked closes, it picks again: the topmost open `Dialog` outside the closed
 *   one, or in place. A move remounts the children. A popover shows again, and its state resets.
 *   If that dialog closes in the commit that mounts the portal, it picks again before paint.
 * - A move does not take focus. The browser returns focus in `close()`, before the move.
 * - React context and React events follow the React tree, not the dialog.
 * - Nothing renders on the server or while hydrating. It picks after hydration.
 */
export function DialogAwarePortal({ children }: { children: ReactNode }): ReactNode {
	const canReadDocument = useSyncExternalStore(
		subscribeToNothing,
		getClientSnapshot,
		getServerSnapshot,
	);
	// Pick in the first render, so the children are in the document in the first commit, and the
	// mount effects of their parents can reach them. The children have not rendered yet, so none of
	// their own dialogs is a candidate.
	const [target, setTarget] = useState<TPortalTarget>(() => {
		if (!canReadDocument) {
			return { type: 'not-picked' };
		}
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- the portal has no element of its own before it picks
		return pickTarget({ ownerDocument: document, leavingDialog: null });
	});

	// After hydration, where the first render could not read the document. The children have not
	// rendered yet.
	useEffect(() => {
		setTarget((current) => {
			if (current.type !== 'not-picked') {
				return current;
			}
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- the portal has no element of its own before it picks
			return pickTarget({ ownerDocument: document, leavingDialog: null });
		});
	}, []);

	const pickedDialog = target.type === 'dialog' ? target.dialog : null;
	useLayoutEffect(() => {
		if (!pickedDialog) {
			return;
		}
		// The dialog closed in the commit that rendered the children into it (for example, a submit
		// handler that shows a flag and closes the modal). Pick again now, before paint. The `close`
		// task can come after a frame (Firefox), and the children would render in the closing dialog.
		if (!pickedDialog.open || !pickedDialog.hasAttribute(openRequestedAttribute)) {
			setTarget(
				pickTarget({ ownerDocument: pickedDialog.ownerDocument, leavingDialog: pickedDialog }),
			);
			return;
		}
		return bind(pickedDialog, {
			// `close` does not bubble, so a dialog that the children render does not fire it here.
			type: 'close',
			listener() {
				// `Dialog` showed it again after a close that it did not ask for.
				if (pickedDialog.open) {
					return;
				}
				setTarget(
					pickTarget({ ownerDocument: pickedDialog.ownerDocument, leavingDialog: pickedDialog }),
				);
			},
		});
	}, [pickedDialog]);

	if (target.type === 'not-picked') {
		return null;
	}
	if (target.type === 'in-place') {
		return children;
	}
	return createPortal(children, target.dialog);
}
