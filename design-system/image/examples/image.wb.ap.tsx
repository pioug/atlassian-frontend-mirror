import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './basic.vr.ap';
import ThemedVrExample from './themed.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
// Named "Themed" to match the Workbench URL used by existing integration tests.
export const Themed: WorkbenchExample = wb(ThemedVrExample);
