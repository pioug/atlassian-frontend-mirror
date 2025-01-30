import React from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	fontFamily: {
		fontFamily: 'var(--ds-font-family-body)',
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
	},

	letterSpacing: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		letterSpacing: 2 as any,
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
	},
});

const textContent = (
	<React.Fragment>
		Font styles are inherited by{' '}
		<Link href="http://www.catipsum.com/" target="_blank">
			the link
		</Link>
	</React.Fragment>
);

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
			<Box as="p" xcss={styles.fontFamily}>
				{textContent}
			</Box>
			<Box as="p" xcss={styles.letterSpacing}>
				{textContent}
			</Box>
		</Stack>
	);
}
