import React from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Test fixture for verifying DOM order.
 * The popover content should be a DOM sibling of the trigger,
 * NOT rendered to the end of document.body via a portal.
 *
 * This is critical for WCAG 1.3.2 Meaningful Sequence.
 */
export default function TestingDomOrder(): React.JSX.Element {
	return (
		<div data-testid="container">
			<div data-testid="before-content">Content before trigger</div>
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open popover
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="DOM order test">
					<div data-testid="popover-content">Popup content</div>
				</Popup.Content>
			</Popup>
			<div data-testid="after-content">Content after trigger</div>
		</div>
	);
}
