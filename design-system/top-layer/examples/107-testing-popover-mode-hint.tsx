import React from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Example for browser tests: Popup with mode="hint".
 * In browsers that do not support popover="hint" (e.g. Safari), the component
 * falls back to popover="auto". The test asserts that fallback in webkit.
 */
export default function TestingPopupModeHint(): React.JSX.Element {
	return (
		<Popup placement={{ edge: 'end' }} onClose={() => {}} mode="hint">
			<Popup.Trigger>
				<button type="button" data-testid="popover-trigger">
					Open
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Test popover">
				<div data-testid="popover-content">Popup content (mode=hint)</div>
			</Popup.Content>
		</Popup>
	);
}
