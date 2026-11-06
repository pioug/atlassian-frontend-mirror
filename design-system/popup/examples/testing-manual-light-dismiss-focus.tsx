import React, { useState } from 'react';

import { Popup } from '@atlaskit/popup/popup';
import { type TriggerProps } from '@atlaskit/popup/types';

/**
 * Test fixture: an outside press on a `mode="manual"` popup does not return focus to the trigger,
 * as with native light dismiss. "Press without focus" cancels `mousedown`, so the press leaves
 * focus inside the popup.
 */
export default function TestingManualLightDismissFocus(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<button
				type="button"
				data-testid="press-without-focus"
				// Stands in for an element that keeps focus where it is on press.
				onMouseDown={(event) => event.preventDefault()}
			>
				Press without focus
			</button>
			<Popup
				mode="manual"
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				role="dialog"
				label="Manual popup"
				testId="manual-popup"
				trigger={(triggerProps: TriggerProps) => (
					<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
						Open manual popup
					</button>
				)}
				content={() => (
					<button type="button" data-testid="manual-popup-inside">
						Inside
					</button>
				)}
			/>
		</div>
	);
}
