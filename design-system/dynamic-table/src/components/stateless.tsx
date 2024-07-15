import React, { forwardRef, lazy, Suspense, useEffect, useState } from 'react';

import {
	createAndFireEvent,
	type UIAnalyticsEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';

import { ASC, DESC, LARGE, SMALL } from '../internal/constants';
import { assertIsSortable, getPageRows, validateSortKey } from '../internal/helpers';
import { Caption, PaginationWrapper, Table } from '../styled/dynamic-table';
import { EmptyViewContainer, EmptyViewWithFixedHeight } from '../styled/empty-body';
import {
	type HeadType,
	type StatelessProps as Props,
	type RankEnd,
	type RankStart,
	type RowCellType,
	type RowType,
	type SortOrderType,
} from '../types';

import Body from './body';
import { ErrorBoundary } from './error-boundary';
import LoadingContainer from './loading-container';
import LoadingContainerAdvanced from './loading-container-advanced';
import ManagedPagination from './managed-pagination';
import TableHead from './table-head';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

function toggleSortOrder(currentSortOrder?: SortOrderType) {
	switch (currentSortOrder) {
		case DESC:
			return ASC;
		case ASC:
			return DESC;
		default:
			return currentSortOrder;
	}
}

export interface State {
	isRanking: boolean;
}

class DynamicTable extends React.Component<Props, State> {
	tableBody = React.createRef<HTMLTableSectionElement>();

	state = {
		isRanking: false,
	};

	static defaultProps = {
		isLoading: false,
		isFixedSize: false,
		rowsPerPage: Infinity,
		onSetPage: noop,
		onSort: noop,
		page: 1,
		isRankable: false,
		isRankingDisabled: false,
		onRankStart: noop,
		onRankEnd: noop,
		paginationi18n: {
			prev: 'Previous',
			next: 'Next',
			label: 'Pagination',
			pageLabel: 'Page',
		},
	};

	UNSAFE_componentWillMount() {
		validateSortKey(this.props.sortKey, this.props.head);
		assertIsSortable(this.props.head);
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		if (this.props.sortKey !== nextProps.sortKey || this.props.head !== nextProps.head) {
			validateSortKey(nextProps.sortKey, nextProps.head);
		}
		if (this.props.head !== nextProps.head) {
			assertIsSortable(nextProps.head);
		}
	}

	onSortHandler = (item: RowCellType) => () => {
		const { sortKey, sortOrder, onSort, isRankable } = this.props;
		const { key } = item;
		if (!key) {
			return;
		}

		if (onSort && isRankable && key === sortKey && sortOrder === DESC) {
			onSort({ key: null, sortOrder: null, item });
			return;
		}

		const sortOrderFormatted = key !== sortKey ? ASC : toggleSortOrder(sortOrder);
		if (onSort) {
			onSort({ key, item, sortOrder: sortOrderFormatted });
		}
	};

	onSetPageHandler = (page: number, event?: UIAnalyticsEvent) => {
		const { onSetPage } = this.props;
		if (onSetPage) {
			onSetPage(page, event);
		}
	};

	onRankStartHandler = (params: RankStart) => {
		this.setState({
			isRanking: true,
		});

		if (this.props.onRankStart) {
			this.props.onRankStart(params);
		}
	};

	onRankEndHandler = (params: RankEnd) => {
		this.setState({
			isRanking: false,
		});

		if (this.props.onRankEnd) {
			this.props.onRankEnd(params);
		}
	};

	getSpinnerSize = () => {
		const { page, rows, rowsPerPage, loadingSpinnerSize } = this.props;

		if (loadingSpinnerSize) {
			return loadingSpinnerSize;
		}

		return getPageRows(rows || [], page, rowsPerPage).length > 2 ? LARGE : SMALL;
	};

	renderEmptyBody = () => {
		const { emptyView, isLoading, testId } = this.props;

		if (isLoading) {
			return <EmptyViewWithFixedHeight testId={testId} />;
		}

		return emptyView && <EmptyViewContainer testId={testId}>{emptyView}</EmptyViewContainer>;
	};

	render() {
		const {
			caption,
			head,
			highlightedRowIndex,
			isFixedSize,
			page,
			rows,
			rowsPerPage,
			sortKey,
			sortOrder,
			isLoading,
			loadingLabel,
			isRankable,
			isRankingDisabled,
			paginationi18n,
			onPageRowsUpdate,
			testId,
			totalRows: passedDownTotalRows,
			label,
		} = this.props;

		const rowsLength = rows && rows.length;
		let totalPages: number;
		// set a flag to denote the dynamic table might get only one page of data
		// for paginated data
		let isTotalPagesControlledExternally = false;
		if (
			passedDownTotalRows &&
			Number.isInteger(passedDownTotalRows) &&
			rowsPerPage &&
			rowsLength &&
			rowsLength <= passedDownTotalRows
		) {
			/**
			 * If total number of rows / records have been passed down as prop
			 * Then table is being fed paginated data from server or other sources
			 * In this case, we want to respect information passed down by server or external source
			 * Rather than relying on our computation based on number of rows
			 */
			totalPages = Math.ceil(passedDownTotalRows / rowsPerPage);
			isTotalPagesControlledExternally = true;
		} else {
			totalPages = rowsLength && rowsPerPage ? Math.ceil(rowsLength / rowsPerPage) : 0;
		}
		totalPages = totalPages < 1 ? 1 : totalPages;

		const getPageNumber = page! > totalPages ? totalPages : page; // page! required, because typescript can't yet see defaultProps to know that this won't be undefined

		const bodyProps = {
			highlightedRowIndex,
			rows,
			head,
			sortKey,
			sortOrder,
			rowsPerPage,
			page: getPageNumber,
			isFixedSize: isFixedSize || false,
			onPageRowsUpdate,
			isTotalPagesControlledExternally,
			ref: this.tableBody,
			testId,
		};
		const rowsExist = !!rowsLength;

		const spinnerSize = this.getSpinnerSize();
		const emptyBody = this.renderEmptyBody();

		return (
			<>
				<LoadingContainerAdvanced
					isLoading={isLoading && rowsExist}
					spinnerSize={spinnerSize}
					targetRef={() => this.tableBody.current}
					testId={testId}
					loadingLabel={loadingLabel}
				>
					<Table
						isFixedSize={isFixedSize}
						aria-label={label}
						hasDataRow={rowsExist}
						testId={testId}
						isLoading={isLoading}
					>
						{!!caption && <Caption>{caption}</Caption>}
						{head && (
							<TableHead
								head={head}
								onSort={this.onSortHandler}
								sortKey={sortKey}
								sortOrder={sortOrder}
								isRanking={this.state.isRanking}
								isRankable={isRankable}
								testId={testId}
							/>
						)}
						{rowsExist && (
							<TableBody
								{...bodyProps}
								isRankable={this.props.isRankable}
								isRanking={this.state.isRanking}
								onRankStart={this.onRankStartHandler}
								onRankEnd={this.onRankEndHandler}
								isRankingDisabled={isRankingDisabled || isLoading || false}
							/>
						)}
					</Table>
				</LoadingContainerAdvanced>
				{totalPages <= 1 ? null : ( // only show pagination if there's MORE than 1 page
					<PaginationWrapper testId={testId}>
						<ManagedPagination
							value={getPageNumber}
							onChange={this.onSetPageHandler}
							total={totalPages}
							i18n={paginationi18n}
							isDisabled={isLoading}
							testId={testId}
						/>
					</PaginationWrapper>
				)}
				{!rowsExist && emptyBody && (
					<LoadingContainer
						isLoading={isLoading}
						spinnerSize={LARGE}
						testId={testId}
						loadingLabel={loadingLabel}
					>
						{emptyBody}
					</LoadingContainer>
				)}
			</>
		);
	}
}

type TableBodyProps = {
	highlightedRowIndex?: number | number[];
	rows?: RowType[];
	head?: HeadType;
	sortKey?: string;
	sortOrder?: SortOrderType;
	rowsPerPage?: number;
	page?: number;
	isFixedSize: boolean;
	onPageRowsUpdate?: (pageRows: RowType[]) => void;
	isTotalPagesControlledExternally: boolean;
	testId?: string;

	isRankable?: boolean;
	isRanking: boolean;
	onRankStart: (rankStart: RankStart) => void;
	onRankEnd: (rankEnd: RankEnd) => void;
	isRankingDisabled: boolean;
};

const RankableTableBody = lazy(
	() => import(/* webpackChunkName: '@atlaskit-internal_dynamic-table' */ './rankable/body'),
);

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
	{ isRankable = false, isRanking, onRankStart, onRankEnd, isRankingDisabled, ...bodyProps },
	ref,
) {
	const canRank = isRankable && !bodyProps.sortKey;

	/**
	 * React 16 does not support SSR for lazy components,
	 * so we avoid rendering the `Suspense` on the server.
	 */
	const [canRenderRankable, setCanRenderRankable] = useState(false);
	useEffect(() => {
		if (canRank) {
			setCanRenderRankable(true);
		}
	}, [canRank]);

	const nonRankableBody = <Body ref={ref} {...bodyProps} />;

	return canRank && canRenderRankable ? (
		<ErrorBoundary fallback={nonRankableBody}>
			<Suspense fallback={nonRankableBody}>
				<RankableTableBody
					ref={ref}
					{...bodyProps}
					isRanking={isRanking}
					onRankStart={onRankStart}
					onRankEnd={onRankEnd}
					isRankingDisabled={isRankingDisabled}
				/>
			</Suspense>
		</ErrorBoundary>
	) : (
		nonRankableBody
	);
});

export { DynamicTable as DynamicTableWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

/**
 * __Dynamic table stateless__
 *
 * A stateless table that requires consumers to manage the sorting, drag and drop, and pagination.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/dynamic-table)
 * - [Code](https://bitbucket.org/atlassian/atlassian-frontend/packages/design-system/dynamic-table)
 */
const DynamicTableStateless = withAnalyticsContext({
	componentName: 'dynamicTable',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onSort: createAndFireEventOnAtlaskit({
			action: 'sorted',
			actionSubject: 'dynamicTable',
			attributes: {
				componentName: 'dynamicTable',
				packageName,
				packageVersion,
			},
		}),
		onRankEnd: createAndFireEventOnAtlaskit({
			action: 'ranked',
			actionSubject: 'dynamicTable',
			attributes: {
				componentName: 'dynamicTable',
				packageName,
				packageVersion,
			},
		}),
	})(DynamicTable),
);

export default DynamicTableStateless;
