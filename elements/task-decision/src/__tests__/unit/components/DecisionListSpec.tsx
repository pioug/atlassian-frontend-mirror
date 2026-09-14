import React from 'react';

import { screen } from '@testing-library/react';

import { DecisionList, DecisionItem } from '../../../';
import { renderWithIntl } from '../_testing-library';

describe('<DecisionList/>', () => {
	it('should render all DecisionItems', () => {
		renderWithIntl(
			<DecisionList>
				<DecisionItem>1</DecisionItem>
				<DecisionItem>2</DecisionItem>
			</DecisionList>,
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('should render single DecisionItem', () => {
		renderWithIntl(
			<DecisionList>
				<DecisionItem>1</DecisionItem>
			</DecisionList>,
		);

		expect(screen.getAllByRole('listitem')).toHaveLength(1);
	});

	it("shouldn't render list when no items", () => {
		renderWithIntl(<DecisionList />);

		expect(screen.queryByRole('list')).not.toBeInTheDocument();
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});

	it('should include data attributes on ol/li', () => {
		renderWithIntl(
			<DecisionList>
				<DecisionItem>1</DecisionItem>
			</DecisionList>,
		);

		const list = screen.getByRole('list');
		expect(list).toHaveAttribute('data-decision-list-local-id', '');
		expect(list).toHaveAttribute('data-node-type', 'decisionList');
		expect(screen.getByRole('listitem')).toHaveAttribute('data-decision-local-id');
	});
});
