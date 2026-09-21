import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StatefulVrExample from './0-stateful.vr.ap';
import StatelessExample from './1-stateless';
import DisabledVrExample from './2-disabled.vr.ap';
import RefExample from './4-ref';
import BoldExample from './5-bold';
import AriaToggleExample from './6-aria-toggle';
import TooltipExample from './7-tooltip';
import AnalyticsExample from './9-analytics';
import StatefulWithToggleEnabledVrExample from './10-stateful-with-toggle-enabled.vr.ap';
import LoadingExample from './11-loading';
import TestingExample from './99-testing';

// Explicit named export Used to generate integration-test URLs.
export const Stateful: WorkbenchExample = wb(StatefulVrExample);
// Default export required by accessibility tooling.
export default Stateful;
export const Stateless: WorkbenchExample = wb(StatelessExample);
export const StatefulWithToggleEnabledVr: WorkbenchExample = wb(StatefulWithToggleEnabledVrExample);
export const Loading: WorkbenchExample = wb(LoadingExample);
// Named "Disabled" to match the Workbench URL used by existing integration tests.
export const Disabled: WorkbenchExample = wb(DisabledVrExample);
export const Ref: WorkbenchExample = wb(RefExample);
export const Bold: WorkbenchExample = wb(BoldExample);
export const AriaToggle: WorkbenchExample = wb(AriaToggleExample);
export const Tooltip: WorkbenchExample = wb(TooltipExample);
export const Analytics: WorkbenchExample = wb(AnalyticsExample);
export const Testing: WorkbenchExample = wb(TestingExample);
