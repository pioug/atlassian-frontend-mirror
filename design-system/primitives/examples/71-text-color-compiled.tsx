/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Stack, Text } from '../src/compiled';

const styles = cssMap({
	padded: { padding: token('space.100') },
	inheritContainer: { color: token('color.text.brand') },
});

export default () => {
	return (
		<Stack space="space.300">
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Colors
					</Heading>
					<Text>Default text color</Text>
					<Text color="color.text.brand">Brand text color</Text>
					<Text color="color.text.subtle">Subtle text color</Text>
					<Text color="color.text.subtlest">Subtlest text color</Text>
					<Text color="color.text.discovery">Discovery text color</Text>
					<Text color="color.text.information">Information text color</Text>
					<Text color="color.text.success">Success text color</Text>
					<Text color="color.text.warning">Warning text color</Text>
					<Text color="color.text.danger">Danger text color</Text>
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Composing text
					</Heading>
					<Text>
						Default color text composing <Text as="em">em text which inherits default color</Text>
					</Text>
					<Text color="color.text.brand">
						Brand color text composing{' '}
						<Text as="strong">strong text which inherits brand color</Text>
					</Text>
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Inverse color
					</Heading>
					<Box xcss={styles.padded} backgroundColor="color.background.information">
						<Text color="color.text.information">
							Text on information surface displays defined color
						</Text>
					</Box>
					<Box xcss={styles.padded} backgroundColor="color.background.brand.bold">
						<Text color="color.text.information">
							Text on brand bold surface displays inverse color
						</Text>
					</Box>
				</Stack>
			</section>
			<section>
				<Stack space="space.100">
					<Heading size="medium" as="h3">
						Inherit color
					</Heading>
					<Stack xcss={styles.inheritContainer} space="space.100">
						<Text>By default Text sets default text color overriding container color</Text>
						<Text color="inherit">If explicitly defined Text inherits container color</Text>
					</Stack>
				</Stack>
			</section>
		</Stack>
	);
};
