import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagTopLayerEscapeExample from '../11-flag-top-layer-escape';

export const FlagTopLayerEscape: WorkbenchExample<typeof FlagTopLayerEscapeExample> =
	wb(FlagTopLayerEscapeExample);
