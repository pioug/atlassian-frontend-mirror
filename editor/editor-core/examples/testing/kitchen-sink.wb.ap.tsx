import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../0-kitchen-sink';

export const KitchenSink: WorkbenchExample<typeof Example> = wb(Example);
