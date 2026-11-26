import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled/box';
import { PopupSelect } from '@atlaskit/select/popup-select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

/**
 * Test fixture: a `PopupSelect` that gets `isOpen` only while it is open (`true` or `undefined`),
 * as some product filters do. `isOpen` is `undefined` at mount, so the popup is not controlled: a
 * pick and Escape close it.
 */
export default function TestingPopupSelectOpenOnly(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box padding="space.500">
			<PopupSelect
				options={options}
				label="Cities"
				testId="popup-select"
				isOpen={isOpen ? true : undefined}
				onMenuClose={() => setIsOpen(false)}
				target={({ isOpen: _isOpen, ...triggerProps }) => (
					<Button {...triggerProps} testId="trigger" onClick={() => setIsOpen(true)}>
						Choose a city
					</Button>
				)}
			/>
		</Box>
	);
}
