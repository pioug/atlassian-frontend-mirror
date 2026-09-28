import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LooseVrExample from '../loose.vr.ap';
import StrictVrExample from '../strict.vr.ap';

export const LooseVr: WorkbenchExample = wb(LooseVrExample);

export const StrictVr: WorkbenchExample = wb(StrictVrExample);
