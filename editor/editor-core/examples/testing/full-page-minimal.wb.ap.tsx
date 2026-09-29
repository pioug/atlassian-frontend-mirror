import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-minimal';

export const FullPageMinimal: WorkbenchExample<typeof Example> = wb(Example);
