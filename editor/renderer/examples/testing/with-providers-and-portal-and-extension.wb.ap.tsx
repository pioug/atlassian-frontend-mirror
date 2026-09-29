import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../3-with-providers-and-portal-and-extension';

export const WithProvidersAndPortalAndExtension: WorkbenchExample<typeof Example> = wb(Example);
