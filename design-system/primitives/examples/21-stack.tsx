import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end'] as const;
const spreadItems = ['space-between'] as const;
const spaceItems = [
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
] as const;

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const Block = () => (
	<Box xcss={blockStyles} padding="space.200" backgroundColor="color.background.discovery.bold" />
);

const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'border.radius.050',
});

/**
 * Stack permutations.
 */
export default () => (
	<Box padding="space.200">
		<Stack space="space.400">
			<Stack space="space.300" alignInline="start">
				<Heading size="large" as="h2">
					Stack
				</Heading>
				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Align Block
						</Heading>
						<Inline spread="space-between" space="space.400">
							{alignBlockItems.map((alignBlock) => (
								<Stack key={alignBlock} space="space.050" alignInline="center">
									{alignBlock}

									<Box
										xcss={containerStyles}
										padding="space.050"
										backgroundColor="color.background.neutral"
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											height: '200px',
										}}
									>
										<Stack space="space.050" alignBlock={alignBlock}>
											<Block />
											<Block />
											<Block />
										</Stack>
									</Box>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>

				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Spread
						</Heading>
						<Inline spread="space-between" space="space.400">
							{spreadItems.map((spread) => (
								<Stack key={spread} space="space.050" alignInline="start">
									{spread}

									<Box
										xcss={containerStyles}
										padding="space.050"
										backgroundColor="color.background.neutral"
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											height: '200px',
										}}
									>
										<Stack space="space.050" spread={spread}>
											<Block />
											<Block />
											<Block />
										</Stack>
									</Box>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>

				<section>
					<Heading size="medium" as="h3">
						Align Inline
					</Heading>
					<Inline space="space.100">
						{alignInlineItems.map((alignInline) => (
							<Stack key={alignInline} alignInline="center">
								{alignInline}
								<Box
									xcss={blockStyles}
									padding="space.050"
									backgroundColor="color.background.neutral"
									style={{
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
										width: '200px',
									}}
								>
									<Stack grow="fill" alignInline={alignInline} space="space.050">
										<Block />
										<Block />
										<Block />
									</Stack>
								</Box>
							</Stack>
						))}
					</Inline>
				</section>

				<section>
					<Stack space="space.100">
						<Heading size="medium" as="h3">
							Space
						</Heading>
						<Inline space="space.200" spread="space-between">
							{spaceItems.map((space) => (
								<Stack key={space} space="space.100" alignInline="center">
									{space}
									<Box
										xcss={blockStyles}
										padding="space.050"
										backgroundColor="color.background.neutral"
									>
										<Stack space={space}>
											<Block />
											<Block />
										</Stack>
									</Box>
								</Stack>
							))}
						</Inline>
					</Stack>
				</section>
			</Stack>
		</Stack>
	</Box>
);
