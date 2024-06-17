import React from 'react';

import { Box, Inline, Stack, Text, xcss } from '../src';

const labelWidthStyles = xcss({
	width: '160px',
});

const truncationWidthStyles = xcss({
	width: '140px',
	backgroundColor: 'color.background.accent.lime.subtlest',
});

export default () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - no truncation:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text>The quick brown fox jumped over the lazy dog</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 1 line:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={1}>The quick brown fox jumped over the lazy dog</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 2 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={2}>The quick brown fox jumped over the lazy dog</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 3 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={3}>The quick brown fox jumped over the lazy dog</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - no truncation:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text>Your upload of somereallylongfilename.jpg is now complete</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 1 line:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={1}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 2 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={2}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 3 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={3}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - no truncation:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 1 line:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={1}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 2 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={2}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</Box>
			</Inline>

			<Inline space="space.100">
				<Box xcss={labelWidthStyles}>
					<Text>Text - 3 lines:</Text>
				</Box>
				<Box xcss={truncationWidthStyles}>
					<Text maxLines={3}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</Box>
			</Inline>
		</Stack>
	);
};
