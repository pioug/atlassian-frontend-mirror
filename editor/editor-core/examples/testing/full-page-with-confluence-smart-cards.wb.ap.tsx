import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-confluence-smart-cards';

export const FullPageWithConfluenceSmartCards: WorkbenchExample<typeof Example> = wb(Example);
