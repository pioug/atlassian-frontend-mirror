import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PositioningExample from '../02-positioning';

export const Positioning: WorkbenchExample<typeof PositioningExample> = wb(PositioningExample);
