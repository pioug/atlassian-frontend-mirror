/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading, { HeadingContextProvider } from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Bleed, Box, Inline, Stack } from '../src/compiled';

const styles = cssMap({
	block: {
		width: '3rem',
		height: '3rem',
		borderRadius: token('border.radius'),
		borderWidth: token('border.width.outline'),
		borderStyle: 'solid',
		borderColor: token('color.border.discovery'),
	},
	padded: { padding: token('space.200') },
});

const Block = () => <Box backgroundColor="color.background.discovery.bold" xcss={styles.block} />;

export default function Basic() {
	return (
		<HeadingContextProvider>
			<Stack space="space.200">
				<Stack space="space.100">
					<Heading level="h500">Block</Heading>
					<Box xcss={styles.padded} backgroundColor="color.background.neutral">
						<Block />
						<Bleed block="space.100">
							<Block />
						</Bleed>
						<Block />
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading level="h500">Inline</Heading>
					<Box xcss={styles.padded} backgroundColor="color.background.neutral">
						<Inline>
							<Block />
							<Bleed inline="space.100">
								<Block />
							</Bleed>
							<Block />
						</Inline>
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading level="h500">All</Heading>
					<Box xcss={styles.padded} backgroundColor="color.background.neutral">
						<Block />
						<Bleed all="space.100">
							<Block />
						</Bleed>
						<Block />
					</Box>
				</Stack>
			</Stack>
		</HeadingContextProvider>
	);
}
