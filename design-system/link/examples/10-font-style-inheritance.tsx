import React from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';

const textContent = (
	<>
		Font styles are inherited by{' '}
		<Link href="http://www.catipsum.com/" target="_blank">
			the link
		</Link>
	</>
);

const fontFamilyStyles = xcss({
	fontFamily: 'Arial',
	margin: 'space.0',
});

const letterSpacingStyles = xcss({
	letterSpacing: 2,
	margin: 'space.0',
});

export default function InlineTextExample() {
	return (
		<Stack space="space.100">
			<Text size="small" as="p">
				{textContent}
			</Text>
			<Text size="medium" as="p">
				{textContent}
			</Text>
			<Text size="large" as="p">
				{textContent}
			</Text>
			<Heading size="xlarge">{textContent}</Heading>
			<Heading size="xxlarge">{textContent}</Heading>
			<Text as="p">
				<strong>{textContent}</strong>
			</Text>
			<Text as="p">
				<em>{textContent}</em>
			</Text>
			<Text weight="bold" color="color.text.accent.magenta" as="p">
				{textContent}
			</Text>
			<Box as="p" xcss={fontFamilyStyles}>
				{textContent}
			</Box>
			<Box as="p" xcss={letterSpacingStyles}>
				{textContent}
			</Box>
		</Stack>
	);
}
