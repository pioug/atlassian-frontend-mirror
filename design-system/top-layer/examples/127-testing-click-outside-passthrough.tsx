import React, { useCallback, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingClickOutsidePassthrough() {
	const [closeCount, setCloseCount] = useState(0);
	const [outsideClickCount, setOutsideClickCount] = useState(0);

	const handleClose = useCallback(() => {
		setCloseCount((c) => c + 1);
	}, []);

	return (
		<div>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="outside-click-count">{outsideClickCount}</div>
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Click passthrough test">
					<div data-testid="popover-content">Popup content</div>
				</Popup.Content>
			</Popup>
			<button
				type="button"
				data-testid="outside-button"
				onClick={() => setOutsideClickCount((c) => c + 1)}
			>
				Outside button
			</button>
		</div>
	);
}
