import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';
import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for multi-level nested focus return.
 * Verifies that focus returns to the correct trigger at each nesting level.
 *
 * Structure:
 * - Button opens Dialog (level 1)
 * - Inside Dialog, button opens Popup (level 2)
 * - Inside Popup, button opens another Popup (level 3)
 *
 * On dismiss, focus should return to trigger at each level.
 */
export default function TestingNestedFocusReturn(): React.JSX.Element {
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDialogClose = useCallback(() => {
		setDialogOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setDialogOpen(true)}>
				Open dialog
			</button>
			<Dialog
				onClose={handleDialogClose}
				isOpen={dialogOpen}
				label="Level 1: Dialog"
				testId="dialog"
			>
				<button type="button" aria-label="Close" onClick={() => setDialogOpen(false)}>
					&#x2715;
				</button>
				<Popup placement={{ edge: 'end' }} onClose={() => {}}>
					<Popup.Trigger>
						<button type="button" data-testid="popover-trigger-1">
							Open popover (level 2)
						</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="Level 2">
						<div data-testid="popover-content-1">
							<Popup placement={{ axis: 'inline', edge: 'end' }} onClose={() => {}}>
								<Popup.Trigger>
									<button type="button" data-testid="popover-trigger-2">
										Open popover (level 3)
									</button>
								</Popup.Trigger>
								<Popup.Content role="dialog" label="Level 3">
									<div data-testid="popover-content-2">
										<button type="button" data-testid="level-3-button">
											Level 3 button
										</button>
									</div>
								</Popup.Content>
							</Popup>
						</div>
					</Popup.Content>
				</Popup>
			</Dialog>
		</div>
	);
}
