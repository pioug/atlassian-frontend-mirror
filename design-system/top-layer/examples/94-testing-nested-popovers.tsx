import React from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

export default function TestingNestedPopups(): React.JSX.Element {
	return (
		<div>
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="first-trigger">
						Open first
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="First">
					<div data-testid="first-popover">
						First popover
						<Popup placement={{ axis: 'inline', edge: 'end' }} onClose={() => {}}>
							<Popup.Trigger>
								<button type="button" data-testid="second-trigger">
									Open second
								</button>
							</Popup.Trigger>
							<Popup.Content role="dialog" label="Second">
								<div data-testid="second-popover">Second popover</div>
							</Popup.Content>
						</Popup>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
