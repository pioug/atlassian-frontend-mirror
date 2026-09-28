import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from '../basic.vr.ap';
import ThemedVrExample from '../themed.vr.ap';

export const Basic: WorkbenchExample = wb(BasicVrExample);

// Named "Themed" to match the Workbench URL used by existing integration tests.
export const Themed: WorkbenchExample = wb(ThemedVrExample);
