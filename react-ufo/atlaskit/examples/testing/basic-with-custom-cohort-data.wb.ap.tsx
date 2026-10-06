import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const BasicWithCustomCohortData: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-basic-with-custom-cohort-data" */ '../03-basic-with-custom-cohort-data'
		),
);
