import React, { useRef, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';

/**
 * Test fixture: a dialog with a dialog inside it. A button in the inner dialog closes only the outer
 * one, and the inner owner keeps `isOpen` `true`, as when a modal draws a second modal inside it.
 * Closing the outer dialog closes the inner one too, so the page is not left inert.
 *
 * "Close the outer dialog, then focus Outside" focuses the "Outside" button when the outer exit
 * finishes, as product code that focuses a trigger after a close does. `focus-after-exit` shows
 * whether it took focus.
 *
 * `inner-close-requests` counts the inner `onClose` calls, and `inner-exits` counts the inner
 * `onExitFinish` calls.
 */
export default function TestingDialogClosesNestedDialogs(): React.ReactNode {
	const [isOuterOpen, setIsOuterOpen] = useState(false);
	const [isInnerOpen, setIsInnerOpen] = useState(false);
	const [focusAfterExit, setFocusAfterExit] = useState('');
	const [innerCloseRequests, setInnerCloseRequests] = useState(0);
	const [innerExits, setInnerExits] = useState(0);
	const outsideRef = useRef<HTMLButtonElement>(null);
	const shouldFocusOutsideRef = useRef(false);

	function onOuterExitFinish() {
		if (!shouldFocusOutsideRef.current) {
			return;
		}
		shouldFocusOutsideRef.current = false;
		const outside = outsideRef.current;
		outside?.focus();
		setFocusAfterExit(outside && outside === document.activeElement ? 'outside' : 'not outside');
	}

	return (
		<div>
			<button type="button" data-testid="outer-trigger" onClick={() => setIsOuterOpen(true)}>
				Open outer dialog
			</button>
			<button ref={outsideRef} type="button" data-testid="outside">
				Outside
			</button>
			<output data-testid="focus-after-exit">{focusAfterExit}</output>
			<output data-testid="inner-close-requests">{innerCloseRequests}</output>
			<output data-testid="inner-exits">{innerExits}</output>
			<Dialog
				isOpen={isOuterOpen}
				onClose={() => setIsOuterOpen(false)}
				onExitFinish={onOuterExitFinish}
				label="Outer dialog"
				testId="outer-dialog"
			>
				<button type="button" data-testid="inner-trigger" onClick={() => setIsInnerOpen(true)}>
					Open inner dialog
				</button>
				<Dialog
					isOpen={isInnerOpen}
					onClose={() => {
						setInnerCloseRequests((count) => count + 1);
						setIsInnerOpen(false);
					}}
					onExitFinish={() => setInnerExits((count) => count + 1)}
					label="Inner dialog"
					testId="inner-dialog"
				>
					<button type="button" data-testid="close-outer" onClick={() => setIsOuterOpen(false)}>
						Close the outer dialog
					</button>
					<button
						type="button"
						data-testid="close-outer-then-focus-outside"
						onClick={() => {
							shouldFocusOutsideRef.current = true;
							setIsOuterOpen(false);
						}}
					>
						Close the outer dialog, then focus Outside
					</button>
				</Dialog>
			</Dialog>
		</div>
	);
}
