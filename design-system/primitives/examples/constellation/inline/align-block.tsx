/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	flex: {
		flexDirection: 'column',
		'@media (min-width: 90rem)': {
			flexDirection: 'row',
		},
	},

	visualContainer: {
		display: 'flex',
		borderRadius: token('radius.xsmall'),
		height: '6rem',
	},
});

export default function Example() {
	return (
		<Flex xcss={styles.flex} justifyContent="space-between">
			<Stack alignInline="center">
				"start" (default)
				<VisualContainer>
					<Inline space="space.050" alignBlock="start">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Inline>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"center"
				<VisualContainer>
					<Inline space="space.050" alignBlock="center">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Inline>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"end"
				<VisualContainer>
					<Inline space="space.050" alignBlock="end">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Inline>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"baseline"
				<VisualContainer>
					<Inline space="space.050" alignBlock="baseline">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Inline>
				</VisualContainer>
			</Stack>
			<Stack alignInline="center">
				"stretch"
				<VisualContainer>
					<Inline space="space.050" alignBlock="stretch">
						<ExampleBox />
						<ExampleBox />
						<ExampleBox padding="space.300" />
					</Inline>
				</VisualContainer>
			</Stack>
		</Flex>
	);
}

const VisualContainer = ({ children }: { children: ReactNode }) => (
	<Box backgroundColor="color.background.neutral" padding="space.050" xcss={styles.visualContainer}>
		{children}
	</Box>
);
