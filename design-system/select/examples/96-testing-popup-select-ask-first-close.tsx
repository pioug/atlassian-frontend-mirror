import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { PopupSelect } from '@atlaskit/select/popup-select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

/**
 * Test fixture: on the top layer, a controlled `PopupSelect` asks `onClose` first, and closes only
 * when `isOpen` becomes `false`. The "Refuse close" switch makes `onClose` refuse. A pick and Tab do
 * not ask: the "Close on pick" switch makes `onChange` close the popup. The log counts each close
 * request while the popup is open, and each pick.
 *
 * See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */
export default function TestingPopupSelectAskFirstClose(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isRefusing, setIsRefusing] = useState(false);
	const [isClosingOnPick, setIsClosingOnPick] = useState(false);
	const [log, setLog] = useState<string[]>([]);

	return (
		<Box padding="space.500">
			<Stack space="space.200">
				<Inline space="space.100">
					<Button
						testId="refuse"
						isSelected={isRefusing}
						onClick={() => setIsRefusing(!isRefusing)}
					>
						Refuse close
					</Button>
					<Button
						testId="close-on-pick"
						isSelected={isClosingOnPick}
						onClick={() => setIsClosingOnPick(!isClosingOnPick)}
					>
						Close on pick
					</Button>
					<Button testId="outside">Outside</Button>
				</Inline>
				<Inline space="space.100">
					<PopupSelect
						options={options}
						label="Cities"
						testId="popup-select"
						isOpen={isOpen}
						onOpen={() => setIsOpen(true)}
						onClose={() => {
							// `PopupSelect` also calls `onClose` when `isOpen` becomes `false`.
							if (!isOpen) {
								return;
							}
							setLog((current) => [...current, 'close']);
							if (!isRefusing) {
								setIsOpen(false);
							}
						}}
						onChange={() => {
							setLog((current) => [...current, 'change']);
							if (isClosingOnPick) {
								setIsOpen(false);
							}
						}}
						target={({ isOpen: _isOpen, ...triggerProps }) => (
							<Button {...triggerProps} testId="trigger">
								Choose a city
							</Button>
						)}
					/>
					<Button testId="after">After</Button>
				</Inline>
				<Text as="p" testId="close-log">
					{log.join(' ')}
				</Text>
			</Stack>
		</Box>
	);
}
