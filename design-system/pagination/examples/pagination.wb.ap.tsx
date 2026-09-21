import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './01-basic.vr.ap';
import WithAnalyticsExample from './03-with-analytics';
import WithCustomEllipsisVrExample from './04-with-custom-ellipsis.vr.ap';
import WithComplexDataExample from './05-with-complex-data';
import DisabledVrExample from './06-disabled.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
export const WithAnalytics: WorkbenchExample = wb(WithAnalyticsExample);
export const WithCustomEllipsisVr: WorkbenchExample = wb(WithCustomEllipsisVrExample);
export const WithComplexData: WorkbenchExample = wb(WithComplexDataExample);
export const DisabledVr: WorkbenchExample = wb(DisabledVrExample);
