import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as MovingNodeExample } from '../06-moving-node';

export const MovingNode: WorkbenchExample<typeof MovingNodeExample> = wb(MovingNodeExample);
