import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CheckboxSelectExample from '../03-checkbox-select.vr.ap';

export const CheckboxSelect: WorkbenchExample<typeof CheckboxSelectExample> =
	wb(CheckboxSelectExample);
