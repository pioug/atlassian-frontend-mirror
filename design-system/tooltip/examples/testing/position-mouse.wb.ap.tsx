import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PositionMouseExample from '../position-mouse.vr.ap';

export const PositionMouse: WorkbenchExample<typeof PositionMouseExample> =
	wb(PositionMouseExample);
