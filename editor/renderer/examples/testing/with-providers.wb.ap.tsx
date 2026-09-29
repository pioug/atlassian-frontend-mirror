import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../1-with-providers';

export const WithProviders: WorkbenchExample<typeof Example> = wb(Example);
