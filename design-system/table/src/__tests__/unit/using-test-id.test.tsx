import React from 'react';

import { render, screen } from '@testing-library/react';

import Table, { Cell, HeadCell, Row, SortableColumn, TBody, THead } from '../../index';

it('@atlaskit/table components should be found by data-testid', async () => {
	render(
		<Table testId="table">
			<THead>
				<HeadCell testId="head-cell"></HeadCell>
				<SortableColumn name="Test" testId="sortable-col">
					Test
				</SortableColumn>
			</THead>
			<TBody>
				<Row testId="row">
					<Cell testId="cell"></Cell>
					<Cell></Cell>
				</Row>
			</TBody>
		</Table>,
	);

	expect(screen.getByTestId('table')).toBeInTheDocument();
	expect(screen.getByTestId('head-cell')).toBeInTheDocument();
	// TH element itself
	expect(screen.getByTestId('sortable-col')).toBeInTheDocument();
	// Sort button inside th
	expect(screen.getByTestId('sortable-col--button')).toBeInTheDocument();
	expect(screen.getByTestId('row')).toBeInTheDocument();
	expect(screen.getByTestId('cell')).toBeInTheDocument();
});
