import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingPopupEscape() {
	const [closedBy, setClosedBy] = useState<string | null>(null);

	const handleClose = useCallback(() => {
		setClosedBy('light-dismiss');
	}, []);

	return (
		<div>
			{closedBy && <div data-testid="close-reason">{closedBy}</div>}
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Escape test">
					<div data-testid="popover-content">Press Escape to close</div>
				</Popup.Content>
			</Popup>
			<button type="button" data-testid="outside-target">
				Outside
			</button>
		</div>
	);
}
