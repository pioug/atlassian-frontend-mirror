/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
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
