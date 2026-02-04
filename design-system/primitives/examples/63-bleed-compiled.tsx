/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading, { HeadingContextProvider } from '@atlaskit/heading';
import { Bleed, Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		width: '3rem',
		height: '3rem',
		borderRadius: token('radius.small'),
		borderWidth: token('border.width.selected'),
		borderStyle: 'solid',
		borderColor: token('color.border.discovery'),
	},
	padded: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const Block = () => <Box backgroundColor="color.background.discovery.bold" xcss={styles.block} />;

export default function Basic(): JSX.Element {
	return (
		<HeadingContextProvider>
			<Stack space="space.200">
				<Stack space="space.100">
					<Heading size="small">Block</Heading>
					<Box xcss={styles.padded} backgroundColor="color.background.neutral">
						<Block />
						<Bleed block="space.100">
							<Block />
						</Bleed>
						<Block />
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading size="small">Inline</Heading>
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
					<Heading size="small">All</Heading>
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
