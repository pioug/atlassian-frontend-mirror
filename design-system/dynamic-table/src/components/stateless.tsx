import React, { forwardRef, lazy, Suspense, useEffect, useRef, useState } from 'react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
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

const DynamicTable = ({
	caption,
	head,
	highlightedRowIndex,
	rows,
	sortKey,
	sortOrder,
	loadingLabel,
	onPageRowsUpdate,
	testId,
	totalRows: passedDownTotalRows,
	label,
	isLoading = false,
	isFixedSize = false,
	rowsPerPage = Infinity,
	onSetPage = noop,
	onSort: providedOnSort = noop,
	page = 1,
	emptyView,
	isRankable = false,
	isRankingDisabled = false,
	onRankStart = noop,
	onRankEnd: providedOnRankEnd = noop,
	loadingSpinnerSize,
	paginationi18n = {
		prev: 'Previous',
		next: 'Next',
		label: 'Pagination',
		pageLabel: 'Page',
	},
}: Props) => {
	const [isRanking, setIsRanking] = useState(false);
	const tableBodyRef = useRef<HTMLTableSectionElement>(null);

	const onSort = usePlatformLeafEventHandler({
		fn: providedOnSort,
		action: 'sorted',
		componentName: 'dynamicTable',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	const onRankEnd = usePlatformLeafEventHandler<RankEnd>({
		fn: providedOnRankEnd,
		action: 'ranked',
		componentName: 'dynamicTable',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	useEffect(() => {
		validateSortKey(sortKey, head);
		assertIsSortable(head);
	}, [sortKey, head]);

	const onSortHandler = (item: RowCellType) => () => {
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

	const onSetPageHandler = (page: number, event?: UIAnalyticsEvent) => {
		onSetPage(page, event);
	};

	const onRankStartHandler = (params: RankStart) => {
		setIsRanking(true);
		onRankStart(params);
	};

	const onRankEndHandler = (params: RankEnd) => {
		setIsRanking(false);
		onRankEnd(params);
	};

	const getSpinnerSize = () => {
		if (loadingSpinnerSize) {
			return loadingSpinnerSize;
		}

		return getPageRows(rows || [], page, rowsPerPage).length > 2 ? LARGE : SMALL;
	};

	const renderEmptyBody = () => {
		if (isLoading) {
			return <EmptyViewWithFixedHeight testId={testId} />;
		}

		return emptyView && <EmptyViewContainer testId={testId}>{emptyView}</EmptyViewContainer>;
	};

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

	const rowsExist = !!rowsLength;

	const spinnerSize = getSpinnerSize();
	const emptyBody = renderEmptyBody();

	return (
		<>
			<LoadingContainerAdvanced
				isLoading={isLoading && rowsExist}
				spinnerSize={spinnerSize}
				targetRef={() => tableBodyRef.current}
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
							onSort={onSortHandler}
							sortKey={sortKey}
							sortOrder={sortOrder}
							isRanking={isRanking}
							isRankable={isRankable}
							testId={testId}
						/>
					)}
					{rowsExist && (
						<TableBody
							ref={tableBodyRef}
							highlightedRowIndex={highlightedRowIndex}
							rows={rows}
							head={head}
							sortKey={sortKey}
							sortOrder={sortOrder}
							rowsPerPage={rowsPerPage}
							page={getPageNumber}
							isFixedSize={isFixedSize || false}
							onPageRowsUpdate={onPageRowsUpdate}
							isTotalPagesControlledExternally={isTotalPagesControlledExternally}
							testId={testId}
							isRankable={isRankable}
							isRanking={isRanking}
							onRankStart={onRankStartHandler}
							onRankEnd={onRankEndHandler}
							isRankingDisabled={isRankingDisabled || isLoading || false}
						/>
					)}
				</Table>
			</LoadingContainerAdvanced>
			{totalPages <= 1 ? null : ( // only show pagination if there's MORE than 1 page
				<PaginationWrapper testId={testId}>
					<ManagedPagination
						value={getPageNumber}
						onChange={onSetPageHandler}
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
};

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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DynamicTable;
