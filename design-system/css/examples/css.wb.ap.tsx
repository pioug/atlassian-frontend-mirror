import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LooseVrExample from './loose.vr.ap';
import StrictVrExample from './strict.vr.ap';

const LooseVr: WorkbenchExample = wb(LooseVrExample);

export default LooseVr;
export const StrictVr: WorkbenchExample = wb(StrictVrExample);
