import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './basic.vr.ap';
import ThemedVrExample from './themed.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const ThemedVr: WorkbenchExample = wb(ThemedVrExample);
