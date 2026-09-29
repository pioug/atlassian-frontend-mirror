import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicPositioningExample from '../00-basic-positioning.vr.ap';

export const BasicPositioning: WorkbenchExample<typeof BasicPositioningExample> =
	wb(BasicPositioningExample);
