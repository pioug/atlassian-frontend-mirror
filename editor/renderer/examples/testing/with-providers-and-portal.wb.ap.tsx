import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../2-with-providers-and-portal';

export const WithProvidersAndPortal: WorkbenchExample<typeof Example> = wb(Example);
