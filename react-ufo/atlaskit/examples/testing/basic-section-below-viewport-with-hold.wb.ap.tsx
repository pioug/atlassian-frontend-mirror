import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const BasicSectionBelowViewportWithHold: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-basic-section-below-viewport-with-hold" */ '../03-basic-section-below-viewport-with-hold'
		),
);
