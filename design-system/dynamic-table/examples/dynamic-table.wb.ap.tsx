import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StatefulVrExample from './0-stateful.vr.ap';
import StatelessExample from './1-stateless';
import LoadingStateNoRowsExample from './2-loading-state-no-rows';
import LoadingStateManyRowsVrExample from './3-loading-state-many-rows.vr.ap';
import LoadingStateFewRowsExample from './4-loading-state-few-rows';
import EmptyViewWithBodyAndNoHeaderExample from './5-empty-view-with-body-and-no-header';
import EmptyViewWithBodyVrExample from './6-empty-view-with-body.vr.ap';
import EmptyViewWithoutBodyExample from './7-empty-view-without-body';
import FixedSizeExample from './8-fixed-size';
import HeadlessExample from './9-headless';
import WithLotsOfPagesExample from './10-with-lots-of-pages';
import TogglePaginationExample from './11-toggle-pagination';
import WithLotsOfPagesRankableVrExample from './12-with-lots-of-pages-rankable.vr.ap';
import ColspanExample from './13-colspan';
import NumericSortingExample from './14-numeric-sorting';
import HighlightedRowVrExample from './15-highlighted-row.vr.ap';
import RowClickCallbackExample from './16-row-click-callback';
import FocusedRowExample from './17-focused-row';
import SortingExample from './18-sorting';
import SortingOnDynamicDataExample from './18-sorting-on-dynamic-data';
import SortingWithCustomLabelsExample from './18-sorting-with-custom-labels';
import StatelessWithSortingAndPaginationExample from './18-stateless-with-sorting-and-pagination';
import OverflowExample from './19-overflow';
import SortableHeaderTruncationVrExample from './19-sortable-header-truncation.vr.ap';
import HighlightedRowWithSortingExample from './20-highlighted-row-with-sorting';
import NoPaginationIfOnlyOnePageExample from './30-no-pagination-if-only-one-page';
import ReduceRowsPaginationGoesToLastPageExample from './31-reduce-rows-pagination-goes-to-last-page';
import FocusReturnToTableRowExample from './32-focus-return-to-table-row';
import TestingVrExample from './99-testing.vr.ap';

const StatefulVr: WorkbenchExample = wb(StatefulVrExample);

export default StatefulVr;
export const Stateless: WorkbenchExample = wb(StatelessExample);
export const WithLotsOfPages: WorkbenchExample = wb(WithLotsOfPagesExample);
export const TogglePagination: WorkbenchExample = wb(TogglePaginationExample);
export const WithLotsOfPagesRankableVr: WorkbenchExample = wb(WithLotsOfPagesRankableVrExample);
export const Colspan: WorkbenchExample = wb(ColspanExample);
export const NumericSorting: WorkbenchExample = wb(NumericSortingExample);
// Named "HighlightedRow" to match the Workbench URL used by existing integration tests.
export const HighlightedRow: WorkbenchExample = wb(HighlightedRowVrExample);
export const RowClickCallback: WorkbenchExample = wb(RowClickCallbackExample);
export const FocusedRow: WorkbenchExample = wb(FocusedRowExample);
export const Sorting: WorkbenchExample = wb(SortingExample);
export const SortingOnDynamicData: WorkbenchExample = wb(SortingOnDynamicDataExample);
export const SortingWithCustomLabels: WorkbenchExample = wb(SortingWithCustomLabelsExample);
export const StatelessWithSortingAndPagination: WorkbenchExample = wb(
	StatelessWithSortingAndPaginationExample,
);
export const Overflow: WorkbenchExample = wb(OverflowExample);
export const SortableHeaderTruncationVr: WorkbenchExample = wb(SortableHeaderTruncationVrExample);
export const LoadingStateNoRows: WorkbenchExample = wb(LoadingStateNoRowsExample);
export const HighlightedRowWithSorting: WorkbenchExample = wb(HighlightedRowWithSortingExample);
export const LoadingStateManyRowsVr: WorkbenchExample = wb(LoadingStateManyRowsVrExample);
export const NoPaginationIfOnlyOnePage: WorkbenchExample = wb(NoPaginationIfOnlyOnePageExample);
export const ReduceRowsPaginationGoesToLastPage: WorkbenchExample = wb(
	ReduceRowsPaginationGoesToLastPageExample,
);
export const FocusReturnToTableRow: WorkbenchExample = wb(FocusReturnToTableRowExample);
export const LoadingStateFewRows: WorkbenchExample = wb(LoadingStateFewRowsExample);
export const EmptyViewWithBodyAndNoHeader: WorkbenchExample = wb(
	EmptyViewWithBodyAndNoHeaderExample,
);
export const EmptyViewWithBodyVr: WorkbenchExample = wb(EmptyViewWithBodyVrExample);
export const EmptyViewWithoutBody: WorkbenchExample = wb(EmptyViewWithoutBodyExample);
export const FixedSize: WorkbenchExample = wb(FixedSizeExample);
export const Headless: WorkbenchExample = wb(HeadlessExample);
// Named "Testing" to match the Workbench URL used by existing integration tests.
export const Testing: WorkbenchExample = wb(TestingVrExample);
