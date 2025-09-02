import React, { useState } from 'react';

import { hierarchy } from '@visx/hierarchy';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import { token } from '@atlaskit/tokens';

import { CharlieHierarchy } from '../src';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: token('space.200'),
	},
	hierarchyContainer: {
		display: 'flex',
		justifyContent: 'center',
	},
	controls: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: token('space.100'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.small'),
		minWidth: '300px',
	},
	node: {
		width: '100%',
		height: '100%',
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		margin: 0,
	},
	description: {
		textAlign: 'center',
		color: token('color.text.subtle'),
	},
	sliderContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
	sliderInfo: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	sliderLabels: {
		display: 'flex',
		justifyContent: 'space-between',
		color: token('color.text.subtle'),
	},
});

// Simple test data with 6 children (threshold=3 should stack 3 of them)
const testData = {
	id: 1,
	name: 'Parent',
	children: [
		{ id: 2, name: 'Child 1' },
		{ id: 3, name: 'Child 2' },
		{ id: 4, name: 'Child 3' },
		{ id: 5, name: 'Child 4' },
		{ id: 6, name: 'Child 5' },
		{ id: 7, name: 'Child 6' },
	],
};

export default function SimpleStackingTest() {
	const [stackingThreshold, setStackingThreshold] = useState(3);
	const root = hierarchy(testData);

	const handleThresholdChange = (value: number) => {
		setStackingThreshold(value);
	};

	return (
		<Box xcss={styles.container}>
			<Box xcss={styles.controls}>
				<Box xcss={styles.title}>Stacking Threshold Demo</Box>
				<Box xcss={styles.description}>
					Adjust the slider to change how many children are displayed horizontally before stacking
				</Box>
				<Box xcss={styles.sliderContainer}>
					<Box xcss={styles.sliderInfo}>
						<span>
							Threshold: <strong>{stackingThreshold}</strong>
						</span>
						<span>
							Horizontal: <strong>{Math.min(stackingThreshold, testData.children.length)}</strong> |
							Stacked: <strong>{Math.max(0, testData.children.length - stackingThreshold)}</strong>
						</span>
					</Box>
					<Range
						value={stackingThreshold}
						onChange={handleThresholdChange}
						min={1}
						max={testData.children.length}
						step={1}
					/>
					<Box xcss={styles.sliderLabels}>
						<span>1</span>
						<span>{testData.children.length}</span>
					</Box>
				</Box>
			</Box>

			<Box xcss={styles.hierarchyContainer}>
				<CharlieHierarchy
					root={root}
					nodeSize={[120, 40]}
					size={[800, 600]}
					stackingThreshold={stackingThreshold}
					renderDependencies={[stackingThreshold]}
					stackingSpacing={50}
				>
					{(node) => {
						return <Box xcss={styles.node}>{node.data.name}</Box>;
					}}
				</CharlieHierarchy>
			</Box>
		</Box>
	);
}
