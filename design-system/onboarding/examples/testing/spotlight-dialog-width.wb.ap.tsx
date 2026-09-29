import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SpotlightDialogWidthExample from '../40-spotlight-dialog-width';

export const SpotlightDialogWidth: WorkbenchExample<typeof SpotlightDialogWidthExample> = wb(
	SpotlightDialogWidthExample,
);
