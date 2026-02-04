/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: { display: 'flex' },
	wide: { width: '300px' },
	flex1: { borderStyle: 'solid', flex: '1' },
	grow0: { borderStyle: 'solid', flexGrow: '0' },
	grow1: { borderStyle: 'solid', flexGrow: '1' },
});

export default (): JSX.Element => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flex</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box padding="space.400" xcss={styles.container}>
						<Box xcss={styles.flex1}>flex=1</Box>
						<Box xcss={styles.flex1}>flex=1</Box>
					</Box>
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-flex">
				<Heading size="medium">flexGrow</Heading>
				<Inline space="space.200" alignBlock="center">
					<Box xcss={cx(styles.container, styles.wide)} padding="space.400">
						<Box xcss={styles.grow0}>flexGrow=0</Box>
						<Box xcss={styles.grow1}>flexGrow=1</Box>
					</Box>
				</Inline>
			</Stack>
		</Stack>
	);
};
