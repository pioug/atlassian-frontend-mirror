import React from 'react';

import Button from '@atlaskit/button/new';
import { Box, Stack } from '@atlaskit/primitives/compiled';
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
 * element inside the popover, which is the react-select search input.
 *
 * Two PopupSelects are rendered:
 *
 * - `initial-focus-popup-select`: closed on mount; user activation
 *   opens it. The combobox carve-out keeps focus on the search input.
 *
 * - `default-open-popup-select`: mounted with `defaultIsOpen` so the
 *   popover is open before any user interaction. This exercises the
 *   mount-time open path of `useInitialFocus`. The combobox carve-out
 *   still applies, so focus must land on the search input on mount.
 *
 * The trigger is wrapped in a labelled region and the search input is given
 * an accessible name via `searchProps.inputId` + an associated label, so the
 * fixture passes axe checks without needing `skipAxeCheck()`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	return (
		<Box padding="space.200">
			<Stack space="space.100">
				<label htmlFor="initial-focus-popup-select-input">Choose an option</label>
				<PopupSelect
					options={options}
					testId="initial-focus-popup-select"
					searchThreshold={0}
					inputId="initial-focus-popup-select-input"
					aria-label="Choose an option"
					target={({ isOpen, ...triggerProps }) => (
						<Button
							{...triggerProps}
							isSelected={isOpen}
							testId="initial-focus-popup-select-trigger"
						>
							Open popup select
						</Button>
					)}
				/>

				<label htmlFor="default-open-popup-select-input">Choose another option</label>
				<PopupSelect
					options={options}
					testId="default-open-popup-select"
					searchThreshold={0}
					inputId="default-open-popup-select-input"
					aria-label="Choose another option"
					defaultIsOpen
					target={({ isOpen, ...triggerProps }) => (
						<Button
							{...triggerProps}
							isSelected={isOpen}
							testId="default-open-popup-select-trigger"
						>
							Open default-open popup select
						</Button>
					)}
				/>
			</Stack>
		</Box>
	);
}
