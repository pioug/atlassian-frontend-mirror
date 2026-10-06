import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const SsrPlaceholderV3: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-ssr-placeholder-v3" */ '../26-ssr-placeholder-v3'
		),
);
