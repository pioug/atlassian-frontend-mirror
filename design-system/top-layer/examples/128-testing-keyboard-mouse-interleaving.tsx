import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingKeyboardMouseInterleaving() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button
						type="button"
						data-testid="trigger"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						Toggle popup
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Interleaving test">
					<div data-testid="popover-content">
						<button type="button" data-testid="inner-button">
							Inner action
						</button>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
