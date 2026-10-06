import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const SearchPageWithoutSmartAnswers: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-search-page-without-smart-answers" */ '../34-search-page-without-smart-answers'
		),
);
