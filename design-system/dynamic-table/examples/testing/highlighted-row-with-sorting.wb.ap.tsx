import { wb, type WorkbenchExample } from '@atlassian/workbench';

import HighlightedRowWithSortingExample from '../20-highlighted-row-with-sorting';

export const HighlightedRowWithSorting: WorkbenchExample<typeof HighlightedRowWithSortingExample> =
	wb(HighlightedRowWithSortingExample);
