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
 * Test fixture: exercises the mount-time open path of
 * `top-layer/useInitialFocus` for `PopupSelect`.
 *
 * The PopupSelect is mounted with `defaultIsOpen`, so the popover is open
 * before any user interaction. The combobox carve-out still applies, so
 * focus must land on the search input on mount.
 *
 * This fixture is intentionally isolated to a single PopupSelect so the
 * spec is not racing a sibling popover's light-dismiss / focus-restoration
 * against the assertion under test. See sibling fixture
 * `97-testing-initial-focus-matrix.tsx` for the click-to-open path.
 *
 * The trigger is wrapped in a labelled region and the search input is given
 * an accessible name via `searchProps.inputId` + an associated label, so the
 * fixture passes axe checks without needing `skipAxeCheck()`.
 */
export default function TestingInitialFocusDefaultOpen(): React.ReactNode {
	return (
		<Box padding="space.200">
			<Stack space="space.100">
				<label htmlFor="default-open-popup-select-input">Choose an option</label>
				<PopupSelect
					options={options}
					testId="default-open-popup-select"
					searchThreshold={0}
					inputId="default-open-popup-select-input"
					aria-label="Choose an option"
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
