import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SelectionStatesExample from '../selection-states.vr.ap';

export const SelectionStates: WorkbenchExample<typeof SelectionStatesExample> =
	wb(SelectionStatesExample);
