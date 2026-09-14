import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import NoIconVrExample from './1-no-icon.vr.ap';
import MaxWidthVrExample from './2-max-width.vr.ap';
import SpaciousVrExample from './3-spacious.vr.ap';
import DropdownTriggerVrExample from './4-dropdown-trigger.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const NoIconVr: WorkbenchExample = wb(NoIconVrExample);
export const MaxWidthVr: WorkbenchExample = wb(MaxWidthVrExample);
export const SpaciousVr: WorkbenchExample = wb(SpaciousVrExample);
export const DropdownTriggerVr: WorkbenchExample = wb(DropdownTriggerVrExample);
