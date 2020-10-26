import {
  Identifier,
  FileIdentifier,
  MediaClient,
} from '@atlaskit/media-client';
import { HeadType } from '@atlaskit/dynamic-table/types';
import { SortOrderType } from '@atlaskit/dynamic-table/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

export type { SortOrderType };

export interface FileInfo {
  fileName: string;
  id: string;
}

export interface RowData {
  [key: string]: string | React.ReactNode;
}

export interface RowProps {
  className?: string;
}

export interface MediaTableItem {
  data: RowData;
  identifier: FileIdentifier;
  /** An object containing props that will be applied to the row component */
  rowProps?: RowProps;
}

// The dynamic-table doesn't expose a proper type, so here we define our own as a workaround
export interface OnSortData {
  key: string;
  sortOrder: SortOrderType;
  item: {
    content: React.ReactNode | string;
    isSortable: boolean;
    key: string;
    width: number;
  };
}

export interface MediaTableProps {
  /** The table rows to display in the current page */
  items: MediaTableItem[];
  mediaClient: MediaClient;
  /** Object describing the column headings */
  columns: HeadType;
  /** The total number of table rows. This is used to calculate pagination */
  totalItems: number;
  /** The maximum number of rows per page. No maximum by default */
  itemsPerPage?: number;
  /** The current page number */
  pageNumber?: number;
  /** The property that the table items are sorted by. This must match a key in columns.cells */
  sortKey?: string;
  /** The direction that the table items are sorted in - ascending or descending */
  sortOrder?: SortOrderType;
  /** Whether to show the loading state or not */
  isLoading?: boolean;
  /** Called when a pagination control is clicked. Provides the new page number to paginate by */
  onSetPage?: (pageNumber: number) => void;
  /** Called when a column header is clicked. Provides the key of the column and the new sortOrder to sort by */
  onSort?: (key: string, sortOrder: SortOrderType) => void;
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  /** Called when the preview is opened by the user clicking on an item in the table */
  onPreviewOpen?: () => void;
  /** Called when the preview is closed */
  onPreviewClose?: () => void;
}

export interface MediaTableState {
  mediaViewerSelectedItem?: Identifier;
  fileInfoState: Map<string, FileInfo>;
}

export interface ValidatedProps {
  validPageNumber: number;
  validTotalItems: number;
  validItemsPerPage: number;
}
