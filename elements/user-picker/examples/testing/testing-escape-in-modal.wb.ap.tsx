import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EscapeInModalExample from '../99-testing-escape-in-modal';

export const TestingEscapeInModal: WorkbenchExample<typeof EscapeInModalExample> =
	wb(EscapeInModalExample);
