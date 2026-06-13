import React from 'react';

import Button from '@atlaskit/button/new';
import { PopupSelect } from '@atlaskit/select';

const options = [
	{ value: 'option-1', label: 'Option 1' },
	{ value: 'option-2', label: 'Option 2' },
	{ value: 'option-3', label: 'Option 3' },
];

/**
 * Test fixture: exercises the initial-focus behavior for `PopupSelect`
 * running on the top-layer path.
 *
 * `PopupSelect` renders react-select inside a `role="dialog"` popover.
 * `top-layer/useInitialFocus` therefore focuses the first focusable
 * element inside the popover — which is the react-select search input.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	return (
		<div>
			<PopupSelect
				options={options}
				testId="initial-focus-popup-select"
				target={({ isOpen, ...triggerProps }) => (
					<Button {...triggerProps} isSelected={isOpen} testId="initial-focus-popup-select-trigger">
						Open popup select
					</Button>
				)}
			/>
		</div>
	);
}
