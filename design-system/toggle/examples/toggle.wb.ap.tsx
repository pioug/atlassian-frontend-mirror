import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StatefulVrExample from './0-stateful.vr.ap';
import StatelessExample from './1-stateless';
import StatefulWithToggleEnabledVrExample from './10-stateful-with-toggle-enabled.vr.ap';
import LoadingExample from './11-loading';
import DisabledVrExample from './2-disabled.vr.ap';
import RefExample from './4-ref';
import BoldExample from './5-bold';
import AriaToggleExample from './6-aria-toggle';
import TooltipExample from './7-tooltip';
import AnalyticsExample from './9-analytics';
import TestingExample from './99-testing';

const StatefulVr: WorkbenchExample = wb(StatefulVrExample);

export default StatefulVr;
export const Stateless: WorkbenchExample = wb(StatelessExample);
export const StatefulWithToggleEnabledVr: WorkbenchExample = wb(StatefulWithToggleEnabledVrExample);
export const Loading: WorkbenchExample = wb(LoadingExample);
export const DisabledVr: WorkbenchExample = wb(DisabledVrExample);
export const Ref: WorkbenchExample = wb(RefExample);
export const Bold: WorkbenchExample = wb(BoldExample);
export const AriaToggle: WorkbenchExample = wb(AriaToggleExample);
export const Tooltip: WorkbenchExample = wb(TooltipExample);
export const Analytics: WorkbenchExample = wb(AnalyticsExample);
export const Testing: WorkbenchExample = wb(TestingExample);
