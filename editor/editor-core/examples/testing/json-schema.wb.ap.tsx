import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../13-json-schema';

export const JsonSchema: WorkbenchExample<typeof Example> = wb(Example);
