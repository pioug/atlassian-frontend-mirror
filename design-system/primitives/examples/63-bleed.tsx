import React from 'react';

import Heading, { HeadingContextProvider } from '@atlaskit/heading';

import { Bleed, Box, Inline, Stack, xcss } from '../src';

const blockStyles = xcss({
	width: '3rem',
	height: '3rem',
	borderRadius: 'border.radius',
	borderWidth: 'border.width.outline',
	borderStyle: 'solid',
	borderColor: 'color.border.discovery',
});

const Block = (style?: any) => (
	<Box
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={style}
		backgroundColor="color.background.discovery.bold"
		xcss={blockStyles}
	/>
);

export default function Basic() {
	return (
		<HeadingContextProvider>
			<Stack space="space.200">
				<Stack space="space.100">
					<Heading level="h500">Block</Heading>
					<Box padding="space.200" backgroundColor="color.background.neutral">
						<Block />
						<Bleed block="space.100">
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<Block style={{ position: 'relative' }} />
						</Bleed>
						<Block />
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading level="h500">Inline</Heading>
					<Box padding="space.200" backgroundColor="color.background.neutral">
						<Inline>
							<Block />
							<Bleed inline="space.100">
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
								<Block style={{ position: 'relative' }} />
							</Bleed>
							<Block />
						</Inline>
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading level="h500">All</Heading>
					<Box padding="space.200" backgroundColor="color.background.neutral">
						<Block />
						<Bleed all="space.100">
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<Block style={{ position: 'relative' }} />
						</Bleed>
						<Block />
					</Box>
				</Stack>
			</Stack>
		</HeadingContextProvider>
	);
}
