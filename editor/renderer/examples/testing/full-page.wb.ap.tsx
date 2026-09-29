import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page';

export const FullPage: WorkbenchExample<typeof Example> = wb(Example);
