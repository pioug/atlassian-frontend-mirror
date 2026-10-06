import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const Basic: WorkbenchExample = wbWithReactUFO(
	() => import(/* webpackChunkName: "@atlaskit-internal_react-ufo-basic" */ '../01-basic'),
);
