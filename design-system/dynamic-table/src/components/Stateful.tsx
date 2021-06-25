import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { reorderRows } from '../internal/helpers';
import { RankEnd, RowType, SortOrderType, StatefulProps } from '../types';

import DynamicTableStateless from './Stateless';

interface State {
  page?: number;
  sortKey?: string;
  sortOrder?: SortOrderType;
  rows?: RowType[];
}

export default class DynamicTable extends React.Component<
  StatefulProps,
  State
> {
  static defaultProps = {
    defaultPage: 1,
    isLoading: false,
    isFixedSize: false,
    isRankable: false,
    onSetPage: () => {},
    onSort: () => {},
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

  onSetPage = (page: number, analyticsEvent?: UIAnalyticsEvent) => {
    const { onSetPage } = this.props;
    if (onSetPage) {
      onSetPage(page, analyticsEvent);
      this.setState({ page });
    }
  };

  onSort = (
    { key, item, sortOrder }: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { onSort } = this.props;
    if (onSort) {
      onSort({ key, item, sortOrder }, analyticsEvent);
      this.setState({ sortKey: key, sortOrder });
    }
  };

  onRankEndIfExists = (params: RankEnd) => {
    if (this.props.onRankEnd) {
      this.props.onRankEnd(params);
    }
  };

  onRankEnd = (params: RankEnd) => {
    const { destination } = params;
    const { rows, page } = this.state;
    const { rowsPerPage } = this.props;

    if (!destination || !rows) {
      this.onRankEndIfExists(params);
      return;
    }

    const reordered = reorderRows(params, rows, page, rowsPerPage);

    this.setState({
      rows: reordered,
    });

    this.onRankEndIfExists(params);
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
        onSetPage={this.onSetPage}
        onSort={this.onSort}
        page={page}
        rows={rows}
        rowsPerPage={rowsPerPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        isRankable={isRankable}
        isRankingDisabled={isRankingDisabled}
        onRankEnd={this.onRankEnd}
        onRankStart={onRankStart}
        onPageRowsUpdate={onPageRowsUpdate}
        testId={testId}
        label={label}
      />
    );
  }
}
