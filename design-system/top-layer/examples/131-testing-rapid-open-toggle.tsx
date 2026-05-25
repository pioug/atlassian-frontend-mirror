import React, { useState } from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Controlled-`isOpen` popover with an external rapid-toggle button. Drives
 * a rapid `open -> close -> open` sequence inside a single frame to
 * exercise the RAF cancel + element-identity guard in `useInitialFocus`.
 */
export default function TestingRapidOpenToggle(): React.JSX.Element {
	const [seq, setSeq] = useState(0);

	function rapidToggle() {
		// Fire three state updates in a row - React batches them into a
		// single render, but if any of them missed the cancel, the queued
		// RAF from the first open would focus the wrong popover instance.
		setSeq((n) => n + 1);
		setSeq((n) => n + 1);
		setSeq((n) => n + 1);
	}

	return (
		<div>
			<button type="button" data-testid="rapid-toggle" onClick={rapidToggle}>
				Rapid toggle
			</button>
			<Popup>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open popover
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label={`Rapid toggle ${seq}`}>
					<div data-testid="popover-content">
						<button type="button" data-testid="popover-button">
							Inner action
						</button>
					</div>
				</Popup.Content>
			</Popup>
			<button type="button" data-testid="outside-button">
				Outside
			</button>
		</div>
	);
}
