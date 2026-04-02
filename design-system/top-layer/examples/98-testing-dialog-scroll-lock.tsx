/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';

const tallContentStyles = css({
	height: '300vh',
	background: 'linear-gradient(to bottom, #eee, #ccc)',
});

/**
 * Test example for DialogScrollLock.
 * Renders a tall page (scrollable body) with a dialog trigger.
 * When the dialog is open, DialogScrollLock should prevent body scrolling.
 */
export default function TestingDialogScrollLock(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>

			{/* Tall content to make the page scrollable */}
			<div data-testid="tall-content" css={tallContentStyles}>
				Tall content to ensure the page is scrollable
			</div>

			<Dialog onClose={handleClose} isOpen={isOpen} labelledBy="dialog-title" testId="dialog">
				<DialogScrollLock />
				<Heading size="large" id="dialog-title">
					Scroll lock test
				</Heading>
				<div data-testid="dialog-body">Dialog is open — body should not scroll.</div>
				<button type="button" aria-label="Close" onClick={handleClose}>
					&#x2715;
				</button>
			</Dialog>
		</div>
	);
}
