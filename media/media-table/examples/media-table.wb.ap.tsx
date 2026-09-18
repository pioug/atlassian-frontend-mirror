import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MediaTableExample from './1-media-table';
import MediaTableAdditionalColumnsExample from './2-media-table-additional-columns';
import MediaTableLoadingAndEmptyExample from './3-media-table-loading-and-empty';
import MediaTableLoadingWithItemsExample from './4-media-table-loading-with-items';
import MediaTablePageNumberExample from './5-media-table-page-number';
import MediaTableLastPageExample from './6-media-table-last-page';
import MediaTableSinglePageExample from './7-media-table-single-page';
import MediaTableRowHoverExample from './8-media-table-row-hover';
import MediaTableRowClickingExample from './9-media-table-row-clicking';
import MediaTableRowHighlightingExample from './9-media-table-row-highlighting';

export const MediaTable: WorkbenchExample = wb(MediaTableExample);
export const MediaTableAdditionalColumns: WorkbenchExample = wb(MediaTableAdditionalColumnsExample);
export const MediaTableLoadingAndEmpty: WorkbenchExample = wb(MediaTableLoadingAndEmptyExample);
export const MediaTableLoadingWithItems: WorkbenchExample = wb(MediaTableLoadingWithItemsExample);
export const MediaTablePageNumber: WorkbenchExample = wb(MediaTablePageNumberExample);
export const MediaTableLastPage: WorkbenchExample = wb(MediaTableLastPageExample);
export const MediaTableSinglePage: WorkbenchExample = wb(MediaTableSinglePageExample);
export const MediaTableRowHover: WorkbenchExample = wb(MediaTableRowHoverExample);
export const MediaTableRowClicking: WorkbenchExample = wb(MediaTableRowClickingExample);
export const MediaTableRowHighlighting: WorkbenchExample = wb(MediaTableRowHighlightingExample);
