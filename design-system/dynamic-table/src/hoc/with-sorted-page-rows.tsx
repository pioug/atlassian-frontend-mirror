import React from 'react';

import { ASC } from '../internal/constants';
import { getPageRows, validateSortKey } from '../internal/helpers';
import { type HeadType, type RowCellType, type RowType, type SortOrderType } from '../types';

const getSortingCellValue = (cells: RowCellType[], head: HeadType, sortKey: string) => {
	for (let i = 0; i < cells.length; i++) {
		if (head.cells[i] && head.cells[i]?.key === sortKey) {
			return cells[i]?.key;
		}
	}

	return undefined;
};

// sort all rows based on sort key and order
const getSortedRows = (
	head?: HeadType,
	rows?: Array<RowType>,
	sortKey?: string,
	sortOrder?: SortOrderType,
) => {
	if (!sortKey || !head) {
		return rows;
	}
	if (!rows) {
		return [];
	}

	const modifier = sortOrder === ASC ? 1 : -1;

	// Re-initialising an I18n Collator on every sort is performance intensive, thus constructed outside
	const collator = new Intl.Collator(undefined, {
		numeric: true,
		sensitivity: 'accent',
	});

	// Get copy of rows to avoid sorting prop in place
	const sortableRows = Array.from(rows);

	// Reorder rows in table based on sorting cell value
	// Algorithm will sort numerics or strings, but not both
	return sortableRows.sort((a, b) => {
		const valA = getSortingCellValue(a.cells, head, sortKey);
		const valB = getSortingCellValue(b.cells, head, sortKey);

		if (valA === undefined || valB === undefined) {
			return modifier;
		}

		if (typeof valA !== typeof valB) {
			// numbers are always grouped higher in the sort
			if (typeof valA === 'number') {
				return -1;
			}
			if (typeof valB === 'number') {
				return 1;
			}
			// strings are grouped next
			if (typeof valA === 'string') {
				return -1;
			}
			if (typeof valB === 'string') {
				return 1;
			}
		}

		if (typeof valA === 'string' && typeof valB === 'string') {
			return modifier * collator.compare(valA, valB);
		}

		if ((!valA && valA !== 0) || valA < valB) {
			return -modifier;
		}
		if ((!valB && valB !== 0) || valA > valB) {
			return modifier;
		}
		if (valA === valB) {
			return 0;
		}
		return 1;
	});
};

export interface TableProps {
	head?: HeadType;
	page?: number;
	rows?: Array<RowType>;
	rowsPerPage?: number;
	sortKey?: string;
	sortOrder?: SortOrderType;
	onPageRowsUpdate?: (pageRows: Array<RowType>) => void;
}

export interface WithSortedPageRowsProps {
	pageRows: Array<RowType>;
	isTotalPagesControlledExternally?: boolean;
}

// get one page of data in table, sorting all rows previously
export default function withSortedPageRows<
	WrappedComponentProps extends WithSortedPageRowsProps & TableProps,
	RefType = HTMLTableSectionElement,
>(WrappedComponent: React.ComponentType<WrappedComponentProps>) {
	type InternalWithSortedPageRowsProps = Omit<WrappedComponentProps & TableProps, 'pageRows'> & {
		forwardedRef?: React.Ref<RefType>;
	};

	// eslint-disable-next-line @repo/internal/react/no-class-components
	class WithSortedPageRows extends React.Component<
		InternalWithSortedPageRowsProps,
		{ pageRows: Array<RowType> }
	> {
		state = { pageRows: [] };

		static getDerivedStateFromProps(
			props: InternalWithSortedPageRowsProps,
			state: { pageRows: Array<RowType> },
		) {
			const {
				rows,
				head,
				sortKey,
				sortOrder,
				page,
				rowsPerPage,
				isTotalPagesControlledExternally,
			} = props;

			validateSortKey(sortKey, head);
			let sortedRows: Array<RowType>;
			let pageRows: Array<RowType>;
			if (isTotalPagesControlledExternally) {
				sortedRows = rows as RowType[];
				pageRows = rows as RowType[];
			} else {
				sortedRows = getSortedRows(head, rows, sortKey, sortOrder) || [];
				pageRows = getPageRows(sortedRows, page, rowsPerPage);
			}

			return { ...state, pageRows };
		}

		componentDidMount() {
			this.props.onPageRowsUpdate && this.props.onPageRowsUpdate(this.state.pageRows);
		}

		componentDidUpdate(
			_prevProps: InternalWithSortedPageRowsProps,
			prevState: { pageRows: Array<RowType> },
		) {
			if (this.props.onPageRowsUpdate && this.state.pageRows !== prevState.pageRows) {
				this.props.onPageRowsUpdate(this.state.pageRows);
			}
		}

		render() {
			const { rows, head, sortKey, sortOrder, rowsPerPage, page, forwardedRef, ...restProps } =
				this.props;

			return (
				<WrappedComponent
					//@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
					pageRows={this.state.pageRows}
					head={head}
					{...(restProps as WrappedComponentProps)}
					ref={forwardedRef}
				/>
			);
		}
	}

	return React.forwardRef<RefType, InternalWithSortedPageRowsProps>((props, ref) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore: to unblock React 18.2.0 -> 18.3.1 version bump in Jira
		return <WithSortedPageRows {...props} forwardedRef={ref} />;
	});
}
