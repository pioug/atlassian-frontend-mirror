/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';

import { Box, Stack } from '../src/compiled';

const styles = cssMap({
	solid: { borderStyle: 'solid', width: '600px' },
});

export default () => {
	return (
		<Stack space="space.400" alignInline="start">
			<Heading size="medium">Custom width</Heading>
			<Stack space="space.200" testId="box-custom-width">
				<Box xcss={styles.solid}>custom width</Box>
			</Stack>

			<Stack space="space.200" testId="box-custom-padding">
				<Heading size="medium">Custom padding</Heading>
				<Box
					backgroundColor="color.background.discovery.bold"
					// NOTE: This was previously `paddingLeft: 14px` for some odd reason…
					paddingInlineStart="space.200"
				>
					<Box backgroundColor="elevation.surface">custom padding</Box>
				</Box>
			</Stack>
		</Stack>
	);
};
