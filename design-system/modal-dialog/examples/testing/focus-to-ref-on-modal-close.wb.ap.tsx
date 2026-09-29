import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FocusToRefOnModalCloseExample from '../focus-to-ref-on-modal-close';

export const FocusToRefOnModalClose: WorkbenchExample<typeof FocusToRefOnModalCloseExample> = wb(
	FocusToRefOnModalCloseExample,
);
