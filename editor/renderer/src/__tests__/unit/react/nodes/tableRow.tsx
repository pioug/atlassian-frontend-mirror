import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SortOrder } from '@atlaskit/editor-common/types';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { RendererCssClassName } from '../../../../consts';
import TableRow from '../../../../react/nodes/tableRow';

type FakeCellProps = {
	colGroupWidth?: string;
	columnIndex?: number;
	isHeaderRow?: boolean;
	onSorting?: (columnIndex?: number) => void;
	sortOrdered?: SortOrder;
};

const FakeCell = ({
	colGroupWidth,
	columnIndex,
	isHeaderRow,
	onSorting,
	sortOrdered,
}: FakeCellProps) => (
	<th
		data-col-group-width={colGroupWidth}
		data-column-index={columnIndex}
		data-is-header-row={isHeaderRow}
		data-sort-ordered={sortOrdered}
	>
		<button type="button" onClick={() => onSorting?.(columnIndex)}>
			sort
		</button>
	</th>
);

const renderInTable = (row: React.ReactNode) =>
	render(
		<table>
			<tbody>{row}</tbody>
		</table>,
	);

const cellAttributes = (attribute: string) =>
	screen.getAllByRole('columnheader').map((cell) => cell.getAttribute(attribute));

describe.each([false, true])('Renderer - React/Nodes/TableRow (functional gate: %s)', (enabled) => {
	beforeEach(() => {
		if (enabled) {
			passGate('platform_renderer_table_row_functional');
		} else {
			failGate('platform_renderer_table_row_functional');
		}
	});
	it('should create a <tr>-tag', () => {
		renderInTable(<TableRow />);

		expect(screen.getByRole('row').tagName).toEqual('TR');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderInTable(
			<TableRow>
				<FakeCell />
				<FakeCell />
				<FakeCell />
			</TableRow>,
		);

		await expect(container).toBeAccessible();
	});

	describe('with allowColumnSorting', () => {
		const onSorting = jest.fn();
		const tableOrderStatus = {
			columnIndex: 1,
			order: SortOrder.ASC,
		};

		beforeEach(() => {
			onSorting.mockClear();
		});

		const renderRow = (index?: number) =>
			renderInTable(
				<TableRow
					onSorting={onSorting}
					tableOrderStatus={tableOrderStatus}
					allowColumnSorting={true}
					index={index}
				>
					<FakeCell />
					<FakeCell />
					<FakeCell />
				</TableRow>,
			);

		it('should clone childrens and pass down the props', async () => {
			renderRow();

			expect(cellAttributes('data-column-index')).toEqual(['0', '1', '2']);

			for (const sortButton of screen.getAllByRole('button', { name: 'sort' })) {
				await userEvent.click(sortButton);
			}

			expect(onSorting.mock.calls).toEqual([[0], [1], [2]]);
		});

		describe('#isHeaderRow', () => {
			it('should return true when rowIndex is 0', () => {
				renderRow(0);

				expect(cellAttributes('data-is-header-row')).toEqual(['true', 'true', 'true']);
			});

			it('should return true when rowIndex is empty', () => {
				renderRow();

				expect(cellAttributes('data-is-header-row')).toEqual(['true', 'true', 'true']);
			});

			it('should return false when rowIndex is greater than zero', () => {
				renderRow(1);

				expect(cellAttributes('data-is-header-row')).toEqual([null, null, null]);
			});
		});

		describe('with tableOrderStatus', () => {
			it('should return the specific order status to the columnIndex set', () => {
				renderRow();

				expect(cellAttributes('data-sort-ordered')[1]).toBe(tableOrderStatus.order);
			});

			it('should return NO_ORDER for other columns', () => {
				renderRow();

				const sortOrders = cellAttributes('data-sort-ordered');

				expect(sortOrders[0]).toBe(SortOrder.NO_ORDER);
				expect(sortOrders[2]).toBe(SortOrder.NO_ORDER);
			});
		});
	});

	it('forwards the row ref and preserves numbered row edge attributes', () => {
		const innerRef = React.createRef<HTMLTableRowElement>();
		renderInTable(
			<TableRow innerRef={innerRef} index={3} isNumberColumnEnabled={1} isFirstRow isLastRow>
				<td>Content</td>
			</TableRow>,
		);
		expect(innerRef.current).toBe(screen.getByRole('row'));
		const numberCell = screen.getByRole('cell', { name: '3' });
		expect(numberCell).toHaveClass(RendererCssClassName.NUMBER_COLUMN);
		expect(numberCell).toHaveAttribute('data-reaches-left', 'true');
		expect(numberCell).toHaveAttribute('data-reaches-top', 'true');
		expect(numberCell).toHaveAttribute('data-reaches-bottom', 'true');
	});

	it('updates sorting props and callbacks when rerendered', async () => {
		const initialSort = jest.fn();
		const nextSort = jest.fn();
		const row = (onSorting: typeof initialSort, columnIndex: number) => (
			<table>
				<tbody>
					<TableRow
						allowColumnSorting
						onSorting={onSorting}
						tableOrderStatus={{ columnIndex, order: SortOrder.DESC }}
					>
						<FakeCell />
						<FakeCell />
					</TableRow>
				</tbody>
			</table>
		);
		const { rerender } = render(row(initialSort, 0));
		rerender(row(nextSort, 1));
		expect(cellAttributes('data-sort-ordered')).toEqual([SortOrder.NO_ORDER, SortOrder.DESC]);
		await userEvent.click(screen.getAllByRole('button', { name: 'sort' })[1]);
		expect(nextSort).toHaveBeenCalledWith(1);
		expect(initialSort).not.toHaveBeenCalled();
	});

	describe('colGroupWidths', () => {
		it('should not pass colGroupWidths to children', () => {
			renderInTable(
				<TableRow>
					<FakeCell />
					<FakeCell />
					<FakeCell />
				</TableRow>,
			);

			expect(cellAttributes('data-col-group-width')).toEqual([null, null, null]);
		});
	});
});
