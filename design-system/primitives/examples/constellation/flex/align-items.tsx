/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Flex, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	flexContainer: {
		display: 'flex',
		borderRadius: token('radius.small'),
		height: '6rem',
	},
});

export default function Example() {
	return (
		<Flex justifyContent="space-between" wrap="wrap">
			<Stack alignInline="center">
				"start" (default)
				<VisualContainer>
					<Flex gap="space.050" alignItems="start">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Flex>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"center"
				<VisualContainer>
					<Flex gap="space.050" alignItems="center">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Flex>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"end"
				<VisualContainer>
					<Flex gap="space.050" alignItems="end">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Flex>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"baseline"
				<VisualContainer>
					<Flex gap="space.050" alignItems="baseline">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Flex>
				</VisualContainer>
			</Stack>
		</Flex>
	);
}

const VisualContainer = ({ children }: { children: ReactNode }) => (
	<Box backgroundColor="color.background.neutral" padding="space.050" xcss={styles.flexContainer}>
		{children}
	</Box>
);
