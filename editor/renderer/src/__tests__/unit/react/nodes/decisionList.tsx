import React from 'react';

import { render, screen } from '@testing-library/react';

import DecisionList from '../../../../react/nodes/decisionList';

describe('Renderer - React/Nodes/DecisionList', () => {
	const renderDecisionList = () =>
		render(
			<DecisionList>
				<span>This is a list item</span>
			</DecisionList>,
		);

	it('should match rendered AkDecisionList', () => {
		renderDecisionList();

		const decisionList = screen.getByRole('list');

		expect(decisionList.tagName).toBe('OL');
		expect(decisionList).toHaveAttribute('data-node-type', 'decisionList');
		expect(decisionList).toHaveTextContent('This is a list item');
	});

	it('should not render if no children', () => {
		const { container } = render(<DecisionList />);

		expect(container).toBeEmptyDOMElement();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderDecisionList();

		await expect(container).toBeAccessible();
	});
});
