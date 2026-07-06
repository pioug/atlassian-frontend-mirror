import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';

/**
 * A modal `Dialog` rendered inside another modal `Dialog`'s subtree. Each
 * `onClose` closes only its own dialog, so a test can detect exactly which
 * dialog responded to Escape.
 */
export default function TestingNestedDialogEscape(): React.ReactNode {
	const [isOuterOpen, setIsOuterOpen] = useState(false);
	const [isInnerOpen, setIsInnerOpen] = useState(false);

	const closeOuter = useCallback(() => {
		setIsOuterOpen(false);
	}, []);

	const closeInner = useCallback(() => {
		setIsInnerOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="open-outer" onClick={() => setIsOuterOpen(true)}>
				Open outer dialog
			</button>

			<Dialog onClose={closeOuter} isOpen={isOuterOpen} label="Outer dialog" testId="outer-dialog">
				<div data-testid="outer-content">Outer dialog content</div>
				<button type="button" data-testid="open-inner" onClick={() => setIsInnerOpen(true)}>
					Open inner dialog
				</button>
				<button type="button" data-testid="close-outer" onClick={closeOuter}>
					Close outer
				</button>

				<Dialog
					onClose={closeInner}
					isOpen={isInnerOpen}
					label="Inner dialog"
					testId="inner-dialog"
				>
					<div data-testid="inner-content">Inner dialog content</div>
					<button type="button" data-testid="close-inner" onClick={closeInner}>
						Close inner
					</button>
				</Dialog>
			</Dialog>
		</div>
	);
}
