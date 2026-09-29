import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../22-placeholder-enabled';

export const PlaceholderEnabled: WorkbenchExample<typeof Example> = wb(Example);
