/* eslint-disable @repo/internal/react/consistent-types-definitions */
import { type default as React, type Ref } from 'react';

import {
  type UIAnalyticsEvent,
  type WithAnalyticsEventsProps,
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

  /**
   * Accessible label for the individual page numbers.
   * The page number is automatically appended to the pageLabel.
   * For Example, pageLabel="página" will render aria-label="página 1"
   * as the label for page 1.
   */
  pageLabel?: string;
}

export interface StatelessProps extends WithAnalyticsEventsProps {
  /**
   * Caption for the table styled as a heading. This appears before the table header, and is announced when people who use assistive technology land on the table.
   * If you don’t want the caption to appear on the page but do want it to be available for assistive technology, surround the caption with `<VisuallyHidden>`.
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
   * Sets the size of the loading spinner when `isLoading` is true.
   * Defaults to `"large"` when a page has more than two rows, otherwise it will be `"small"`.
   */
  loadingSpinnerSize?: LoadingSpinnerSizeType;

  /**
   * Displays a loading spinner overlaid on top of the current page.
   */
  isLoading?: boolean;

  /**
   * Accessible name for loading states spinner. Can be used for internationalization. Default is "Loading table".
   */
  loadingLabel?: string;

  /**
   * Use this to force columns to use their initial width regardless of the size of the content that loads in.
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
   * A callback that happens when the table page has changed.
   * Use this when you want to control the pagination of the table.
   */
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * A callback that happens when a column heading has been sorted. Use this to provide custom sorting for the table.
   */
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * A callback that happens when the rows displayed on a page have changed.
   */
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;

  /**
   * Page the table should show. Set by default to 1, so that it's never undefined.
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
   * Use this to enable drag and drop sorting of table rows.
   */
  isRankable?: boolean;

  /**
   * Disables being able to drop rows on the table.
   * We recommend using `isRankable` instead of this prop, and it will be deprecated in a future release.
   */
  isRankingDisabled?: boolean;

  /**
   * A callback that happens when a drag of a row has started.
   */
  onRankStart?: (rankStart: RankStart) => void;

  /**
   * A callback that happens when a drop of a row has completed.
   */
  onRankEnd?: (rankEnd: RankEnd, uiAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * Labels for the pagination wrapper, previous and next buttons used in pagination.
   * Defaults to `"Page"`, `"Pagination"`, `"Previous"` and `"Next"`.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  paginationi18n?: I18nShape;

  /**
   * Use this to set which rows will be highlighted. Never use highlighted rows to indicate that a person has selected or focused on the row.
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
   * If you don’t use a caption, then you’ll need to use label to describe the table for assistive technologies.
   * Avoid using both at the same time as they may conflict.
   * Rather than a screen reader speaking "Entering table", passing in an label allows a custom message like "Entering Jira Issues table".
   */
  label?: string;
}

export interface StatefulProps extends WithAnalyticsEventsProps {
  /**
   * Caption for the table styled as a heading. This appears before the table header, and is announced when people who use assistive technology land on the table.
   * If you don’t want the caption to appear on the page but do want it to be available for assistive technology, surround the caption with `<VisuallyHidden>`.
   */
  caption?: React.ReactNode;

  /**
   * Cells to be placed in the head of the table. Never put controls, like links and buttons in the table header.
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
   * Use this to set a label for assistive technology that describes the loading state.
   * The default label is "Loading table". You can customize this to be more specific to your table, for example “Loading issue table”.
   */
  loadingLabel?: string;

  /**
   * Use this to force columns to use their initial width regardless of the size of the content that loads in.
   */
  isFixedSize?: boolean;

  /**
   * Use this to control how many rows should be displayed per page. If the number of rows exceed one page, this will enable pagination.
   */
  rowsPerPage?: number;

  /**
   * A callback that happens when the table page has changed.
   */
  onSetPage?: (page: number, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * A callback that happens when a column heading has been sorted. Use this to provide custom sorting.
   */
  onSort?: (data: any, UIAnalyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * A callback that happens when the rows displayed on a page have changed.
   */
  onPageRowsUpdate?: (pageRows: Array<RowType>) => void;

  /**
   * Page the table should show.
   */
  page?: number;

  /**
   * When the table is initially rendered, use this to set which page number is shown by default.
   * In most circumstances, people will expect this to be page `1`.
   */
  defaultPage?: number;

  /**
   * Column key that the rows should be sorted by.
   * Corresponds to the `key`'s defined in the `head` prop.
   */
  sortKey?: string;

  /**
   * Sets which column the rows should be sorted by when the table is initially rendered.
   * Corresponds to the `key`'s defined in the `head` prop.
   */
  defaultSortKey?: string;

  /**
   * Column sort order.
   */
  sortOrder?: SortOrderType;

  /**
   * Default column sort order used when initially rendering.
   * Defaults to `"ASC"`.
   */
  defaultSortOrder?: SortOrderType;

  /**
   * Use this to enable drag and drop sorting of table rows.
   */
  isRankable?: boolean;

  /**
   * Disables being able to drop rows on the table.
   * We recommend using `isRankable` instead of this prop, and it will be deprecated in a future release.
   */
  isRankingDisabled?: boolean;

  /**
   * A callback that happens when a drag of a row has started.
   */
  onRankStart?: (rankStart: RankStart) => void;

  /**
   * A callback that happens when a drop of a row has completed.
   */
  onRankEnd?: (rankEnd: RankEnd) => void;

  /**
   * Labels for the previous and next buttons used in pagination.
   * Defaults to `"Previous"` and `"Next"`.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  paginationi18n?: I18nShape;

  /**
   * Use this to set if the row will be highlighted. Never use highlighted rows to indicate that a person has selected or focused on the row.
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
   * If you don’t use a caption, then you’ll need to use label to describe the table for assistive technologies.
   * Avoid using both at the same time as they may conflict.
   * Rather than a screen reader speaking "Entering table", passing in an label allows a custom message like "Entering Jira Issues table".
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
   * Use this to set if the row will be highlighted. Never use highlighted rows to indicate that a person has selected or focused on the row.
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
   * Whether the text in the cell will truncate or not if constrained. Avoid truncating content wherever possible.
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
