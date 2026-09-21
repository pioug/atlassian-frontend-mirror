import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllVrExample from './all.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const All: WorkbenchExample = wb(AllVrExample);
// Default export required by accessibility tooling.
export default All;
