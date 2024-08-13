import { adfNestedExpandInsideExpand } from './__fixtures__';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const NestedExpandRenderer = generateRendererComponent({
	document: adfNestedExpandInsideExpand,
	appearance: 'full-page',
});
