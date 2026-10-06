import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const BasicWithLateHold: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-basic-with-late-hold" */ '../34-basic-with-late-hold'
		),
);
