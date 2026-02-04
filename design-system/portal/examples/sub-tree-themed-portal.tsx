/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { cx, jsx } from '@compiled/react';

import AppProvider, { ThemeProvider } from '@atlaskit/app-provider';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Portal from '@atlaskit/portal';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.200'),
		maxWidth: '760px',
	},
	section: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		borderRadius: token('radius.xlarge'),
	},
	portal: {
		position: 'absolute',
		insetBlockEnd: token('space.300'),
		insetInlineStart: 0,
		insetInlineEnd: 0,
		marginInline: 'auto',
		width: '300px',
	},
});

/**
 * Sub-tree Theming Portal Example
 *
 * This example demonstrates how portals inherit the sub-tree theme of the
 * parent they are launched from.
 */
export function SubTreeThemedPortalExample(): JSX.Element {
	return (
		<AppProvider defaultColorMode="light">
			<Stack xcss={contentStyles.body} space="space.400">
				<Stack space="space.150">
					<Heading as="h1" size="xxlarge">
						Sub-tree theming portals
					</Heading>
					<Text as="p">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum non corporis magni
						officiis. Commodi, iste ex. Explicabo, reiciendis ut soluta dicta impedit aperiam harum
						nihil ducimus vero perspiciatis id laudantium!
					</Text>
				</Stack>
				<ThemeProvider defaultColorMode="dark">
					<Box backgroundColor="elevation.surface" padding="space.300" xcss={contentStyles.section}>
						<Stack space="space.150">
							<Heading as="h2" size="large">
								This is a dark mode sub-tree theme
							</Heading>
							<Text as="p">This area should be completely in dark theme</Text>
							<Portal>
								<Box
									backgroundColor="elevation.surface"
									padding="space.150"
									xcss={cx(contentStyles.section, contentStyles.portal)}
								>
									<Stack space="space.150">
										<Heading as="h2" size="large">
											This is a portal
										</Heading>
										<Text as="p">It inherits the theme of the parent it was launched from.</Text>
									</Stack>
								</Box>
							</Portal>
						</Stack>
					</Box>
				</ThemeProvider>
			</Stack>
		</AppProvider>
	);
}

export default SubTreeThemedPortalExample;
