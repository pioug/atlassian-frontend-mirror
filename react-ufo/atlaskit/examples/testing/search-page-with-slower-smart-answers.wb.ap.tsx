import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as SearchPageWithSlowerSmartAnswersExample } from '../35-search-page-with-slower-smart-answers';

export const SearchPageWithSlowerSmartAnswers: WorkbenchExample<
	typeof SearchPageWithSlowerSmartAnswersExample
> = wb(SearchPageWithSlowerSmartAnswersExample);
