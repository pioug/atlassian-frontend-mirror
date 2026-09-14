/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	card: {
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		width: '400px',
	},
});

export default (): JSX.Element => {
	return (
		<Box backgroundColor="elevation.surface.overlay" padding="space.300" xcss={styles.card}>
			<Stack space="space.200">
				<Heading size="medium">Update profile image</Heading>
				<Stack space="space.200">
					<Text>
						Add a profile image to personalize your account and help others recognize you.
					</Text>
					<Text>Would you like to upload a new profile picture now?</Text>
				</Stack>
				<Inline space="space.100" alignInline="end">
					<Button appearance="subtle">Skip for now</Button>
					<Button appearance="primary">Upload</Button>
				</Inline>
			</Stack>
		</Box>
	);
};
