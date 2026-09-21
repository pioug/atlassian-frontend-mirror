import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExampleUncontrolledVrExample from './00-basic-example-uncontrolled.vr.ap';
import BasicExampleControlledExample from './01-basic-example-controlled';
import DisabledDisplayVrExample from './02-disabled-display.vr.ap';
import WithTooltipExample from './03-with-tooltip';
import CustomRangeExampleSource from './04-custom-range-example';
import PlaygroundExample from './05-playground';
import MassiveRangeTestExample from './06-massive-range-test';
import RefExampleSource from './07-ref-example';
import RateLimitedExample from './08-rate-limited';
import DifferentValuesVrExample from './09-different-values.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const BasicExampleUncontrolled: WorkbenchExample = wb(BasicExampleUncontrolledVrExample);
// Default export required by accessibility tooling.
export default BasicExampleUncontrolled;
export const BasicExampleControlled: WorkbenchExample = wb(BasicExampleControlledExample);
export const DisabledDisplayVr: WorkbenchExample = wb(DisabledDisplayVrExample);
export const WithTooltip: WorkbenchExample = wb(WithTooltipExample);
export const CustomRangeExample: WorkbenchExample = wb(CustomRangeExampleSource);
export const Playground: WorkbenchExample = wb(PlaygroundExample);
export const MassiveRangeTest: WorkbenchExample = wb(MassiveRangeTestExample);
export const RefExample: WorkbenchExample = wb(RefExampleSource);
export const RateLimited: WorkbenchExample = wb(RateLimitedExample);
export const DifferentValuesVr: WorkbenchExample = wb(DifferentValuesVrExample);
