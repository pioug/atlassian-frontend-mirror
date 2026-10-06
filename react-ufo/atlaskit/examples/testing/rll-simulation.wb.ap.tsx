import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const RllSimulation: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-rll-simulation" */ '../22-rll-simulation'
		),
);
