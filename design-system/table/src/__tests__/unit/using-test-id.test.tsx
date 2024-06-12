import React from 'react';

import { render } from '@testing-library/react';

import Table, { Cell, HeadCell, Row, SortableColumn, TBody, THead } from '../../index';

it('@atlaskit/table components should be found by data-testid', async () => {
	const { getByTestId } = render(
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

	expect(getByTestId('table')).toBeInTheDocument();
	expect(getByTestId('head-cell')).toBeInTheDocument();
	// TH element itself
	expect(getByTestId('sortable-col')).toBeInTheDocument();
	// Sort button inside th
	expect(getByTestId('sortable-col--button')).toBeInTheDocument();
	expect(getByTestId('row')).toBeInTheDocument();
	expect(getByTestId('cell')).toBeInTheDocument();
});
