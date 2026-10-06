import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const BasicWith3SectionsButtonMinorInteractionsOverride: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-basic-with-3-sections-button-minor-interactions-override" */ '../33-basic-with-3-sections-button-minor-interactions-override'
		),
);
