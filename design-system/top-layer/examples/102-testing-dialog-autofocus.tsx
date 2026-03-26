import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';

/**
 * Test fixture for verifying autofocus behavior in dialog.
 *
 * Variant 1 (default): A dialog with the native HTML `autofocus` attribute on
 * a non-first button. The browser's dialog focusing algorithm should focus the
 * element with `autofocus` rather than the first focusable element.
 *
 * Note: React's `autoFocus` prop does not set the HTML `autofocus` attribute —
 * it calls `.focus()` imperatively after mount. We use a ref callback to set
 * the native attribute so that `showModal()` respects it during the dialog
 * focusing steps.
 *
 * Variant 2 (override): A dialog where the consumer uses `getFirstFocusable`
 * to override the browser's autofocus behavior, explicitly moving focus to
 * the first focusable element even when another element has `autofocus`.
 */
export default function TestingDialogAutofocus() {
	const [variant, setVariant] = useState<'default' | 'override' | null>(null);

	return (
		<div>
			<button type="button" data-testid="open-default" onClick={() => setVariant('default')}>
				Open (autofocus)
			</button>
			<button type="button" data-testid="open-override" onClick={() => setVariant('override')}>
				Open (override with getFirstFocusable)
			</button>
			{variant === 'default' && (
				<AutofocusDialog onClose={() => setVariant(null)} useOverride={false} />
			)}
			{variant === 'override' && (
				<AutofocusDialog onClose={() => setVariant(null)} useOverride={true} />
			)}
		</div>
	);
}

function AutofocusDialog({ onClose, useOverride }: { onClose: () => void; useOverride: boolean }) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const autofocusRef = useCallback((node: HTMLButtonElement | null) => {
		if (node) {
			// Set the native HTML autofocus attribute so that the browser's dialog
			// focusing algorithm (used by showModal()) will focus this element.
			node.setAttribute('autofocus', '');
		}
	}, []);
	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	useEffect(() => {
		if (useOverride && dialogRef.current) {
			const first = getFirstFocusable({ container: dialogRef.current });
			if (first) {
				first.focus();
			}
		}
	}, [useOverride]);

	return (
		<Dialog ref={dialogRef} onClose={handleClose} isOpen label="Autofocus test" testId="dialog">
			<button type="button" aria-label="Close" data-testid="close-button" onClick={onClose}>
				&#x2715;
			</button>
			<button type="button" data-testid="button-first">
				First
			</button>
			<button type="button" data-testid="button-autofocus" ref={autofocusRef}>
				Autofocused
			</button>
			<button type="button" data-testid="button-last">
				Last
			</button>
		</Dialog>
	);
}
