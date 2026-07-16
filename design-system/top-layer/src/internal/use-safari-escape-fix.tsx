import { type RefObject, useEffect, useMemo, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { isSafari } from '@atlaskit/ds-lib/is-safari';

/**
 * Safari-only guard: WebKit fires dialog `cancel` on Escape even when a child
 * `auto`/`hint` popover consumed it, closing the dialog too.
 * See notes/decisions/safari-escape-nested-popover-in-dialog.md
 */
export function useSafariEscapeFix({
	dialogRef,
	isVisible,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	isVisible: boolean;
}): { shouldIgnoreEscape: () => boolean } {
	const childPopoverOpenAtEscapeRef = useRef(false);

	useEffect(() => {
		if (!isSafari()) {
			return;
		}
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}

		// Bind to `document`, not the dialog: on Safari focus can be on `<body>`
		// (buttons are not focused on click), where a dialog-scoped listener would
		// never fire. The query below stays scoped to this dialog's subtree.
		return bind(document, {
			type: 'keydown',
			listener(event) {
				if (event.key !== 'Escape') {
					return;
				}
				try {
					childPopoverOpenAtEscapeRef.current = Boolean(
						dialog.querySelector('[popover="auto"]:popover-open, [popover="hint"]:popover-open'),
					);
				} catch {
					// `:popover-open` is unsupported in some environments (e.g. jsdom);
					// treat as "no child popover" so a plain Escape still closes the dialog.
					childPopoverOpenAtEscapeRef.current = false;
				}
			},
			options: { capture: true },
		});
	}, [dialogRef, isVisible]);

	const api = useMemo(() => {
		return {
			shouldIgnoreEscape(): boolean {
				if (childPopoverOpenAtEscapeRef.current) {
					childPopoverOpenAtEscapeRef.current = false;
					return true;
				}
				return false;
			},
		};
	}, []);

	return api;
}
