import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-spec-based-validator';

export const FullPageWithSpecBasedValidator: WorkbenchExample<typeof Example> = wb(Example);
