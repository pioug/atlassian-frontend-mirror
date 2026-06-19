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
 * Test fixture: exercises the click-to-open path of
 * `top-layer/useInitialFocus` for `PopupSelect`.
 *
 * `PopupSelect` renders react-select inside a `role="dialog"` popover.
 * `top-layer/useInitialFocus` therefore focuses the first focusable
 * element inside the popover, which is the react-select search input.
 *
 * The PopupSelect is closed on mount; user activation opens it. The
 * combobox carve-out keeps focus on the search input.
 *
 * This fixture is intentionally isolated to a single PopupSelect so the
 * spec is not racing a sibling popover's light-dismiss / focus-restoration
 * against the assertion under test. See sibling fixture
 * `98-testing-initial-focus-default-open.tsx` for the `defaultIsOpen`
 * mount-time open path.
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
			</Stack>
		</Box>
	);
}
