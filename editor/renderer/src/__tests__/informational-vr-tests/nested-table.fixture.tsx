import { adfNestedTableInsideTable } from './__fixtures__';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const NestedTableRenderer = generateRendererComponent({
	document: adfNestedTableInsideTable,
	appearance: 'full-page',
	allowColumnSorting: true,
});
