import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ModalA11yBackgroundInertExample from '../97-modal-a11y-background-inert';

export const ModalA11yBackgroundInert: WorkbenchExample<typeof ModalA11yBackgroundInertExample> =
	wb(ModalA11yBackgroundInertExample);
