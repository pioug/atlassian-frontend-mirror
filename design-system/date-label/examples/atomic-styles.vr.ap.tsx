import React from 'react';

import { DateLabelDropdownTrigger } from '@atlaskit/date-label/date-label';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

export default function AtomicStyles(): React.JSX.Element {
	return (
		<Stack space="space.300">
			<Inline space="space.300">
				<Stack space="space.100">
					<Text>Neutral</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" />
				</Stack>
				<Stack space="space.100">
					<Text>Warning</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" />
				</Stack>
				<Stack space="space.100">
					<Text>Danger</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" />
				</Stack>
			</Inline>
			<Inline space="space.300">
				<Stack space="space.100">
					<Text>Neutral, spacious</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" isSpacious />
				</Stack>
				<Stack space="space.100">
					<Text>Warning, spacious</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" isSpacious />
				</Stack>
				<Stack space="space.100">
					<Text>Danger, spacious</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" isSpacious />
				</Stack>
			</Inline>
			<Inline space="space.300">
				<Stack space="space.100">
					<Text>Neutral, selected</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" isSelected />
				</Stack>
				<Stack space="space.100">
					<Text>Warning, selected</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" isSelected />
				</Stack>
				<Stack space="space.100">
					<Text>Danger, selected</Text>
					<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" isSelected />
				</Stack>
			</Inline>
			<Inline space="space.300">
				<Stack space="space.100">
					<Text>Neutral, no leading icon</Text>
					<DateLabelDropdownTrigger
						label="29 Jul 2026"
						appearance="neutral"
						hasIconBefore={false}
					/>
				</Stack>
				<Stack space="space.100">
					<Text>Neutral, spacious, no leading icon</Text>
					<DateLabelDropdownTrigger
						label="29 Jul 2026"
						appearance="neutral"
						isSpacious
						hasIconBefore={false}
					/>
				</Stack>
			</Inline>
		</Stack>
	);
}
