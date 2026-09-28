import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StatefulVrExample from '../0-stateful.vr.ap';
import StatelessExample from '../1-stateless';
import LoadingStateNoRowsExample from '../2-loading-state-no-rows';
import LoadingStateManyRowsVrExample from '../3-loading-state-many-rows.vr.ap';
import LoadingStateFewRowsExample from '../4-loading-state-few-rows';
import EmptyViewWithBodyAndNoHeaderExample from '../5-empty-view-with-body-and-no-header';
import EmptyViewWithBodyVrExample from '../6-empty-view-with-body.vr.ap';
import EmptyViewWithoutBodyExample from '../7-empty-view-without-body';
import FixedSizeExample from '../8-fixed-size';
import HeadlessExample from '../9-headless';
import WithLotsOfPagesExample from '../10-with-lots-of-pages';
import TogglePaginationExample from '../11-toggle-pagination';
import WithLotsOfPagesRankableVrExample from '../12-with-lots-of-pages-rankable.vr.ap';
import ColspanExample from '../13-colspan';
import NumericSortingExample from '../14-numeric-sorting';
import HighlightedRowVrExample from '../15-highlighted-row.vr.ap';
import RowClickCallbackExample from '../16-row-click-callback';
import FocusedRowExample from '../17-focused-row';
import SortingExample from '../18-sorting';
import SortingOnDynamicDataExample from '../18-sorting-on-dynamic-data';
import SortingWithCustomLabelsExample from '../18-sorting-with-custom-labels';
import StatelessWithSortingAndPaginationExample from '../18-stateless-with-sorting-and-pagination';
import OverflowExample from '../19-overflow';
import SortableHeaderTruncationVrExample from '../19-sortable-header-truncation.vr.ap';
import HighlightedRowWithSortingExample from '../20-highlighted-row-with-sorting';
import NoPaginationIfOnlyOnePageExample from '../30-no-pagination-if-only-one-page';
import ReduceRowsPaginationGoesToLastPageExample from '../31-reduce-rows-pagination-goes-to-last-page';
import FocusReturnToTableRowExample from '../32-focus-return-to-table-row';
import TestingVrExample from '../99-testing.vr.ap';

export const StatefulVr: WorkbenchExample<typeof StatefulVrExample> = wb(StatefulVrExample);

export const Stateless: WorkbenchExample<typeof StatelessExample> = wb(StatelessExample);
export const WithLotsOfPages: WorkbenchExample<typeof WithLotsOfPagesExample> =
	wb(WithLotsOfPagesExample);
export const TogglePagination: WorkbenchExample<typeof TogglePaginationExample> =
	wb(TogglePaginationExample);
export const WithLotsOfPagesRankableVr: WorkbenchExample<typeof WithLotsOfPagesRankableVrExample> =
	wb(WithLotsOfPagesRankableVrExample);
export const Colspan: WorkbenchExample<typeof ColspanExample> = wb(ColspanExample);
export const NumericSorting: WorkbenchExample<typeof NumericSortingExample> =
	wb(NumericSortingExample);
// Named "HighlightedRow" to match the Workbench URL used by existing integration tests.
export const HighlightedRow: WorkbenchExample<typeof HighlightedRowVrExample> =
	wb(HighlightedRowVrExample);
export const RowClickCallback: WorkbenchExample<typeof RowClickCallbackExample> =
	wb(RowClickCallbackExample);
export const FocusedRow: WorkbenchExample<typeof FocusedRowExample> = wb(FocusedRowExample);
export const Sorting: WorkbenchExample<typeof SortingExample> = wb(SortingExample);
export const SortingOnDynamicData: WorkbenchExample<typeof SortingOnDynamicDataExample> = wb(
	SortingOnDynamicDataExample,
);
export const SortingWithCustomLabels: WorkbenchExample<typeof SortingWithCustomLabelsExample> = wb(
	SortingWithCustomLabelsExample,
);
export const StatelessWithSortingAndPagination: WorkbenchExample<
	typeof StatelessWithSortingAndPaginationExample
> = wb(StatelessWithSortingAndPaginationExample);
export const Overflow: WorkbenchExample<typeof OverflowExample> = wb(OverflowExample);
export const SortableHeaderTruncationVr: WorkbenchExample<
	typeof SortableHeaderTruncationVrExample
> = wb(SortableHeaderTruncationVrExample);
export const LoadingStateNoRows: WorkbenchExample<typeof LoadingStateNoRowsExample> =
	wb(LoadingStateNoRowsExample);
export const HighlightedRowWithSorting: WorkbenchExample<typeof HighlightedRowWithSortingExample> =
	wb(HighlightedRowWithSortingExample);
export const LoadingStateManyRowsVr: WorkbenchExample<typeof LoadingStateManyRowsVrExample> = wb(
	LoadingStateManyRowsVrExample,
);
export const NoPaginationIfOnlyOnePage: WorkbenchExample<typeof NoPaginationIfOnlyOnePageExample> =
	wb(NoPaginationIfOnlyOnePageExample);
export const ReduceRowsPaginationGoesToLastPage: WorkbenchExample<
	typeof ReduceRowsPaginationGoesToLastPageExample
> = wb(ReduceRowsPaginationGoesToLastPageExample);
export const FocusReturnToTableRow: WorkbenchExample<typeof FocusReturnToTableRowExample> = wb(
	FocusReturnToTableRowExample,
);
export const LoadingStateFewRows: WorkbenchExample<typeof LoadingStateFewRowsExample> = wb(
	LoadingStateFewRowsExample,
);
export const EmptyViewWithBodyAndNoHeader: WorkbenchExample<
	typeof EmptyViewWithBodyAndNoHeaderExample
> = wb(EmptyViewWithBodyAndNoHeaderExample);
export const EmptyViewWithBodyVr: WorkbenchExample<typeof EmptyViewWithBodyVrExample> = wb(
	EmptyViewWithBodyVrExample,
);
export const EmptyViewWithoutBody: WorkbenchExample<typeof EmptyViewWithoutBodyExample> = wb(
	EmptyViewWithoutBodyExample,
);
export const FixedSize: WorkbenchExample<typeof FixedSizeExample> = wb(FixedSizeExample);
export const Headless: WorkbenchExample<typeof HeadlessExample> = wb(HeadlessExample);
// Named "Testing" to match the Workbench URL used by existing integration tests.
export const Testing: WorkbenchExample<typeof TestingVrExample> = wb(TestingVrExample);
