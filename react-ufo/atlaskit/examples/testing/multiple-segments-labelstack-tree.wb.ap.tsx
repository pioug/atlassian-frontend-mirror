import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const MultipleSegmentsLabelstackTree: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-multiple-segments-labelstack-tree" */ '../31-multiple-segments-labelstack-tree'
		),
);
