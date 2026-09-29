import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-company-hub';

export const FullPageCompanyHub: WorkbenchExample<typeof Example> = wb(Example);
