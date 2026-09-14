import React from 'react';
import type { CellWithSortingProps } from '../../../../react/nodes/tableCell';
import { TableHeader } from '../../../../react/nodes/tableCell';
import { MODE, PLATFORM } from '../../../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { RendererCssClassName } from '../../../../consts';
import { SortOrder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const MOCK_SORTING_ICON_ID = 'mock-sort-icon';

jest.mock('@atlaskit/editor-common/table', () => ({
	__esModule: true,
	SortingIcon: (props: any) => <div data-testid={MOCK_SORTING_ICON_ID} {...props} />,
}));

const renderInTable = (cell: React.ReactNode) =>
	renderWithIntl(
		<table>
			<tbody>
				<tr>{cell}</tr>
			</tbody>
		</table>,
	);

describe('Renderer - React/Nodes/TableHeader', () => {
	const baseProps = {
		colspan: 6,
		rowspan: 3,
		background: '#fab',
		colwidth: [10],
	};

	describe('withCellProps', () => {
		it('should create a <th>-tag', () => {
			renderInTable(<TableHeader />);

			expect(screen.getByRole('columnheader').tagName).toEqual('TH');
		});

		it('should render the <th> props', () => {
			renderInTable(<TableHeader {...baseProps} />);

			const tableHeader = screen.getByRole('columnheader');

			expect(tableHeader).toHaveAttribute('rowspan', '3');
			expect(tableHeader).toHaveAttribute('colspan', '6');
			expect(tableHeader).toHaveAttribute('data-colwidth', '10');
			expect(tableHeader).toHaveStyle({ backgroundColor: '#fab' });
		});

		it('should render the colwidths', () => {
			renderInTable(<TableHeader colwidth={[10, 12, 14]} />);

			expect(screen.getByRole('columnheader')).toHaveAttribute('data-colwidth', '10,12,14');
		});

		it('should capture and report a11y violations', async () => {
			const { container } = renderInTable(<TableHeader {...baseProps}>content</TableHeader>);

			await expect(container).toBeAccessible();
		});
	});

	describe('withSortableColumn', () => {
		const WithSortableColumn = (
			props: React.PropsWithChildren<Omit<CellWithSortingProps, 'intl'>>,
		) => <TableHeader {...props} isHeaderRow />;

		describe('when allowColumnSorting is the default value', () => {
			it('should not add sortable class name', () => {
				renderInTable(<WithSortableColumn />);

				expect(screen.getByRole('columnheader')).not.toHaveClass(
					RendererCssClassName.SORTABLE_COLUMN_WRAPPER,
				);
			});
		});

		describe('when allowColumnSorting is false', () => {
			it('should not add sortable class name', () => {
				renderInTable(<WithSortableColumn allowColumnSorting={false} />);

				expect(screen.getByRole('columnheader')).not.toHaveClass(
					RendererCssClassName.SORTABLE_COLUMN_WRAPPER,
				);
			});
		});

		describe('when allowColumnSorting is true', () => {
			it('should add sortable class name', () => {
				renderInTable(<WithSortableColumn allowColumnSorting />);

				expect(screen.getByRole('columnheader')).toHaveClass(
					RendererCssClassName.SORTABLE_COLUMN_WRAPPER,
				);
			});

			describe('when onSorting function exist', () => {
				let onSorting: any;
				const renderWrapper = (children?: React.ReactNode) =>
					renderInTable(
						<WithSortableColumn allowColumnSorting columnIndex={0} onSorting={onSorting}>
							{children}
						</WithSortableColumn>,
					);
				beforeEach(() => {
					onSorting = jest.fn();
				});

				it('should call onSorting when clicking the sort button', async () => {
					renderWrapper();

					await userEvent.click(screen.getByTestId(MOCK_SORTING_ICON_ID));

					expect(onSorting).toHaveBeenCalled();
				});

				it('should not call onSorting when clicking the wrapper', async () => {
					renderWrapper();

					await userEvent.click(screen.getByRole('columnheader'));

					expect(onSorting).not.toHaveBeenCalled();
				});

				const keys = [' ', 'Enter', 'Spacebar'];

				it.each(keys)(
					'should call onSorting when %s key is pressed and the sort button is the target',
					(key) => {
						renderWrapper();

						fireEvent.keyDown(screen.getByTestId(MOCK_SORTING_ICON_ID), { key });

						expect(onSorting).toHaveBeenCalled();
					},
				);

				it.each(keys)(
					'should not call onSorting when %s key is pressed and the wrapper is the target',
					(key) => {
						renderWrapper();

						fireEvent.keyDown(screen.getByRole('columnheader'), { key });

						expect(onSorting).not.toHaveBeenCalled();
					},
				);
			});
		});

		describe('call onSorting changing the sort order', () => {
			let onSorting: any;
			beforeEach(() => {
				onSorting = jest.fn();
			});

			it.each<{ from?: SortOrder; to: SortOrder }>([
				{ from: SortOrder.NO_ORDER, to: SortOrder.ASC },
				{ from: SortOrder.ASC, to: SortOrder.DESC },
				{ from: SortOrder.DESC, to: SortOrder.NO_ORDER },
				{ from: undefined, to: SortOrder.NO_ORDER },
			])('should change %o ', async ({ from, to }) => {
				renderInTable(
					<WithSortableColumn
						sortOrdered={from}
						allowColumnSorting
						columnIndex={0}
						onSorting={onSorting}
					/>,
				);

				await userEvent.click(screen.getByTestId(MOCK_SORTING_ICON_ID));

				expect(onSorting).toHaveBeenCalledWith(0, to);
			});
		});
	});

	describe('#fireAnalyticsEvent', () => {
		describe('when onSorting and columnIndex is available', () => {
			it('should call the function with SORT_COLUMN_NOT_ALLOWED', async () => {
				const fireAnalyticsEvent = jest.fn();
				renderInTable(
					<TableHeader
						fireAnalyticsEvent={fireAnalyticsEvent}
						columnIndex={1}
						allowColumnSorting
						isHeaderRow
					/>,
				);

				await userEvent.click(screen.getByTestId(MOCK_SORTING_ICON_ID));

				expect(fireAnalyticsEvent).toHaveBeenCalledWith({
					action: ACTION.SORT_COLUMN_NOT_ALLOWED,
					actionSubject: ACTION_SUBJECT.TABLE,
					attributes: {
						platform: PLATFORM.WEB,
						mode: MODE.RENDERER,
					},
					eventType: EVENT_TYPE.TRACK,
				});
			});
		});

		describe('when onSorting is not available', () => {
			it('should call the function with SORT_COLUMN_NOT_ALLOWED', async () => {
				const fireAnalyticsEvent = jest.fn();
				const onSorting = jest.fn();
				renderInTable(
					<TableHeader
						fireAnalyticsEvent={fireAnalyticsEvent}
						onSorting={onSorting}
						columnIndex={1}
						allowColumnSorting
						isHeaderRow
					/>,
				);

				await userEvent.click(screen.getByTestId(MOCK_SORTING_ICON_ID));

				expect(fireAnalyticsEvent).toHaveBeenCalledWith({
					action: ACTION.SORT_COLUMN,
					actionSubject: ACTION_SUBJECT.TABLE,
					attributes: {
						platform: PLATFORM.WEB,
						mode: MODE.RENDERER,
						columnIndex: 1,
						sortOrder: SortOrder.NO_ORDER,
					},
					eventType: EVENT_TYPE.TRACK,
				});
			});
		});

		describe('when columnIndex is null', () => {
			it('should call the function with SORT_COLUMN_NOT_ALLOWED', async () => {
				const fireAnalyticsEvent = jest.fn();
				const onSorting = jest.fn();
				renderInTable(
					<TableHeader
						onSorting={onSorting}
						fireAnalyticsEvent={fireAnalyticsEvent}
						allowColumnSorting
						isHeaderRow
					/>,
				);

				await userEvent.click(screen.getByTestId(MOCK_SORTING_ICON_ID));

				expect(fireAnalyticsEvent).toHaveBeenCalledWith({
					action: ACTION.SORT_COLUMN_NOT_ALLOWED,
					actionSubject: ACTION_SUBJECT.TABLE,
					attributes: {
						platform: PLATFORM.WEB,
						mode: MODE.RENDERER,
					},
					eventType: EVENT_TYPE.TRACK,
				});
			});
		});
	});
});
