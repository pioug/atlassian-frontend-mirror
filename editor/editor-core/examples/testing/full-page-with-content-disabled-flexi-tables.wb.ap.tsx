import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-content-disabled-flexi-tables';

export const FullPageWithContentDisabledFlexiTables: WorkbenchExample<typeof Example> = wb(Example);
