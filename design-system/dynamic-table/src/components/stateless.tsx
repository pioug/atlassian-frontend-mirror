import React from 'react';

import {
  createAndFireEvent,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';

import { ASC, DESC, LARGE, SMALL } from '../internal/constants';
import {
  assertIsSortable,
  getPageRows,
  validateSortKey,
} from '../internal/helpers';
import { Caption, PaginationWrapper, Table } from '../styled/dynamic-table';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/empty-body';
import {
  StatelessProps as Props,
  RankEnd,
  RankStart,
  RowCellType,
  SortOrderType,
} from '../types';

import Body from './body';
import LoadingContainer from './loading-container';
import LoadingContainerAdvanced from './loading-container-advanced';
import ManagedPagination from './managed-pagination';
import RankableTableBody from './rankable/body';
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
  tableBody?: HTMLDivElement;

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
    if (
      this.props.sortKey !== nextProps.sortKey ||
      this.props.head !== nextProps.head
    ) {
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

    const sortOrderFormatted =
      key !== sortKey ? ASC : toggleSortOrder(sortOrder);
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

    return getPageRows(rows || [], page, rowsPerPage).length > 2
      ? LARGE
      : SMALL;
  };

  renderEmptyBody = () => {
    const { emptyView, isLoading, testId } = this.props;

    if (isLoading) {
      return <EmptyViewWithFixedHeight testId={testId} />;
    }

    return (
      emptyView && (
        <EmptyViewContainer testId={testId}>{emptyView}</EmptyViewContainer>
      )
    );
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
      totalPages =
        rowsLength && rowsPerPage ? Math.ceil(rowsLength / rowsPerPage) : 0;
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
      ref: (el: any) => {
        this.tableBody = el;
      },
      testId,
    };
    const rowsExist = !!rowsLength;

    const spinnerSize = this.getSpinnerSize();
    const emptyBody = this.renderEmptyBody();
    const canRank = isRankable && !sortKey;
    return (
      <>
        <LoadingContainerAdvanced
          isLoading={isLoading && rowsExist}
          spinnerSize={spinnerSize}
          targetRef={() => this.tableBody}
          testId={testId}
        >
          <Table
            isFixedSize={isFixedSize}
            aria-label={label}
            hasDataRow={rowsExist}
            testId={testId}
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
            {rowsExist &&
              (canRank ? (
                <RankableTableBody
                  {...bodyProps}
                  isRanking={this.state.isRanking}
                  onRankStart={this.onRankStartHandler}
                  onRankEnd={this.onRankEndHandler}
                  isRankingDisabled={isRankingDisabled || isLoading || false}
                />
              ) : (
                <Body {...bodyProps} />
              ))}
          </Table>
        </LoadingContainerAdvanced>
        {totalPages <= 1 ? null : ( // only show pagination if there's MORE than 1 page
          <PaginationWrapper>
            <ManagedPagination
              value={getPageNumber}
              onChange={this.onSetPageHandler}
              total={totalPages}
              i18n={paginationi18n}
              testId={testId}
            />
          </PaginationWrapper>
        )}
        {!rowsExist && emptyBody && (
          <LoadingContainer
            isLoading={isLoading}
            spinnerSize={LARGE}
            testId={testId}
          >
            {emptyBody}
          </LoadingContainer>
        )}
      </>
    );
  }
}

export { DynamicTable as DynamicTableWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
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
