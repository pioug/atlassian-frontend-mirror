import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const VcNoLayoutShiftFalse: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-vc-no-layout-shift-false" */ '../25-vc-no-layout-shift_false'
		),
);
