import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import DecisionItem from '../../../../react/nodes/decisionItem';
import ReactSerializer from '../../../../react';

describe('Renderer - React/Nodes/DecisionItem', () => {
	const serialiser = new ReactSerializer({});
	const text: any = 'This is a list item';

	it('should wrap content with <AkDecisionItem>-tag', () => {
		renderWithIntl(
			<DecisionItem
				marks={[]}
				serializer={serialiser}
				nodeType="decisionItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
			>
				{text}
			</DecisionItem>,
		);

		expect(screen.getByTestId('elements-decision-item')).toHaveTextContent('This is a list item');
	});

	it('should render if no children', () => {
		renderWithIntl(
			<DecisionItem
				marks={[]}
				serializer={serialiser}
				nodeType="decisionItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
			/>,
		);

		expect(screen.getByTestId('elements-decision-item')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<DecisionItem
				marks={[]}
				serializer={serialiser}
				nodeType="decisionItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
			>
				{text}
			</DecisionItem>,
		);

		await expect(container).toBeAccessible();
	});
});
