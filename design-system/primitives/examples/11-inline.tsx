import React from 'react';

import Heading from '@atlaskit/heading/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';
import { token } from '@atlaskit/tokens';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end', 'baseline'] as const;
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

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const Block = () => (
	<Box xcss={blockStyles} padding="space.200" backgroundColor="color.background.discovery.bold" />
);

const pageContainerStyles = xcss({ maxWidth: '900px' });
const spaceNameStyles = xcss({ minWidth: token('space.1000') });
const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'radius.xsmall',
	height: '200px',
});
const fixedWidthBlockStyles = xcss({ borderRadius: 'radius.xsmall', width: '200px' });

export default (): React.JSX.Element => (
	<Box padding="space.200" xcss={pageContainerStyles}>
		<Stack space="space.400">
			<Heading size="large" as="h2">
				Inline
			</Heading>

			<section>
				<Heading size="medium" as="h3">
					Align inline
				</Heading>
				{alignInlineItems.map((alignInline) => (
					<Stack key={alignInline}>
						{alignInline}
						<Box
							xcss={fixedWidthBlockStyles}
							backgroundColor="color.background.neutral"
							padding="space.050"
						>
							<Inline alignInline={alignInline} space="space.050">
								<Block />
								<Block />
								<Block />
							</Inline>
						</Box>
					</Stack>
				))}
			</section>

			<section>
				<Heading size="medium" as="h3">
					Spread
				</Heading>
				{spreadItems.map((spread) => (
					<Stack key={spread}>
						{spread}
						<Box
							xcss={fixedWidthBlockStyles}
							backgroundColor="color.background.neutral"
							padding="space.050"
						>
							<Inline spread={spread} space="space.050">
								<Block />
								<Block />
								<Block />
							</Inline>
						</Box>
					</Stack>
				))}
			</section>
			<section>
				<Heading size="medium" as="h3">
					Align block
				</Heading>
				<Inline space="space.200">
					{alignBlockItems.map((alignBlock) => (
						<Stack key={alignBlock} alignInline="center">
							{alignBlock}
							<Box
								backgroundColor="color.background.neutral"
								padding="space.050"
								xcss={containerStyles}
							>
								<Inline space="space.050" alignBlock={alignBlock}>
									<Box
										xcss={blockStyles}
										padding="space.300"
										backgroundColor="color.background.discovery.bold"
									></Box>
									<Block />
									<Block />
								</Inline>
							</Box>
						</Stack>
					))}
				</Inline>
			</section>

			<section>
				<Heading size="medium" as="h3">
					Space
				</Heading>
				<Stack space="space.050">
					{spaceItems.map((space) => (
						<Inline key={space} alignBlock="center">
							<Box xcss={spaceNameStyles}>{space}</Box>
							<Box
								xcss={blockStyles}
								padding="space.050"
								backgroundColor="color.background.neutral"
							>
								<Inline space={space}>
									<Block />
									<Block />
								</Inline>
							</Box>
						</Inline>
					))}
				</Stack>
			</section>

			<section>
				<Heading size="medium" as="h3">
					Should wrap
				</Heading>
				<Box xcss={blockStyles} padding="space.050" backgroundColor="color.background.neutral">
					<Inline space="space.200" shouldWrap={true}>
						{[...Array(25)].map((_, index) => (
							<Block key={index} />
						))}
					</Inline>
				</Box>
			</section>

			<section>
				<Heading size="medium" as="h3">
					Separator
				</Heading>
				<Box xcss={blockStyles} padding="space.050" backgroundColor="color.background.neutral">
					<Inline space="space.100" shouldWrap={true} alignBlock="center" separator="/">
						{[...Array(20)].map((_, index) => (
							<Block key={index} />
						))}
					</Inline>
				</Box>
			</section>
		</Stack>
	</Box>
);
