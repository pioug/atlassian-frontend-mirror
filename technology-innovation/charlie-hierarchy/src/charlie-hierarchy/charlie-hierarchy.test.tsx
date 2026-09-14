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

	it('applies legacy lineAttributes to grouped connectors', () => {
		const root = hierarchy(testTree);
		render(
			<CharlieHierarchy
				root={root}
				nodeSize={[100, 50]}
				size={[500, 10]}
				styles={{
					lineAttributes: { role: 'img', 'aria-label': 'legacy connector' },
				}}
			>
				{(node) => node.data.label}
			</CharlieHierarchy>,
		);

		expect(screen.getAllByRole('img', { name: 'legacy connector' })).toHaveLength(1);
	});

	it('renders grouped rounded connector paths when connector styles are provided', () => {
		const root = hierarchy(testTree);
		render(
			<CharlieHierarchy
				root={root}
				nodeSize={[100, 50]}
				size={[500, 10]}
				styles={{
					connector: {
						cornerRadius: 8,
						attributes: { role: 'img', 'aria-label': 'connector' },
					},
				}}
			>
				{(node) => node.data.label}
			</CharlieHierarchy>,
		);

		const connectors = screen.getAllByRole('img', { name: 'connector' });

		expect(connectors).toHaveLength(1);
		expect(connectors[0]).toHaveAttribute('d', expect.stringContaining('Q'));
		expect(connectors[0].getAttribute('d')?.match(/M/g)).toHaveLength(2);
	});
});
