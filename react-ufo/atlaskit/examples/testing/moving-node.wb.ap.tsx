import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const MovingNode: WorkbenchExample = wbWithReactUFO(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_react-ufo-moving-node" */ '../06-moving-node'),
);
