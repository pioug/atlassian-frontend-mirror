import React from 'react';

import { Popup } from '@atlaskit/top-layer/popup';

/**
 * Outer dialog with a nested manual-mode popover inside its content.
 * Used to verify that the outer's `getFocusables` does NOT return the
 * inner's focusables - the inner button stays in the inner scope even
 * when the inner popover is open.
 */
export default function TestingNestedFocusScope(): React.JSX.Element {
	return (
		<div>
			<Popup>
				<Popup.Trigger>
					<button type="button" data-testid="outer-trigger">
						Open outer
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Outer">
					<div data-testid="outer-popover">
						<button type="button" data-testid="outer-button-a">
							Outer A
						</button>
						<Popup mode="manual">
							<Popup.Trigger>
								<button type="button" data-testid="inner-trigger">
									Inner trigger
								</button>
							</Popup.Trigger>
							<Popup.Content role="dialog" label="Inner">
								<div data-testid="inner-popover">
									<button type="button" data-testid="inner-button">
										Inner action
									</button>
								</div>
							</Popup.Content>
						</Popup>
						<button type="button" data-testid="outer-button-b">
							Outer B
						</button>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
