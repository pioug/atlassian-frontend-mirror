import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { RankableTableCell, type RankableTableCellProps } from '../../rankable/table-cell';

import { cellWithKey as cell, head } from './_data';

const testId = 'dynamic--table--test--id';
const createProps = () => ({
	cell,
	head: head.cells[0],
	isRanking: false,
	innerRef: jest.fn(),
	refWidth: -1,
	refHeight: -1,
	isFixedSize: false,
	testId,
});

test('onKeyDown events are not propagated for RankableTableCell', () => {
	const props: RankableTableCellProps = createProps();
	const trKeyDownPropagation = jest.fn();
	render(
		<table>
			<tbody>
				<tr data-testid={`${testId}--tr`} onKeyDown={trKeyDownPropagation}>
					<RankableTableCell {...props} />
				</tr>
			</tbody>
		</table>,
	);

	const cell = screen.getByTestId(`${testId}--rankable--table--body--cell`);
	const tr = screen.getByTestId(`${testId}--tr`);

	fireEvent.keyDown(cell);
	expect(trKeyDownPropagation).toHaveBeenCalledTimes(0);

	fireEvent.keyDown(tr);
	expect(trKeyDownPropagation).toHaveBeenCalledTimes(1);
});
