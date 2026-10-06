import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const SearchPageWithFasterSmartAnswers: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-search-page-with-faster-smart-answers" */ '../36-search-page-with-faster-smart-answers'
		),
);
