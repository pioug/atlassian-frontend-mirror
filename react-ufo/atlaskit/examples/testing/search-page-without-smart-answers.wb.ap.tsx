import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as SearchPageWithoutSmartAnswersExample } from '../34-search-page-without-smart-answers';

export const SearchPageWithoutSmartAnswers: WorkbenchExample<
	typeof SearchPageWithoutSmartAnswersExample
> = wb(SearchPageWithoutSmartAnswersExample);
