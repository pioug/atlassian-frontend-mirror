import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import IndeterminateVrExample from './01-indeterminate.vr.ap';
import SuccessProgressBarVrExample from './02-success-progress-bar.vr.ap';
import TransparentProgressBarVrExample from './03-transparent-progress-bar.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const IndeterminateVr: WorkbenchExample = wb(IndeterminateVrExample);
export const SuccessProgressBarVr: WorkbenchExample = wb(SuccessProgressBarVrExample);
export const TransparentProgressBarVr: WorkbenchExample = wb(TransparentProgressBarVrExample);
