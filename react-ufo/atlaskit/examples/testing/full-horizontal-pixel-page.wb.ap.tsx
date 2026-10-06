import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithReactUFO } from './wb-with-react-ufo';

export const FullHorizontalPixelPage: WorkbenchExample = wbWithReactUFO(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-full-horizontal-pixel-page" */ '../03-full-horizontal-pixel-page'
		),
);
