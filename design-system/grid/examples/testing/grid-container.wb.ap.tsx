import { wb, type WorkbenchExample } from '@atlassian/workbench';

import GridContainerExample from '../96-grid-container.vr.ap';

export const GridContainer: WorkbenchExample<typeof GridContainerExample> =
	wb(GridContainerExample);
