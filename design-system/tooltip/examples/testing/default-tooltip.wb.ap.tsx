import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultTooltipExample from '../default-tooltip.vr.ap';

export const DefaultTooltip: WorkbenchExample<typeof DefaultTooltipExample> =
	wb(DefaultTooltipExample);
