import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-confluence-flexible-block-cards';

export const FullPageWithConfluenceFlexibleBlockCards: WorkbenchExample<typeof Example> =
	wb(Example);
