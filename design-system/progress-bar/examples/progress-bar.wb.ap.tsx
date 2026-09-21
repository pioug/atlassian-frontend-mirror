import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import IndeterminateVrExample from './01-indeterminate.vr.ap';
import SuccessProgressBarVrExample from './02-success-progress-bar.vr.ap';
import TransparentProgressBarVrExample from './03-transparent-progress-bar.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);
// Default export required by accessibility tooling.
export default Basic;
export const IndeterminateVr: WorkbenchExample = wb(IndeterminateVrExample);
export const SuccessProgressBarVr: WorkbenchExample = wb(SuccessProgressBarVrExample);
export const TransparentProgressBarVr: WorkbenchExample = wb(TransparentProgressBarVrExample);
