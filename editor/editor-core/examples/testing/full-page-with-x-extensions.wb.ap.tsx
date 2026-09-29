import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-x-extensions';

export const FullPageWithXExtensions: WorkbenchExample<typeof Example> = wb(Example);
