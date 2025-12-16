import React from 'react';

import Heading, { HeadingContextProvider } from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Bleed, Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const blockStyles = xcss({
	width: '3rem',
	height: '3rem',
	borderRadius: 'radius.small',
	borderWidth: 'border.width.selected',
	borderStyle: 'solid',
	borderColor: 'color.border.discovery',
});

const Block = () => <Box backgroundColor="color.background.discovery.bold" xcss={blockStyles} />;

export default function Basic(): React.JSX.Element {
	return (
		<HeadingContextProvider>
			<Stack space="space.200">
				<Stack space="space.100">
					<Heading size="small">Block</Heading>
					<Box padding="space.200" backgroundColor="color.background.neutral">
						<Block />
						<Bleed block="space.100">
							<Block />
						</Bleed>
						<Block />
					</Box>
				</Stack>
				<Stack space="space.100">
					<Heading size="small">Inline</Heading>
					<Box padding="space.200" backgroundColor="color.background.neutral">
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
					<Box padding="space.200" backgroundColor="color.background.neutral">
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
