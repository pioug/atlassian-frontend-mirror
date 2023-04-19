import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';

import { reorderRows } from '../internal/helpers';
import { RankEnd, RowType, SortOrderType, StatefulProps } from '../types';

import DynamicTableStateless from './stateless';

interface State {
  page?: number;
  sortKey?: string;
  sortOrder?: SortOrderType;
  rows?: RowType[];
}

/**
 * __Dynamic Table__
 *
 * A table displays rows of data with built-in pagination, sorting, and re-ordering functionality.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/dynamic-table)
 * - [Code](https://bitbucket.org/atlassian/atlassian-frontend/packages/design-system/dynamic-table)
 *
 * @example
 * ```jsx
 * import DynamicTable from '@atlaskit/dynamic-table';
 *
 * export default function TableUncontrolled() {
 *  return (
 *   <DynamicTable
 *    head={head}
 *    rows={rows}
 *    rowsPerPage={10}
 *    defaultPage={1}
 *    loadingSpinnerSize="large"
 *    isLoading={false}
 *   />
 *  );
 * }
 * ```
 */
export default class DynamicTable extends React.Component<
  StatefulProps,
  State
> {
  static defaultProps = {
    defaultPage: 1,
    isLoading: false,
    isFixedSize: false,
    isRankable: false,
    onSetPage: noop,
    onSort: noop,
    rowsPerPage: Infinity,
  };

  state = {
    page: this.props.defaultPage,
    sortKey: this.props.defaultSortKey,
    sortOrder: this.props.defaultSortOrder,
    rows: this.props.rows,
  };

  UNSAFE_componentWillReceiveProps(newProps: StatefulProps) {
    const sortKey = newProps.sortKey || this.state.sortKey;
    const sortOrder = newProps.sortOrder || this.state.sortOrder;
    const page = newProps.page || this.state.page;
    this.setState({
      page,
      sortKey,
      sortOrder,
      rows: newProps.rows,
    });
  }

  onSetPageHandler = (page: number, analyticsEvent?: UIAnalyticsEvent) => {
    const { onSetPage } = this.props;
    if (onSetPage) {
      onSetPage(page, analyticsEvent);
      this.setState({ page });
    }
  };

  onSortHandler = (
    { key, item, sortOrder }: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { onSort } = this.props;
    if (onSort) {
      onSort({ key, item, sortOrder }, analyticsEvent);
      this.setState({ sortKey: key, sortOrder });
    }
  };

  onRankEndIfExistsHandler = (params: RankEnd) => {
    if (this.props.onRankEnd) {
      this.props.onRankEnd(params);
    }
  };

  onRankEndHandler = (params: RankEnd) => {
    const { destination } = params;
    const { rows, page } = this.state;
    const { rowsPerPage } = this.props;

    if (!destination || !rows) {
      this.onRankEndIfExistsHandler(params);
      return;
    }

    const reordered = reorderRows(params, rows, page, rowsPerPage);

    this.setState({
      rows: reordered,
    });

    this.onRankEndIfExistsHandler(params);
  };

  render() {
    const { page, sortKey, sortOrder, rows } = this.state;
    const {
      caption,
      emptyView,
      head,
      highlightedRowIndex,
      loadingSpinnerSize,
      isLoading,
      isFixedSize,
      isRankable,
      isRankingDisabled,
      rowsPerPage,
      paginationi18n,
      onRankStart,
      onPageRowsUpdate,
      testId,
      label,
    } = this.props;

    return (
      <DynamicTableStateless
        paginationi18n={paginationi18n}
        caption={caption}
        emptyView={emptyView}
        head={head}
        highlightedRowIndex={highlightedRowIndex}
        loadingSpinnerSize={loadingSpinnerSize}
        isLoading={isLoading}
        isFixedSize={isFixedSize}
        onSetPage={this.onSetPageHandler}
        onSort={this.onSortHandler}
        page={page}
        rows={rows}
        rowsPerPage={rowsPerPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        isRankable={isRankable}
        isRankingDisabled={isRankingDisabled}
        onRankEnd={this.onRankEndHandler}
        onRankStart={onRankStart}
        onPageRowsUpdate={onPageRowsUpdate}
        testId={testId}
        label={label}
      />
    );
  }
}
