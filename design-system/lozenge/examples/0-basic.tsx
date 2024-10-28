import React from 'react';

import Lozenge, { type ThemeAppearance } from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';

const APPEARANCES: { label: string; value: ThemeAppearance }[] = [
	{ label: 'Default', value: 'default' },
	{ label: 'Success', value: 'success' },
	{ label: 'Removed', value: 'removed' },
	{ label: 'In Progress', value: 'inprogress' },
	{ label: 'New', value: 'new' },
	{ label: 'Moved', value: 'moved' },
];

export default () => (
	<Stack testId="test-container" space="space.400">
		<Inline space="space.400">
			<Stack space="space.100">
				<Text weight="medium">Subtle</Text>
				<>
					{APPEARANCES.map((a) => (
						<Box key={a.value}>
							<Lozenge appearance={a.value} testId="lozenge-subtle">
								{a.label}
							</Lozenge>
						</Box>
					))}
				</>
			</Stack>
			<Stack space="space.100">
				<Text weight="medium">Bold</Text>
				<>
					{APPEARANCES.map((a) => (
						<Box key={a.value}>
							<Lozenge appearance={a.value} isBold testId="lozenge-bold">
								{a.label}
							</Lozenge>
						</Box>
					))}
				</>
			</Stack>
		</Inline>

		<Stack space="space.100">
			<Text weight="medium">Overflowed Lozenge</Text>
			<Box>
				<Lozenge testId="lozenge-truncated">Long text will be truncated after a point.</Lozenge>
			</Box>
			<Box>
				<Lozenge appearance="new" maxWidth={250} testId="lozenge-truncated-custom-width">
					Long text will be truncated after a point.
				</Lozenge>
			</Box>
		</Stack>

		<Stack space="space.100">
			<Text weight="medium">Defaults</Text>
			<Box>
				<Lozenge maxWidth="none" testId="lozenge-defaults">
					Default appearance and boldness
				</Lozenge>
			</Box>
		</Stack>
	</Stack>
);
