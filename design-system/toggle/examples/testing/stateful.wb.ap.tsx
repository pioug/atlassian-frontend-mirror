import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StatefulExample from '../0-stateful.vr.ap';

export const Stateful: WorkbenchExample<typeof StatefulExample> = wb(StatefulExample);
