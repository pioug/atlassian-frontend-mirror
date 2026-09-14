import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import ToggleHiddenElementExample from './01-toggle-hidden-element';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const ToggleHiddenElement: WorkbenchExample = wb(ToggleHiddenElementExample);
