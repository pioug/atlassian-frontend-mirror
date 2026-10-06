import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const SearchPageWithSlowerSmartAnswersClassChange: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-search-page-with-slower-smart-answers-class-change" */ '../35-search-page-with-slower-smart-answers-class-change'
		),
);
