/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	container: {
		display: 'flex',
		height: '200px',
	},
});

export default function Example() {
	return (
		<Box testId="stack-example" padding="space.100">
			<Inline space="space.200" spread="space-between">
				<Stack alignInline="center" space="space.200">
					<Heading size="xsmall">Start alignment</Heading>
					<Box xcss={styles.container}>
						<Stack space="space.050" alignBlock="start">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
				<Stack alignInline="center">
					<Heading size="xsmall">Center alignment</Heading>
					<Box xcss={styles.container}>
						<Stack space="space.050" alignBlock="center">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
				<Stack alignInline="center">
					<Heading size="xsmall">End alignment</Heading>
					<Box xcss={styles.container}>
						<Stack space="space.050" alignBlock="end">
							<ExampleBox />
							<ExampleBox />
							<ExampleBox />
						</Stack>
					</Box>
				</Stack>
			</Inline>
		</Box>
	);
}
