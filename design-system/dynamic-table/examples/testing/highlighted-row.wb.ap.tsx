import { wb, type WorkbenchExample } from '@atlassian/workbench';

import HighlightedRowExample from '../15-highlighted-row.vr.ap';

export const HighlightedRow: WorkbenchExample<typeof HighlightedRowExample> =
	wb(HighlightedRowExample);
