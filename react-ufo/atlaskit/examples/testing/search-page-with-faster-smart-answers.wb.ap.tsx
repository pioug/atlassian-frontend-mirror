import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as SearchPageWithFasterSmartAnswersExample } from '../36-search-page-with-faster-smart-answers';

export const SearchPageWithFasterSmartAnswers: WorkbenchExample<
	typeof SearchPageWithFasterSmartAnswersExample
> = wb(SearchPageWithFasterSmartAnswersExample);
