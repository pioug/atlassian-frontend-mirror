import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-confluence-hydratable';

export const FullPageConfluenceHydratable: WorkbenchExample<typeof Example> = wb(Example);
