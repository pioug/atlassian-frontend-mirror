import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, type Space, Stack } from '@atlaskit/primitives';

const spacingValues: Space[] = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
];

/**
 * Box permutations
 */
export default (): React.JSX.Element => {
	return (
		<Stack space="space.400" alignInline="start" testId="box-padding">
			<Stack space="space.200" testId="box-with-background-and-padding">
				<Heading size="medium">padding</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box key={space} backgroundColor="color.background.discovery.bold" padding={space}>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-background-and-paddingBlock">
				<Heading size="medium">paddingBlock</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box key={space} backgroundColor="color.background.discovery.bold" paddingBlock={space}>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-background-and-paddingBlockStart">
				<Heading size="medium">paddingBlockStart</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box
							key={space}
							backgroundColor="color.background.discovery.bold"
							paddingBlockStart={space}
						>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-background-and-paddingBlockEnd">
				<Heading size="medium">paddingBlockEnd</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box
							key={space}
							backgroundColor="color.background.discovery.bold"
							paddingBlockEnd={space}
						>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Inline space="space.600">
				<Stack space="space.200" testId="box-with-background-and-paddingInline">
					<Heading size="medium">paddingInline</Heading>
					<Stack space="space.200" alignInline="center">
						{spacingValues.map((space) => (
							<Box
								key={space}
								backgroundColor="color.background.discovery.bold"
								paddingInline={space}
							>
								<Box backgroundColor="elevation.surface">{space}</Box>
							</Box>
						))}
					</Stack>
				</Stack>

				<Stack space="space.200" testId="box-with-background-and-paddingInlineStart">
					<Heading size="medium">paddingInlineStart</Heading>
					<Stack space="space.200" alignInline="center">
						{spacingValues.map((space) => (
							<Box
								key={space}
								backgroundColor="color.background.discovery.bold"
								paddingInlineStart={space}
							>
								<Box backgroundColor="elevation.surface">{space}</Box>
							</Box>
						))}
					</Stack>
				</Stack>

				<Stack space="space.200" testId="box-with-background-and-paddingInlineEnd">
					<Heading size="medium">paddingInlineEnd</Heading>
					<Stack space="space.200" alignInline="center">
						{spacingValues.map((space) => (
							<Box
								key={space}
								backgroundColor="color.background.discovery.bold"
								paddingInlineEnd={space}
							>
								<Box backgroundColor="elevation.surface">{space}</Box>
							</Box>
						))}
					</Stack>
				</Stack>
			</Inline>

			<Stack space="space.200" testId="box-with-background-and-overlapping-padding-props">
				<Heading size="medium">overlapping padding props</Heading>
				<Box
					backgroundColor="color.background.discovery.bold"
					padding="space.100"
					paddingBlock="space.200"
					paddingInlineStart="space.300"
				>
					<Box backgroundColor="elevation.surface" padding="space.050">
						padding
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};
