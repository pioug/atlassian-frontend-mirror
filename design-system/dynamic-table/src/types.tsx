/* eslint-disable @repo/internal/react/consistent-types-definitions */
import React, { Ref } from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import type { Size as SizeType } from '@atlaskit/spinner';

export interface RowCellType {
  /**
   * Key to resolve sorting this cell in its column.
   */
  key?: string | number;
  /**
   * The number of columns a cell should span. Defaults to 1, and maxes out at the total column width of the table.
   */
  colSpan?: number;
  /**
   * The content of the cell.
   */
  content?: React.ReactNode | string;
  /**
   * Hook for automated testing.
   */
  testId?: string;
}

export interface I18nShape {
  /**
   * Accessible label applied to the previous page button in the pagination component.
   */
  prev: string;
  /**
   * Accessible label applied to the next page button in the pagination component.
   */
  next: string;
  /**
   * Accessible label applied to the current page button in the pagination component.
   */
  label: string;
}

export interface StatelessProps extends WithAnalyticsEventsProps {
  /**
   * Caption for the table styled as a heading.
   */
  caption?: React.ReactNode;

  /**
   * Cells to be placed in the head of the table.
   * Each element in the head creates a new column.
   */
  head?: HeadType;

  /**
   * Rows to be placed in the table.
   * Each row contains cells which should map to the ones defined in the head.
   *
   * Ensure each cell has a unique `key` per column - this is used for both Reacts reconcilation of lists and column sorting.
   */
  rows?: Array<RowType>;

  /**
   * Shown when the table has no content.
   */
  emptyView?: React.ReactElement<any>;

  /**
   * Configuration of the loading spinner shown when `isLoading` is true.
   * Defaults to `"large"` when a page has more than two rows, else `"small"`.
   */
  loadingSpinnerSize?: LoadingSpinnerSizeType;

  /**
   * Displays a loading spinner overlaid on top of the current page.
   */
  isLoading?: boolean;

  /**
   * Displays columns as their initial width regardless of the content that loads in.
   */
  isFixedSize?: boolean;

  /**
   * Controls how many rows should be displayed per page.
   */
  rowsPerPage?: number;

  /**
   * Total number of rows, in case of paginated data.
   */
  totalRows?: number;

  /**
   * Callback fired when the table page has changed,
   * useful when wanting to control the pagination of the table.
   */
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Callback fired when a column heading has been sorted,
   * useful when wanting to control the sort order of the table.
   */
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Callback fired when the rows displayed on a page have changed.
   */
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;

  /**
   * Page the table should show. Set by default to 1, so never undefined.
   */
  page?: number;

  /**
   * Column key that the rows should be sorted by.
   * Corresponds to the `key`'s defined in the `head` prop.
   */
  sortKey?: string;

  /**
   * Column sort order.
   */
  sortOrder?: SortOrderType;

  /**
   * Enables drag & drop sorting of table rows.
   */
  isRankable?: boolean;

  /**
   * Disables being able to drop rows on the table.
   * Drag will still function.
   */
  isRankingDisabled?: boolean;

  /**
   * Callback fired when a drag of a row has started.
   */
  onRankStart?: (rankStart: RankStart) => void;

  /**
   * Callback fired when a drop of a row has completed.
   */
  onRankEnd?: (rankEnd: RankEnd, uiAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Labels for the pagination wrapper, previous and next buttons used in pagination.
   * Defaults to `"pagination"`, `"previous"` and `"next"`.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  paginationi18n?: I18nShape;

  /**
   * Will highlight a row(s) of the table. Should be used to draw attention to a row; not to indicate selection.
   */
  highlightedRowIndex?: number | number[];

  /**
   *  A `testId` prop is provided for specified elements,
   *  which is a unique string that appears as a data attribute
   *  `data-testid` in the rendered code, serving as a hook for automated tests.
   *
   *  The value of `testId` is used to prefix `testId` props in given elements.
   *  - `{testId}--table` - Table.
   *  - `{testId}--head` - Table header.
   *  - `{testId}--head--{content of the cell}` - Table header cell can be identified by their content.
   *  - `{testId}--row--{index - content of the first cell}` - Table row.
   *  - `{testId}--body` - Table body.
   *  - `{testId}--body--{content of the cell}` - Table body cell can be identified by their content.
   *  - `{testId}--loadingSpinner` - The spinner overlaid when loading.
   * - `{testId}--pagination` - The table pagination.
   */
  testId?: string;

  /**
   * Used to provide a better description of the table for users with assistive technologies.
   * Rather than a screen reader speaking "Entering table", passing in an label
   * allows a custom message like "Entering Sample Numerical Data table".
   */
  label?: string;
}

export interface StatefulProps extends WithAnalyticsEventsProps {
  /**
   * Caption for the table styled as a heading.
   */
  caption?: React.ReactNode;

  /**
   * Cells to be placed in the head of the table.
   * Each element in the head creates a new column.
   */
  head?: HeadType;

  /**
   * Rows to be placed in the table.
   * Each row contains cells which should map to the ones defined in the head.
   * Rows accept standard HTML <tr> props in addition to those listed below.
   * Ensure each cell has a unique `key` per column - this is used for both React's reconciliation of lists and column sorting.
   */
  rows?: Array<RowType>;

  /**
   * Shown when the table has no content.
   */
  emptyView?: React.ReactElement<any>;

  /**
   * Configuration of the loading spinner shown when `isLoading` is true.
   * Defaults to `"large"` when a page has more than two rows, else `"small"`.
   */
  loadingSpinnerSize?: LoadingSpinnerSizeType;

  /**
   * Displays a loading spinner overlaid on top of the current page.
   */
  isLoading?: boolean;

  /**
   * Displays columns as their initial width regardless of the content that loads in.
   */
  isFixedSize?: boolean;

  /**
   * Controls how many rows should be displayed per page. If set, also turns on pagination, if there is more than one page to show.
   */
  rowsPerPage?: number;

  /**
   * Callback fired when the table page has changed,
   * useful when wanting to control dynamic table.
   */
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Callback fired when a column heading has been sorted,
   * useful when wanting to control dynamic table.
   */
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Callback fired when the rows displayed on a page have changed.
   */
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;

  /**
   * Page the table should show.
   * Useful when wanting to control dynamic table.
   */
  page?: number;

  /**
   * Default page dynamic table should show when initially rendering.
   */
  defaultPage?: number;

  /**
   * Column key that the rows should be sorted by.
   * Corresponds to the `key`'s defined in the `head` prop.
   * Useful when wanting to control dynamic table.
   */
  sortKey?: string;

  /**
   * Default column sort key that the rows should be sorted by.
   * Corresponds to the `key`'s defined in the `head` prop.
   */
  defaultSortKey?: string;

  /**
   * Column sort order.
   * Useful when wanting to control dynamic table.
   */
  sortOrder?: SortOrderType;

  /**
   * Default column sort order used when initially rendering.
   * Defaults to `"ASC"`.
   */
  defaultSortOrder?: SortOrderType;

  /**
   * Enables drag & drop sorting of table rows.
   */
  isRankable?: boolean;

  /**
   * Disables being able to drop rows on the table.
   * Drag will still function.
   */
  isRankingDisabled?: boolean;

  /**
   * Callback fired when a drag of a row has started.
   */
  onRankStart?: (rankStart: RankStart) => void;

  /**
   * Callback fired when a drop of a row has completed.
   */
  onRankEnd?: (rankEnd: RankEnd) => void;

  /**
   * Labels for the previous and next buttons used in pagination.
   * Defaults to `"previous"` and `"next"`.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  paginationi18n?: I18nShape;

  /**
   * Will highlight a row(s) of the table.
   */
  highlightedRowIndex?: number | number[];

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute
   * `data-testid` in the rendered code, serving as a hook for automated tests.
   * The value of `testId` is used to prefix `testId` props in given elements.
   *  - `{testId}--table` - Table.
   *  - `{testId}--head` - Table header.
   *  - `{testId}--head--{content of the cell}` - Table header cell can be identified by their content.
   *  - `{testId}--row--{index - content of the first cell}` - Table row.
   *  - `{testId}--body` - Table body.
   *  - `{testId}--body--{content of the cell}` - Table body cell can be identified by their content.
   *  - `{testId}--loadingSpinner` - The spinner overlaid when loading.
   *  - `{testId}--pagination` - The table pagination.
   */
  testId?: string;

  /**
   * Used to provide a better description of the table for users with assistive technologies.
   * Rather than a screen reader speaking "Entering table", passing in an label
   * allows a custom message like "Entering Sample Numerical Data table".
   */
  label?: string;
}

export interface RowType extends React.ComponentPropsWithoutRef<'tr'> {
  cells: Array<RowCellType>;
  key?: string;
  /**
   * A mouse handler to support interaction of a row.
   */
  onClick?: React.MouseEventHandler;
  /**
   * A key event handler to support interaction of a row.
   */
  onKeyPress?: React.KeyboardEventHandler;
  /**
   * Highlights the row. Should be used to draw attention to a row; not to indicate selection.
   */
  isHighlighted?: boolean;
  /**
   * Hook for automated testing.
   */
  testId?: string;
  ref?: Ref<HTMLTableRowElement>;
}

/**
 * Enum style type to determine whether sort results are ascending or descending.
 */
export type SortOrderType = 'ASC' | 'DESC';

/**
 * Determines the size of the table loading spinner.
 * This matches the underlying `Size` type in `@atlaskit/spinner`
 */
export type SpinnerSizeType = SizeType;

// TODO should this be removed?
export type LoadingSpinnerSizeType = 'small' | 'large';

export interface HeadCellType extends RowCellType {
  /**
   * Whether the column the cell sits above is sortable.
   */
  isSortable?: boolean;
  /**
   * The width of the cell as a percentage.
   */
  width?: number;
  /**
   * Whether the text in the cell will truncate or not if constrained.
   */
  shouldTruncate?: boolean;
}

export interface RankEndLocation {
  index: number; // index on current page
  afterKey?: string;
  beforeKey?: string;
}

export interface RankEnd {
  sourceIndex: number;
  sourceKey: string;
  destination?: RankEndLocation;
}

export interface RankStart {
  index: number;
  key: string;
}

export interface HeadType {
  cells: Array<HeadCellType>;
}
