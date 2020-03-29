import React from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import ManagedPagination from './managedPagination';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { ASC, DESC, SMALL, LARGE } from '../internal/constants';
import {
  getPageRows,
  validateSortKey,
  assertIsSortable,
} from '../internal/helpers';
import TableHead from './TableHead';
import Body from './Body';
import RankableTableBody from './rankable/Body';
import LoadingContainer from './LoadingContainer';
import LoadingContainerAdvanced from './LoadingContainerAdvanced';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/EmptyBody';
import { Table, Caption, PaginationWrapper } from '../styled/DynamicTable';
import {
  StatelessProps as Props,
  RowCellType,
  RankStart,
  RankEnd,
  SortOrderType,
} from '../types';

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
    this.onSetPage(1, undefined);

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
    } = this.props;

    const rowsLength = rows && rows.length;
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
      ref: (el: any) => {
        this.tableBody = el;
      },
      testId,
    };
    const totalPages =
      rowsLength && rowsPerPage ? Math.ceil(rowsLength / rowsPerPage) : 0;
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
        >
          <Table
            isFixedSize={isFixedSize}
            data-testid={testId && `${testId}--table`}
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
          <LoadingContainer isLoading={isLoading} spinnerSize={LARGE}>
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
