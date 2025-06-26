import React from 'react';

import { render, screen } from '@testing-library/react';
import { hierarchy } from '@visx/hierarchy';

import { CharlieHierarchy } from './charlie-hierarchy';

interface TreeNode {
	label: string;
	children?: this[];
}

describe('<CharlieHierarchy/>', () => {
	const testTree: TreeNode = {
		label: 'root',
		children: [
			{
				label: 'child1',
			},
			{
				label: 'child2',
			},
		],
	};

	it('should capture and report a11y violations', async () => {
		const root = hierarchy(testTree);
		const { container } = render(
			<CharlieHierarchy root={root} nodeSize={[100, 50]} size={[500, 10]}>
				{(node) => {
					return node.data.label;
				}}
			</CharlieHierarchy>,
		);

		await expect(container).toBeAccessible();
	});

	it('renders with default props', async () => {
		const root = hierarchy(testTree);
		render(
			<CharlieHierarchy root={root} nodeSize={[100, 50]} size={[500, 10]}>
				{(node) => {
					return node.data.label;
				}}
			</CharlieHierarchy>,
		);

		expect(screen.getByText('root')).toBeInTheDocument();
		expect(screen.getByText('child1')).toBeInTheDocument();
		expect(screen.getByText('child2')).toBeInTheDocument();
	});
});
