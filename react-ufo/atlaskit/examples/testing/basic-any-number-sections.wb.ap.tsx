import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const BasicAnyNumberSections: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-basic-any-number-sections" */ '../03-basic-any-number-sections'
		),
);
