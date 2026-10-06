import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const SearchPageWithSlowerSmartAnswers: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-search-page-with-slower-smart-answers" */ '../35-search-page-with-slower-smart-answers'
		),
);
