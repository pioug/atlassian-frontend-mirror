import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const Fy2502StyleMutation: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-fy25-02-style-mutation" */ '../10-fy25_02-style-mutation'
		),
);
