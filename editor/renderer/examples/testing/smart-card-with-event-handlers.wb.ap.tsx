import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../13-smart-card-with-event-handlers';

export const SmartCardWithEventHandlers: WorkbenchExample<typeof Example> = wb(Example);
