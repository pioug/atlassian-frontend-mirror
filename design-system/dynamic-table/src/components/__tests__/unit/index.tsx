import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Spinner from '@atlaskit/spinner';

import DynamicTable, { DynamicTableStateless } from '../../../index';
import { type RowCellType, type RowType } from '../../../types';

import { headMock1, rows, rowsWithKeys, secondSortKey } from './_data';
import { headNumeric, rowsNumeric } from './_data-numeric';

jest.mock('@atlaskit/spinner', () => {
	const actual = jest.requireActual('@atlaskit/spinner');
	return {
		__esModule: true,
		...actual,
		default: jest.fn(),
	};
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/dynamic-table', () => {
	const testId = 'dynamic--table--test--id';
	describe('stateless', () => {
		it('should render TableHead when items length is 0 and not render EmptyViewContainer if emptyView prop is omitted', () => {
			render(<DynamicTableStateless head={headMock1} testId={testId} />);

			const header = screen.getByTestId(`${testId}--head`);
			const emptyView = screen.queryByTestId(`${testId}--empty-view-container`);
			const body = screen.queryByTestId(`${testId}--body`);

			expect(header).toBeInTheDocument();
			expect(emptyView).not.toBeInTheDocument();
			expect(body).not.toBeInTheDocument();
		});
		it('should not render any text in the table when rows prop is an empty array', () => {
			render(<DynamicTableStateless rows={[]} head={headMock1} testId={testId} />);

			const header = screen.getByTestId(`${testId}--head`);
			const table = screen.getByRole('table');

			expect(header).toBeInTheDocument();

			/* eslint-disable testing-library/no-node-access */
			expect(table.children.length).toBe(2);
		});
		it('should render TableHead when items length is 0 and render EmptyViewContainer if emptyView prop is provided', () => {
			render(
				<DynamicTableStateless
					head={headMock1}
					emptyView={<h2>No items present in table</h2>}
					testId={testId}
				/>,
			);

			const header = screen.getByTestId(`${testId}--head`);
			const emptyView = screen.getByTestId(`${testId}--empty-view-container`);
			const body = screen.queryByTestId(`${testId}--body`);

			expect(header).toBeInTheDocument();
			expect(emptyView).toBeInTheDocument();
			expect(body).not.toBeInTheDocument();
		});
		it('should not render TableHead if head prop is not provided and should render EmptyViewContainer if emptyView prop is provided', () => {
			render(
				<DynamicTableStateless emptyView={<h2>No items present in table</h2>} testId={testId} />,
			);
			const header = screen.queryByTestId(`${testId}--head`);
			const body = screen.queryByTestId(`${testId}--body`);
			const emptyView = screen.getByTestId(`${testId}--empty-view-container`);

			expect(header).not.toBeInTheDocument();
			expect(body).not.toBeInTheDocument();
			expect(emptyView).toBeInTheDocument();
		});
		it('should render head, emptyView and caption if provided', () => {
			render(
				<DynamicTableStateless
					head={headMock1}
					emptyView={<h2>No items present in table</h2>}
					caption={<h2>This is a table caption</h2>}
					testId={testId}
				/>,
			);

			const header = screen.getByTestId(`${testId}--head`);
			const emptyView = screen.getByTestId(`${testId}--empty-view-container`);
			const caption = screen.getByRole('heading', {
				name: /this is a table caption/i,
			});
			const body = screen.queryByTestId(`${testId}--body`);

			expect(header).toBeInTheDocument();
			expect(emptyView).toBeInTheDocument();
			expect(caption).toBeInTheDocument();
			expect(body).not.toBeInTheDocument();
		});

		it('should render RankableTableBody if table is rankable', async () => {
			render(
				<DynamicTableStateless
					rowsPerPage={2}
					page={2}
					head={headMock1}
					rows={rowsWithKeys}
					isRankable
					testId={testId}
				/>,
			);

			{
				// A non-rankable table body will render initially, due to lazy loading.

				const body = screen.getByTestId(`${testId}--body`);
				const rankableBody = screen.queryByTestId(testId);

				expect(body).toBeInTheDocument();
				expect(rankableBody).not.toBeInTheDocument();
			}

			{
				// The rankable table body will replace the initial one after it loads.

				const body = screen.queryByTestId(`${testId}--body`);
				const rankableBody = await screen.findByTestId(testId);

				expect(body).not.toBeInTheDocument();
				expect(rankableBody).toBeInTheDocument();
			}
		});

		it('should display paginated data', () => {
			render(
				<DynamicTableStateless
					rowsPerPage={2}
					page={2}
					head={headMock1}
					rows={rows}
					testId={testId}
				/>,
			);

			const bodyRows = screen.getByTestId(`${testId}--body`);
			const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const lastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);

			expect(bodyRows).toBeInTheDocument();
			expect(firstNameColumn).toHaveLength(2);
			expect(lastNameColumn).toHaveLength(2);
			expect(firstNameColumn[0]).toContainHTML('Donald');
			expect(lastNameColumn[0]).toContainHTML('Trump');
		});

		describe('Sorted Data', () => {
			const checkSortedData = (isRankable: boolean) => {
				const headCells = headMock1.cells.map((cell) => ({
					...cell,
					isSortable: true,
				}));
				render(
					<DynamicTableStateless
						sortKey="first_name"
						sortOrder="ASC"
						head={{ cells: headCells }}
						rows={rowsWithKeys}
						isRankable={isRankable}
						testId={testId}
					/>,
				);
				const bodyRows = screen.getByTestId(`${testId}--body`);
				const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
				const lastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);

				expect(bodyRows).toBeInTheDocument();

				expect(firstNameColumn[0]).toContainHTML('Barack');
				expect(lastNameColumn[0]).toContainHTML('Obama');
				expect(firstNameColumn[1]).toContainHTML('Donald');
				expect(lastNameColumn[1]).toContainHTML('Trump');
				expect(firstNameColumn[2]).toContainHTML('hillary');
				expect(lastNameColumn[2]).toContainHTML('clinton');
			};

			it('should display sorted data', () => {
				checkSortedData(false);
			});

			it('should display sorted data in rankable table', () => {
				checkSortedData(true);
			});

			it('should pass down extra props', () => {
				const theadOnClick = jest.fn();
				const theadOnKeyDown = jest.fn();
				const sortButtonOnClick = jest.fn();
				const sortButtonOnKeyDown = jest.fn();
				const trOnClick = jest.fn();
				const tdOnClick = jest.fn();

				const newHead = {
					onClick: theadOnClick,
					onKeyDown: theadOnKeyDown,
					cells: headMock1.cells.map((cell) => ({
						...cell,
						onClick: sortButtonOnClick,
						onKeyDown: sortButtonOnKeyDown,
					})),
				};
				const newRows = rows.map((row: RowType) => ({
					...row,
					onClick: trOnClick,
					cells: row.cells.map((cell: RowCellType) => ({
						...cell,
						onClick: tdOnClick,
					})),
				}));

				render(<DynamicTableStateless head={newHead} rows={newRows} testId={testId} />);

				const thead = screen.getByTestId(`${testId}--head`);
				const sortButton = screen.getAllByRole('button')[0];
				const trTestIdPattern = new RegExp(`${testId}--row`);
				const trList = screen.getAllByTestId(trTestIdPattern);
				const tdTestIdPattern = new RegExp(`${testId}--cell`);
				const tdList = screen.getAllByTestId(tdTestIdPattern);

				fireEvent.click(thead);
				expect(theadOnClick).toHaveBeenCalled();

				fireEvent.keyDown(thead);
				expect(theadOnKeyDown).toHaveBeenCalled();

				fireEvent.click(sortButton);
				expect(sortButtonOnClick).toHaveBeenCalledTimes(1);

				fireEvent.click(trList[0]);
				expect(trOnClick).toHaveBeenCalledTimes(1);

				fireEvent.click(tdList[0]);
				expect(tdOnClick).toHaveBeenCalledTimes(1);
			});
		});

		describe('loading mode', () => {
			describe('with rows', () => {
				beforeEach(() => {
					(Spinner as unknown as jest.Mock).mockImplementation((props) => {
						const { size, testId } = props;

						return (
							<div data-size={size} data-testid={testId}>
								&nbsp;
							</div>
						);
					});
				});

				it('should render a loading container with a large spinner when there is more than 2 rows', () => {
					render(<DynamicTableStateless rows={rows} testId={testId} isLoading />);
					const initiallySpinner = screen.getByTestId(`${testId}--loadingSpinner`);
					expect(initiallySpinner).toHaveAttribute('data-size', 'large');
				});

				it('Should render a loading container with a small spinner when there is 2 or less than 2 rows', () => {
					render(<DynamicTableStateless rows={rows.slice(-2)} testId={testId} isLoading />);
					const spinner = screen.getByTestId(`${testId}--loadingSpinner`);
					expect(spinner).toHaveAttribute('data-size', 'small');
				});

				it('should override the spinner size on demand', () => {
					render(
						<DynamicTableStateless
							rows={rows}
							loadingSpinnerSize="small"
							testId={testId}
							isLoading
						/>,
					);
					const spinner = screen.getByTestId(`${testId}--loadingSpinner`);
					expect(spinner).toHaveAttribute('data-size', 'small');
				});

				it('should have inert table when isLoading', () => {
					render(<DynamicTableStateless rows={rows} testId={testId} isLoading />);

					const table = screen.getByRole('table');
					expect(table).toHaveAttribute('inert');
				});
			});

			describe('without rows (empty)', () => {
				it('should render a blank view of a fixed height when the empty view is defined', () => {
					render(
						<DynamicTableStateless emptyView={<div>No rows</div>} testId={testId} isLoading />,
					);

					const emptyViewWithFixedHeight = screen.getByTestId(
						`${testId}--empty-view-with-fixed-height`,
					);
					expect(emptyViewWithFixedHeight).toBeInTheDocument();
				});

				it('should render a blank view of a fixed height when the empty view is not defined', () => {
					render(<DynamicTableStateless testId={testId} isLoading />);
					const emptyViewWithFixedHeight = screen.getByTestId(
						`${testId}--empty-view-with-fixed-height`,
					);
					expect(emptyViewWithFixedHeight).toBeInTheDocument();
				});
			});
		});

		describe('should invoke callbacks', () => {
			const onSetPage = jest.fn();
			const onSort = jest.fn();
			const jsx = (
				<DynamicTableStateless
					rowsPerPage={2}
					page={2}
					head={headMock1}
					rows={rows}
					onSetPage={onSetPage}
					onSort={onSort}
					testId={testId}
				/>
			);
			const onSortArg = {
				key: 'first_name',
				sortOrder: 'ASC',
				item: {
					key: 'first_name',
					content: 'First name',
					isSortable: true,
				},
			};

			beforeEach(() => {
				onSetPage.mockReset();
				onSort.mockReset();
			});

			it('should run onSort when clicked', async () => {
				render(jsx);
				const sortButton = screen.getAllByRole('button')[0];

				await userEvent.click(sortButton);
				expect(onSort).toHaveBeenCalledTimes(1);
				expect(onSort).toHaveBeenCalledWith(onSortArg, expect.anything());
			});

			it('should run onSort with space key pressed', async () => {
				render(jsx);
				const sortButton = screen.getAllByRole('button')[0];

				await userEvent.type(sortButton, '{space}');

				expect(onSort).toHaveBeenCalledTimes(1);
				expect(onSort).toHaveBeenCalledWith(onSortArg, expect.anything());
			});

			it('should run onSort with enter key pressed', async () => {
				render(jsx);
				const sortButton = screen.getAllByRole('button')[0];

				// Must be done this way because userEvent fires both a click event and
				// a keyDown event. By focusing and using the keyboard, we bypass this
				// unwanted behavior.
				sortButton.focus();
				await userEvent.keyboard('{enter}');

				expect(onSort).toHaveBeenCalledTimes(1);
				expect(onSort).toHaveBeenCalledWith(onSortArg, expect.anything());
			});

			it('onSetPage', () => {
				render(jsx);
				const paginationFirstButton = screen.getByTestId(`${testId}--pagination--page-0`);
				fireEvent.click(paginationFirstButton);
				expect(onSetPage).toHaveBeenCalledTimes(1);
				expect(onSetPage).toHaveBeenCalledWith(1, expect.any(UIAnalyticsEvent));
			});
		});
	});

	describe('stateful', () => {
		it('should display paginated data after navigating to a different page', () => {
			render(
				<DynamicTable
					rowsPerPage={2}
					defaultPage={2}
					head={headMock1}
					rows={rows}
					testId={testId}
				/>,
			);
			const paginationFirstButton = screen.getByTestId(`${testId}--pagination--page-0`);
			fireEvent.click(paginationFirstButton);

			const tdTestIdPattern = new RegExp(`${testId}--cell`);
			const tdList = screen.getAllByTestId(tdTestIdPattern);

			expect(tdList[0]).toContainHTML('Barack');
			expect(tdList[1]).toContainHTML('Obama');
			expect(tdList[2]).toContainHTML('hillary');
			expect(tdList[3]).toContainHTML('clinton');
		});

		it('should sort data', () => {
			render(<DynamicTable head={headMock1} rows={rows} testId={testId} />);
			const sortButton = screen.getAllByRole('button')[0];
			fireEvent.click(sortButton);

			const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const lastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);

			expect(firstNameColumn[0]).toContainHTML('Barack');
			expect(lastNameColumn[0]).toContainHTML('Obama');
			expect(firstNameColumn[1]).toContainHTML('Donald');
			expect(lastNameColumn[1]).toContainHTML('Trump');
			expect(firstNameColumn[2]).toContainHTML('hillary');
			expect(lastNameColumn[2]).toContainHTML('clinton');
		});

		it('should sort numeric data correctly, listed before strings or empty values', () => {
			render(<DynamicTable head={headNumeric} rows={rowsNumeric} testId={testId} />);

			const sortNumberColumnButton = screen.getAllByRole('button')[1];
			fireEvent.click(sortNumberColumnButton);

			const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const arbitraryNumeric = screen.getAllByTestId(`${testId}--cell-1`);

			expect(firstNameColumn[0]).toContainHTML('Negative One');
			expect(arbitraryNumeric[0]).toContainHTML('-1');
			expect(arbitraryNumeric[1]).toContainHTML('0');
			expect(arbitraryNumeric[2]).toContainHTML('1');
			expect(arbitraryNumeric[3]).toContainHTML('');
			expect(arbitraryNumeric[4]).toContainHTML(' ');
			expect(arbitraryNumeric[5]).toContainHTML('1');
			expect(arbitraryNumeric[8]).toContainHTML('a string');
		});

		it('should sort grouped numbers in strings', () => {
			render(<DynamicTable head={headNumeric} rows={rowsNumeric} testId={testId} />);

			const sortNumberColumnButton = screen.getAllByRole('button')[1];
			fireEvent.click(sortNumberColumnButton);

			const arbitraryNumeric = screen.getAllByTestId(`${testId}--cell-1`);

			expect(arbitraryNumeric[5]).toContainHTML('1');
			expect(arbitraryNumeric[6]).toContainHTML('5');
			expect(arbitraryNumeric[7]).toContainHTML('10');
		});

		it('should preserve sorting, even after updating table dynamically', () => {
			const { rerender } = render(<DynamicTable head={headMock1} rows={rows} testId={testId} />);

			const sortButton = screen.getAllByRole('button')[0];
			fireEvent.click(sortButton);

			const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const lastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);
			expect(firstNameColumn[0]).toContainHTML('Barack');
			expect(lastNameColumn[0]).toContainHTML('Obama');

			const newData = {
				cells: [
					{
						key: 'abli',
						content: 'Abraham',
					},
					{
						content: 'Lincon',
					},
				],
			};

			const newRows = [...rows, newData];
			rerender(<DynamicTable head={headMock1} rows={newRows} testId={testId} />);

			const updatedFirstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const updatedLastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);

			expect(updatedFirstNameColumn[0]).toContainHTML('Abraham');
			expect(updatedLastNameColumn[0]).toContainHTML('Lincon');
			expect(updatedFirstNameColumn[1]).toContainHTML('Barack');
			expect(updatedLastNameColumn[1]).toContainHTML('Obama');
		});

		it('should use new sortKey and sortOrder passed as prop for sorting the table', () => {
			const { rerender } = render(<DynamicTable head={headMock1} rows={rows} testId={testId} />);

			const thList = screen.getAllByTestId(`${testId}--head--cell`);
			fireEvent.click(thList[0]);

			const firstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const lastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);
			expect(firstNameColumn[0]).toContainHTML('Barack');
			expect(lastNameColumn[0]).toContainHTML('Obama');

			rerender(
				<DynamicTable
					head={headMock1}
					rows={rows}
					sortOrder="DESC"
					sortKey={secondSortKey}
					testId={testId}
				/>,
			);

			const updatedFirstNameColumn = screen.getAllByTestId(`${testId}--cell-0`);
			const updatedLastNameColumn = screen.getAllByTestId(`${testId}--cell-1`);

			expect(updatedFirstNameColumn[0]).toContainHTML('Donald');
			expect(updatedLastNameColumn[0]).toContainHTML('Trump');
			expect(updatedFirstNameColumn[1]).toContainHTML('Barack');
			expect(updatedLastNameColumn[1]).toContainHTML('Obama');
		});

		it('should preserve page after applying sorting and updating table dynamically', () => {
			const { rerender } = render(
				<DynamicTable
					head={headMock1}
					rows={rows}
					rowsPerPage={2}
					defaultPage={2}
					testId={testId}
				/>,
			);

			const thList = screen.getAllByTestId(`${testId}--head--cell`);
			fireEvent.click(thList[0]);

			const currentPage2 = screen.getByTestId(`${testId}--pagination--current-page-1`);
			expect(currentPage2).toBeInTheDocument();

			const newData = {
				cells: [
					{
						key: 'abli',
						content: 'Abraham',
					},
					{
						content: 'Lincon',
					},
				],
			};
			const newRows = [...rows, newData];

			rerender(
				<DynamicTable
					head={headMock1}
					rows={newRows}
					rowsPerPage={2}
					defaultPage={2}
					testId={testId}
				/>,
			);

			const updatedCurrentPage2 = screen.getByTestId(`${testId}--pagination--current-page-1`);
			expect(updatedCurrentPage2).toBeInTheDocument();
		});
	});
});
