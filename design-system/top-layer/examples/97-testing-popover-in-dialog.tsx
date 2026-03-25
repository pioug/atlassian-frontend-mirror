import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';
import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingPopupInDialog() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<Dialog onClose={handleClose} isOpen={isOpen} label="Dialog with popover" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<Popup placement={{ edge: 'end' }} onClose={() => {}}>
					<Popup.Trigger>
						<button type="button" data-testid="popover-trigger">
							Open popover
						</button>
					</Popup.Trigger>
					<Popup.Content role="menu" label="Actions">
						<div data-testid="popover-content">
							<button type="button" role="menuitem">
								Action one
							</button>
							<button type="button" role="menuitem">
								Action two
							</button>
						</div>
					</Popup.Content>
				</Popup>
			</Dialog>
		</div>
	);
}
