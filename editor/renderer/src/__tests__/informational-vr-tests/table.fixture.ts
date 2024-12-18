import { generateRendererComponent } from '../__helpers/rendererComponents';
import { adfTableWithUnequalTableRows } from './__fixtures__';

export const BrokenTable = generateRendererComponent({
	document: adfTableWithUnequalTableRows,
	appearance: 'full-page',
	UNSTABLE_allowTableAlignment: true,
	UNSTABLE_allowTableResizing: true,
});
