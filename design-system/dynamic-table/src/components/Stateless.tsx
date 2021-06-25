import React from 'react';

import {
  createAndFireEvent,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ASC, DESC, LARGE, SMALL } from '../internal/constants';
import {
  assertIsSortable,
  getPageRows,
  validateSortKey,
} from '../internal/helpers';
import { Caption, PaginationWrapper, Table } from '../styled/DynamicTable';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/EmptyBody';
import {
  StatelessProps as Props,
  RankEnd,
  RankStart,
  RowCellType,
  SortOrderType,
} from '../types';

import Body from './Body';
import LoadingContainer from './LoadingContainer';
import LoadingContainerAdvanced from './LoadingContainerAdvanced';
import ManagedPagination from './managedPagination';
import RankableTableBody from './rankable/Body';
import TableHead from './TableHead';

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
  tableBody?: React.ComponentType<any>;

  state = {
    isRanking: false,
  };

  static defaultProps = {
    isLoading: false,
    isFixedSize: false,
    rowsPerPage: Infinity,
    onSetPage: () => {},
    onSort: () => {},
    page: 1,
    isRankable: false,
    isRankingDisabled: false,
    onRankStart: () => {},
    onRankEnd: () => {},
    paginationi18n: {
      prev: 'Prev',
      next: 'Next',
      label: 'Pagination',
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

  onSort = (item: RowCellType) => () => {
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

  onSetPage = (page: number, event?: UIAnalyticsEvent) => {
    const { onSetPage } = this.props;
    if (onSetPage) {
      onSetPage(page, event);
    }
  };

  onRankStart = (params: RankStart) => {
    this.setState({
      isRanking: true,
    });

    if (this.props.onRankStart) {
      this.props.onRankStart(params);
    }
  };

  onRankEnd = (params: RankEnd) => {
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
    const { emptyView, isLoading } = this.props;

    if (isLoading) {
      return <EmptyViewWithFixedHeight />;
    }

    return emptyView && <EmptyViewContainer>{emptyView}</EmptyViewContainer>;
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
    const bodyProps = {
      highlightedRowIndex,
      rows,
      head,
      sortKey,
      sortOrder,
      rowsPerPage,
      page,
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
            data-testid={testId && `${testId}--table`}
            aria-label={label}
          >
            {!!caption && <Caption>{caption}</Caption>}
            {head && (
              <TableHead
                head={head}
                onSort={this.onSort}
                sortKey={sortKey}
                sortOrder={sortOrder}
                isRanking={this.state.isRanking}
                isRankable={canRank}
                testId={testId}
              />
            )}
            {rowsExist &&
              (canRank ? (
                <RankableTableBody
                  {...bodyProps}
                  isRanking={this.state.isRanking}
                  onRankStart={this.onRankStart}
                  onRankEnd={this.onRankEnd}
                  isRankingDisabled={isRankingDisabled || isLoading || false}
                />
              ) : (
                <Body {...bodyProps} />
              ))}
          </Table>
        </LoadingContainerAdvanced>
        {!totalPages ? null : (
          <PaginationWrapper>
            <ManagedPagination
              value={page}
              onChange={this.onSetPage}
              total={totalPages}
              i18n={paginationi18n}
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
