import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { HeadType, type SortOrderType, type StatelessProps } from '../../../types';
import DynamicTable from '../../stateless';

import {
	fourthSortKey,
	head,
	rowsWithKeys,
	secondSortKey,
	sortKey,
	thirdSortKey,
	visuallyRefreshedHead,
} from './_data';

const testId = 'dynamic--table--test--id';

type OverrideProps = {
	sortOrder?: SortOrderType;
	head?: HeadType;
};

const createProps = (overrides?: OverrideProps): StatelessProps => {
	return {
		head,
		rows: rowsWithKeys,
		sortKey,
		sortOrder: 'ASC',
		onSort: jest.fn(),
		onPageRowsUpdate: jest.fn(),
		testId,
		...overrides,
	};
};

ffTest.both('platform-component-visual-refresh', '', () => {
	test('onSort should change to ASC from DESC if table is not rankable', async () => {
		const props = createProps();
		render(<DynamicTable {...props} sortOrder="DESC" />);

		const sortButtons = screen.getAllByRole('button');
		await userEvent.click(sortButtons[0]);

		const item = { key: sortKey, content: 'First name', isSortable: true };

		expect(props.onSort).toHaveBeenCalledTimes(1);
		expect(props.onSort).toHaveBeenLastCalledWith(
			{
				key: sortKey,
				item,
				sortOrder: 'ASC',
			},
			expect.anything(),
		);
	});

	test('onSort should change to none if table is rankable and sort order was DESC', async () => {
		const props = createProps();
		render(<DynamicTable {...props} sortOrder="DESC" isRankable />);

		const sortButtons = screen.getAllByRole('button');
		await userEvent.click(sortButtons[0]);

		const item = { key: sortKey, content: 'First name', isSortable: true };

		expect(props.onSort).toHaveBeenCalledTimes(1);
		expect(props.onSort).toHaveBeenLastCalledWith(
			{
				key: null,
				item,
				sortOrder: null,
			},
			expect.anything(),
		);
	});

	test('onSort should change to DESC if table is rankable and sort order was ASC', async () => {
		const props = createProps();
		render(<DynamicTable {...props} sortOrder="ASC" isRankable />);

		const sortButtons = screen.getAllByRole('button');
		await userEvent.click(sortButtons[0]);

		const item = { key: sortKey, content: 'First name', isSortable: true };

		expect(props.onSort).toHaveBeenCalledTimes(1);
		expect(props.onSort).toHaveBeenLastCalledWith(
			{
				key: sortKey,
				item,
				sortOrder: 'DESC',
			},
			expect.anything(),
		);
	});

	test('onSort should change to ASC if table is rankable and was sorted using on different row', async () => {
		const props = createProps();
		render(<DynamicTable {...props} sortOrder="DESC" sortKey={secondSortKey} isRankable />);

		const sortButtons = screen.getAllByRole('button');
		await userEvent.click(sortButtons[0]);

		const item = { key: sortKey, content: 'First name', isSortable: true };

		expect(props.onSort).toHaveBeenCalledTimes(1);
		expect(props.onSort).toHaveBeenLastCalledWith(
			{
				key: sortKey,
				item,
				sortOrder: 'ASC',
			},
			expect.anything(),
		);
	});

	test('onPageRowsUpdate should be called on mount and on sorting change', () => {
		const props = createProps();
		const { rerender } = render(<DynamicTable {...props} />);

		expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(1);
		rerender(<DynamicTable {...props} sortOrder="DESC" />);
		expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(2);
	});

	test('totalRows dictate number of pages in pagination', () => {
		const props = createProps();
		render(<DynamicTable {...props} totalRows={6} rowsPerPage={4} />);

		/**
		 * 4 rows of data are present
		 * total number of records indicated to be 6
		 * Should create 2 pages
		 */
		const paginationButtonPattern = new RegExp(`${testId}--pagination--(current-)?page-`);
		const paginationButton = screen.getAllByTestId(paginationButtonPattern);
		expect(paginationButton).toHaveLength(2);
	});

	test('should work without totalRows being explicitly defined', () => {
		const props = createProps();
		render(<DynamicTable {...props} rowsPerPage={3} />);

		const paginationButtonPattern = new RegExp(`${testId}--pagination--(current-)?page-`);
		const paginationButton = screen.getAllByTestId(paginationButtonPattern);
		expect(paginationButton).toHaveLength(2);
	});

	test('pagination should not show if only one page', () => {
		const props = createProps();
		render(<DynamicTable {...props} totalRows={6} rowsPerPage={10} />);

		const pagination = screen.queryByTestId(`${testId}--pagination`);
		expect(pagination).not.toBeInTheDocument();
	});

	test('pagination should move to first page when total number of pages is 1', () => {
		const props = createProps();
		const { rerender } = render(
			<DynamicTable {...props} rowsPerPage={3} page={2} testId="myTable" />,
		);

		expect(screen.getByText('Thomas')).toBeInTheDocument(); // only showing 4th one
		expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

		rerender(<DynamicTable {...props} rowsPerPage={4} page={2} testId="myTable" />);

		expect(screen.getByText('hillary')).toBeInTheDocument();
		expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(4); // but we're back on page 1, showing all rows
	});

	test('pagination should move to last page when selected page is greater than total pages', () => {
		const props = createProps();
		const { rerender } = render(
			<DynamicTable {...props} rowsPerPage={1} page={4} testId="myTable" />,
		);

		expect(screen.getByText('Thomas')).toBeInTheDocument(); // only show 4th one
		expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

		rerender(<DynamicTable {...props} rowsPerPage={3} page={4} testId="myTable" />);

		expect(screen.getByText('Thomas')).toBeInTheDocument(); // only show 4th one
		expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(1); // we're on the 2nd page
	});
});

ffTest.on('platform-component-visual-refresh', 'visual refresh FG is enabled', () => {
	describe('Sort button', () => {
		test('sort button for a currently unsorted column should show sort icon on hover', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const partyColumnSortButtonIcon = sortButtonIcons[1];

			expect(partyColumnSortButtonIcon).not.toBeVisible();

			await userEvent.hover(partyColumnSortButton);

			await waitFor(() => {
				expect(partyColumnSortButtonIcon).toBeVisible();
			});
		});

		test('sort button for a currently unsorted column should show sort icon on focus with keyboard navigations', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });
			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const partyColumnSortButtonIcon = sortButtonIcons[1];

			expect(partyColumnSortButtonIcon).not.toBeVisible();

			await userEvent.click(firstNameColumnSortButton);
			await userEvent.tab();

			expect(partyColumnSortButton).toHaveFocus();
			await waitFor(() => {
				expect(partyColumnSortButtonIcon).toBeVisible();
			});
		});

		test('sort button icon should persist for the current sorted column', async () => {
			const props = createProps();
			render(<DynamicTable {...props} sortKey={thirdSortKey} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const firstNameColumnSortButtonIcon = sortButtonIcons[0];
			const partyColumnSortButtonIcon = sortButtonIcons[1];

			expect(firstNameColumnSortButtonIcon).not.toBeVisible();
			expect(partyColumnSortButtonIcon).toBeVisible();

			await userEvent.hover(firstNameColumnSortButton);

			expect(firstNameColumnSortButtonIcon).toBeVisible();
			expect(partyColumnSortButtonIcon).toBeVisible();
		});

		test('sort button icon should appear over icon on hover for a currently unsorted icon column', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const iconColumnSortButton = screen.getByRole('button', { name: 'starred' });
			const starIcon = screen.getByLabelText('starred');

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const iconColumnSortButtonIcon = sortButtonIcons[2];

			expect(iconColumnSortButtonIcon).not.toBeVisible();
			expect(starIcon).toBeVisible();

			await userEvent.hover(iconColumnSortButton);

			expect(iconColumnSortButtonIcon).toBeVisible();
			expect(starIcon).not.toBeVisible();
		});

		test('sort button icon should persist over icon for the current sorted icon column', async () => {
			const props = createProps();
			render(<DynamicTable {...props} sortKey={fourthSortKey} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });
			const starIcon = screen.queryByLabelText('starred');

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const iconColumnSortButtonIcon = sortButtonIcons[2];

			expect(iconColumnSortButtonIcon).toBeVisible();
			expect(starIcon).not.toBeVisible();

			await userEvent.hover(partyColumnSortButton);

			expect(iconColumnSortButtonIcon).toBeVisible();
			expect(starIcon).not.toBeVisible();
		});

		test('sort button icon should appear over icon on focus for a currently unsorted icon column', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const iconColumnSortButton = screen.getByRole('button', { name: 'starred' });
			const starIcon = screen.getByLabelText('starred');

			const sortButtonIcons = screen.getAllByTestId(/--(up|down)--icon/);
			const iconColumnSortButtonIcon = sortButtonIcons[2];

			expect(iconColumnSortButtonIcon).not.toBeVisible();
			expect(starIcon).toBeVisible();

			await userEvent.click(iconColumnSortButton);

			expect(iconColumnSortButtonIcon).toBeVisible();
			expect(starIcon).not.toBeVisible();
		});

		test('sort button tooltips should be default ascending sort values if not customised', async () => {
			const props = createProps();
			render(<DynamicTable {...props} sortKey={thirdSortKey} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			await userEvent.hover(partyColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort ascending' })).toBeVisible();
			});
		});

		test('sort button tooltips should be default descending sort values if not customised', async () => {
			const props = createProps({ sortOrder: 'DESC' });
			render(<DynamicTable {...props} sortKey={thirdSortKey} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			await userEvent.hover(partyColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort descending' })).toBeVisible();
			});
		});

		test('sort button ascending sort tooltip should be customisable otherwise use default value', async () => {
			const props = createProps({ head: visuallyRefreshedHead });
			render(<DynamicTable {...props} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });
			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			await userEvent.hover(firstNameColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort A to Z' })).toBeVisible();
			});

			await userEvent.hover(partyColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort descending' })).toBeVisible();
			});
		});

		test('sort button descending sort tooltip should be customisable otherwise use default value', async () => {
			const props = createProps({ sortOrder: 'DESC', head: visuallyRefreshedHead });
			render(<DynamicTable {...props} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });
			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			await userEvent.hover(firstNameColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort Z to A' })).toBeVisible();
			});

			await userEvent.hover(partyColumnSortButton);
			await waitFor(() => {
				expect(screen.getByRole('tooltip', { name: 'Sort descending' })).toBeVisible();
			});
		});

		test('sort button aria role description should be default if not customised', async () => {
			const props = createProps();
			render(<DynamicTable {...props} sortKey={thirdSortKey} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			await userEvent.hover(partyColumnSortButton);

			expect(partyColumnSortButton).toHaveAttribute('aria-roledescription', 'Sort button');
		});

		test('sort button aria role description should be customisable', async () => {
			const props = createProps({ head: visuallyRefreshedHead });
			render(<DynamicTable {...props} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });

			await userEvent.hover(firstNameColumnSortButton);

			expect(firstNameColumnSortButton).toHaveAttribute(
				'aria-roledescription',
				'Sort by first name',
			);
		});
	});
});

ffTest.off('platform-component-visual-refresh', 'visual refresh FG is disabled', () => {
	describe('Sort button', () => {
		test('sort button for a currently unsorted column should always be visible', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			expect(partyColumnSortButton).toBeVisible();

			await userEvent.hover(partyColumnSortButton);

			expect(partyColumnSortButton).toBeVisible();
		});

		test('sort button for a currently unsorted column should be visible on focus with keyboard navigations', async () => {
			const props = createProps();
			render(<DynamicTable {...props} />);

			const firstNameColumnSortButton = screen.getByRole('button', { name: 'First name' });
			const partyColumnSortButton = screen.getByRole('button', { name: 'Party' });

			expect(partyColumnSortButton).toBeVisible();

			await userEvent.click(firstNameColumnSortButton);
			await userEvent.tab();

			expect(partyColumnSortButton).toHaveFocus();
			await waitFor(() => {
				expect(partyColumnSortButton).toBeVisible();
			});
		});
	});
});
