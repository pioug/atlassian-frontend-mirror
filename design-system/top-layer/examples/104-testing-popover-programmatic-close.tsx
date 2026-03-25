import React, { useCallback, useRef, useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for programmatic popover close via `hidePopover()`.
 */
export default function TestingPopoverProgrammaticClose() {
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const [closed, setClosed] = useState(false);

	const handleClose = useCallback(() => {
		setClosed(true);
	}, []);

	const handleProgrammaticClose = useCallback(() => {
		popoverRef.current?.hidePopover();
	}, []);

	return (
		<div>
			{closed && <div data-testid="close-indicator">closed</div>}
			<Popup placement={{ edge: 'end' }} onClose={handleClose}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content ref={popoverRef} role="dialog" label="Programmatic close test">
					<div data-testid="popover-content">
						<button
							type="button"
							data-testid="programmatic-close-button"
							onClick={handleProgrammaticClose}
						>
							Close programmatically
						</button>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
