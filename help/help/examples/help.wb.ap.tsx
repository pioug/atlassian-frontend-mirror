import { wb, type WorkbenchExample } from '@atlassian/workbench';

import HelpDefaultContentExample from './0-Help-Default-Content';
import HelpOpenArticleUsingMockupApiExample from './1-Help-Open-Article-Using-Mockup-Api';
import HelpOpenArticleUsingAlgoliaExample from './2-Help-Open-Article-Using-Algolia';
import HelpWithAlgoliaExample from './3-Help-with-Algolia';
import HelpWithSearchArticlesOpenNewTabExample from './4-Help-with-Search-Articles-Open-New-Tab';
import HelpWithAiExample from './5-Help-with-ai';
import HelpOpenLinkSameTabExample from './6-Help-Open-Link-Same-Tab';

export const HelpDefaultContent: WorkbenchExample = wb(HelpDefaultContentExample);
export const HelpOpenArticleUsingMockupApi: WorkbenchExample = wb(
	HelpOpenArticleUsingMockupApiExample,
);
export const HelpOpenArticleUsingAlgolia: WorkbenchExample = wb(HelpOpenArticleUsingAlgoliaExample);
export const HelpWithAlgolia: WorkbenchExample = wb(HelpWithAlgoliaExample);
export const HelpWithSearchArticlesOpenNewTab: WorkbenchExample = wb(
	HelpWithSearchArticlesOpenNewTabExample,
);
export const HelpWithAi: WorkbenchExample = wb(HelpWithAiExample);
export const HelpOpenLinkSameTab: WorkbenchExample = wb(HelpOpenLinkSameTabExample);
