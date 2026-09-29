import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as FrameworkRoutingDisplayNoneExample } from '../38-framework-routing-display-none';

export const FrameworkRoutingDisplayNone: WorkbenchExample<
	typeof FrameworkRoutingDisplayNoneExample
> = wb(FrameworkRoutingDisplayNoneExample);
