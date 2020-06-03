import { Identifier, MediaClient } from '@atlaskit/media-client';
import { HeadType } from '@atlaskit/dynamic-table/types';
import { SortOrderType } from '@atlaskit/dynamic-table/types';

export { SortOrderType };

export interface FileInfo {
  fileName: string;
  id: string;
}

export interface RowData {
  collectionName?: string;
  [key: string]: string | React.ReactNode;
}

export interface MediaTableItem {
  data: RowData;
  id: string;
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
  items: MediaTableItem[];
  mediaClient: MediaClient;
  columns: HeadType;
  totalItems: number;
  itemsPerPage?: number;
  pageNumber?: number;
  isLoading?: boolean;
  onSetPage?: (pageNumber: number) => void;
  onSort?: (key: string, sortOrder: SortOrderType) => void;
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
