import React from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingPopupBasic(): React.JSX.Element {
	return (
		<Popup placement={{ edge: 'end' }} onClose={() => {}}>
			<Popup.Trigger>
				<button type="button" data-testid="popover-trigger">
					Open
				</button>
			</Popup.Trigger>
			<Popup.Content role="dialog" label="Test popover">
				<div data-testid="popover-content">Popup content</div>
			</Popup.Content>
		</Popup>
	);
}
