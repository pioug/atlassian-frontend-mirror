import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import NoIconVrExample from './1-no-icon.vr.ap';
import MaxWidthVrExample from './2-max-width.vr.ap';
import SpaciousVrExample from './3-spacious.vr.ap';
import DropdownTriggerVrExample from './4-dropdown-trigger.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
// Named "NoIcon" to match the Workbench URL used by existing integration tests.
export const NoIcon: WorkbenchExample = wb(NoIconVrExample);
// Named "MaxWidth" to match the Workbench URL used by existing integration tests.
export const MaxWidth: WorkbenchExample = wb(MaxWidthVrExample);
// Named "Spacious" to match the Workbench URL used by existing integration tests.
export const Spacious: WorkbenchExample = wb(SpaciousVrExample);
// Named "DropdownTrigger" to match the Workbench URL used by existing integration tests.
export const DropdownTrigger: WorkbenchExample = wb(DropdownTriggerVrExample);
