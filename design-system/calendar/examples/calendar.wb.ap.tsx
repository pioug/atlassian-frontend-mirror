import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import ControlledExample from './1-controlled';
import I18nExample from './2-i18n';
import DisabledExample from './4-disabled';
import DisabledRangeExample from './5-disabled-range';
import DisabledFilterExample from './6-disabled-filter';
import BasicWithoutFocusExample from './7-basic-without-focus';
import TestingVrExample from './99-testing.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const Controlled: WorkbenchExample = wb(ControlledExample);
export const I18n: WorkbenchExample = wb(I18nExample);
export const Disabled: WorkbenchExample = wb(DisabledExample);
export const DisabledRange: WorkbenchExample = wb(DisabledRangeExample);
export const DisabledFilter: WorkbenchExample = wb(DisabledFilterExample);
export const BasicWithoutFocus: WorkbenchExample = wb(BasicWithoutFocusExample);
// Named "Testing" to match the Workbench URL used by existing integration tests.
export const Testing: WorkbenchExample = wb(TestingVrExample);
